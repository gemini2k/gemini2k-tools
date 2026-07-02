// 빌드: src/<카테고리>/*.html 을 dist/ 루트로 평면 출력 + 공용 자산 복사 + sitemap 생성.
// 서비스 URL은 평면 유지(/percent.html). 개발은 카테고리 폴더에서. 의존성 0(Node 내장 fs만).
// 실행: node build.mjs
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, process.env.DIST_DIR || 'dist');   // 출력 폴더 override(dist 락 우회용)
const BASE = 'https://gemini2k.co.kr';

// dist 초기화
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 1) 루트 공용 자산 복사(html·빌드·소스·문서·원본CSV 제외)
const SKIP = new Set([
  'src', 'dist', 'build.mjs', 'genaudit.mjs', 'genaudit.specs.mjs', 'genaudit.specs2.mjs', 'genaudit.specs3.mjs', 'genaudit.specs4.mjs', 'genaudit.specs5.mjs', 'addaudit.mjs', 'deploy', 'node_modules', '.git', '.gitignore',
  'README.md', 'LICENSE', 'NOTICE', '__pycache__', 'package.json', 'package-lock.json',
  'apps'   // 대용량 자체호스팅 앱(CyberChef·Excalidraw)은 별도 1회 업로드, 라우팅 배포에서 제외
]);
let assets = 0;
const DIST_BASE = path.basename(DIST);
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || name === DIST_BASE) continue;   // 출력 폴더 자체는 복사 제외(override 포함)
  if (name.endsWith('.csv')) continue;          // 법정동 원본(대용량) 제외
  if (name.endsWith('.html')) continue;         // 루트 html 없음(있어도 무시)
  fs.cpSync(path.join(ROOT, name), path.join(DIST, name), { recursive: true });
  assets++;
}

// 2) src html 평면 복사 + 중복 파일명 검사
const htmls = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmls.push(p);
  }
})(SRC);
const seen = new Map();
for (const f of htmls) {
  const base = path.basename(f);
  if (seen.has(base)) throw new Error('파일명 중복: ' + base + ' (' + f + ' vs ' + seen.get(base) + ')');
  seen.set(base, f);
  fs.copyFileSync(f, path.join(DIST, base));
}

// 2.5) 페이지별 i18n/registry 인라인 최적화 (1000+ 도구 확장 대비)
//   - i18n-core.js = 엔진 + 공통/구버전 도구 내부 문자열 (tool.*.t/.d 제거 → 크기 고정)
//   - 각 도구 페이지: i18n.js(전체)→i18n-core.js + 자기·관련 문자열 인라인, tools.js(전체)→자기·관련 항목 인라인
//   - 허브(index.html)는 전체 로드 유지(모든 카드 제목 필요)
function sandbox(code){
  const win = {};
  const noop = function(){};
  const doc = { readyState:'complete', documentElement:{}, addEventListener:noop,
                querySelectorAll:function(){return [];}, getElementById:function(){return null;} };
  const nav = { language:'ko' };
  const ls = { getItem:function(){return null;}, setItem:noop };
  win.navigator=nav; win.localStorage=ls; win.document=doc;
  new Function('window','document','navigator','localStorage','console', code)(win, doc, nav, ls, console);
  return win;
}
const i18nSrc = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');
const toolsSrc = fs.readFileSync(path.join(ROOT, 'tools.js'), 'utf8');
const I18N = sandbox(i18nSrc).I18N;
const TOOLS = sandbox(toolsSrc).TOOLS;
const LANGS = Object.keys(I18N);
const isToolKey = k => /^tool\.[a-z0-9]+\.[td]$/.test(k);
// 페이지가 참조하는 i18n 키 스캔(data-i18n*/t()) → 정확히 한 페이지만 쓰는 키 = 페이지전용 → core 에서 빼고 페이지별 인라인(core 크기 고정·확장성).
//   (JS 파일·여러 페이지 공용 키 gc./ak./공통 등은 refCount 0 또는 ≥2 라 core 유지)
const KEYREF = /data-i18n(?:-ph|-html)?="([^"]+)"|[^A-Za-z0-9_$.]t\((['"])([^'"]+)\2\)/g;
const refByFile = {}, refCount = {};
for (const f of fs.readdirSync(DIST)) {
  if (!f.endsWith('.html')) continue;
  const h = fs.readFileSync(path.join(DIST, f), 'utf8');
  const set = refByFile[f] = new Set(); let m; KEYREF.lastIndex = 0;
  while ((m = KEYREF.exec(h))) { const k = m[1] || m[3]; if (k && I18N.ko[k] != null && !isToolKey(k)) set.add(k); }
  set.forEach(k => { refCount[k] = (refCount[k] || 0) + 1; });
}
const isPageKey = k => refCount[k] === 1;   // 한 페이지 전용 본문키
// i18n-core.js 생성 (tool.*.t/.d + 페이지전용 본문키 제거 → 크기 고정)
const coreDict = {};
for (const l of LANGS){ coreDict[l]={}; for (const k in I18N[l]) if(!isToolKey(k) && !isPageKey(k)) coreDict[l][k]=I18N[l][k]; }
const engineIdx = i18nSrc.lastIndexOf('(function(){');
if (engineIdx < 0) throw new Error('i18n 엔진 구간을 찾지 못했습니다');
const engine = i18nSrc.slice(engineIdx);
fs.writeFileSync(path.join(DIST, 'i18n-core.js'), 'window.I18N=' + JSON.stringify(coreDict) + ';\n' + engine);
// 레지스트리 인덱스
const byKey = {}; TOOLS.forEach(t => { byKey[t.key]=t; });
const byHref = {}; TOOLS.forEach(t => { byHref[t.h]=t; });
function relatedKeys(cur){ // tool-shell.relatedHtml 와 동일 로직
  const keys=[]; const add=k=>{ if(k && k!==cur.key && keys.indexOf(k)<0 && byKey[k]) keys.push(k); };
  (cur.related||[]).forEach(add);
  for (const t of TOOLS) if (t.cat===cur.cat) add(t.key);
  return keys.slice(0,6);
}
function toolStrings(keys){ const p={}; for(const l of LANGS){ p[l]={}; for(const k of keys){
  const t=I18N[l]['tool.'+k+'.t'], d=I18N[l]['tool.'+k+'.d']; if(t!=null)p[l]['tool.'+k+'.t']=t; if(d!=null)p[l]['tool.'+k+'.d']=d; } } return p; }
function subsetEntry(t){ return { key:t.key, h:t.h, ic:t.ic, chip:t.chip, cat:t.cat, related:t.related||[] }; }

// 2.2) 카테고리 랜딩페이지 생성 (cat-<slug>.html, 레지스트리 기반·한국어 본문·크롤 가능)
//   - 이후 i18n-opt/캐시버스팅/PWA/SEO 루프가 자동 처리(twitter 카드 등). breadcrumb 은 템플릿에 직접 baked.
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ldEscCat = s => s.replace(/</g,'\\u003c');
const CAT_SLUG = { '텍스트':'text','계산기':'calc','심리·운세':'fortune','생성기':'gen','변환기':'convert',
  '이미지':'image','PDF':'pdf','감리·검증':'audit','보안·진단':'security','개발자':'dev','시간':'time',
  '개인정보':'pii','GIS':'gis','데이터':'data','건강':'health','게임':'game','시각화':'viz','문서':'doc' };
const CAT_BLURB = {
  text:'글자수 세기·텍스트 비교·대소문자 변환 등 글과 문서 작업을 돕는 도구',
  calc:'대출이자·퍼센트·부가세·평수 등 일상과 금융에 쓰는 계산기',
  fortune:'MBTI·사주·바이오리듬 등 재미로 보는 심리·운세 도구(참고용)',
  gen:'QR코드·비밀번호·UUID·바코드 등 즉석 생성 도구',
  convert:'단위·색상·음력·인코딩 등 형식을 바꿔주는 변환 도구',
  image:'이미지 압축·리사이즈·자르기·워터마크·EXIF 제거 등 사진 편집 도구',
  pdf:'PDF 합치기·나누기·이미지 변환·텍스트 추출 등 PDF 도구',
  audit:'요구사항추적표(RTM)·위험관리대장·테스트케이스·EVM 등 정보시스템 감리·검증 전문 도구',
  security:'CVSS·보안약점·시크릿 스캔·보안 헤더 점검 등 보안 진단 도구',
  dev:'JSON·정규식·JWT·해시·Base64 등 개발자 보조 도구',
  time:'세계시계·타이머·작업일수 계산 등 시간과 날짜 도구',
  pii:'개인정보 마스킹·탐지·가명처리·재식별 위험평가 등 비식별 전문 도구(브라우저 안에서만 처리)',
  gis:'좌표계 변환·웹지도·WKT/GeoJSON·공간 비식별 등 공간정보(GIS) 도구',
  data:'CSV 정제·병합·피벗·통계·회귀분석 등 데이터 분석 도구',
  health:'BMI·칼로리·심박수·수면 등 건강 참고 계산기(의료 조언 아님)',
  game:'2048·테트리스·3D 게임 등 브라우저에서 바로 즐기는 게임',
  viz:'차트·다이어그램·마인드맵·배색 등 시각화 도구',
  doc:'엑셀↔CSV·워드·PPT·한글(HWPX) 텍스트 추출 등 문서 변환 도구'
};
const CATS = []; TOOLS.forEach(t => { if (CATS.indexOf(t.cat) < 0) CATS.push(t.cat); });
for (const c of CATS) if (!CAT_SLUG[c]) throw new Error('카테고리 슬러그 누락: ' + c);
const catUrl = c => '/cat-' + CAT_SLUG[c] + '.html';
function buildCatPage(cat){
  const slug = CAT_SLUG[cat], label = (I18N.ko && I18N.ko['cat.'+cat]) || cat;
  const list = TOOLS.filter(t => t.cat === cat);
  const n = list.length, url = BASE + catUrl(cat);
  const blurb = CAT_BLURB[slug] || (label + ' 관련 도구');
  const desc = blurb + ' ' + n + '종. 모두 브라우저에서 즉시 실행되고 설치가 필요 없으며 입력 데이터는 서버로 전송되지 않습니다.';
  const ogdesc = blurb + ' ' + n + '종. 브라우저에서 즉시, 설치·가입 없이.';
  const title = label + ' 도구 모음 (' + n + '종) — 빛의여행(gemini2k) 도구';
  const cards = list.map(t => {
    const nm = esc((I18N.ko && I18N.ko['tool.'+t.key+'.t']) || t.key);
    const d  = esc((I18N.ko && I18N.ko['tool.'+t.key+'.d']) || '');
    return '<a class="tool" href="' + t.h + '"><span class="ic ' + t.chip + '">' + t.ic + '</span>'
      + '<div><h3>' + nm + '</h3><p>' + d + '</p></div></a>';
  }).join('');
  const bc = { '@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
    { '@type':'ListItem','position':1,'name':'홈','item':BASE+'/' },
    { '@type':'ListItem','position':2,'name':label,'item':url } ] };
  const il = { '@context':'https://schema.org','@type':'ItemList','name':title,'numberOfItems':n,
    'itemListElement': list.map((t,i)=>({ '@type':'ListItem','position':i+1,
      'name':(I18N.ko && I18N.ko['tool.'+t.key+'.t'])||t.key, 'url':BASE+'/'+t.h })) };
  return '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8"/>\n'
    + '<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>\n<link rel="icon" href="/favicon.ico" sizes="any"/>\n'
    + '<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1"/>\n'
    + '<meta name="google-site-verification" content="21lomLkO-jad8-GrfWyLlP2mW99lqPI9WTLL34GY1kU"/>\n'
    + '<meta name="naver-site-verification" content="f9485999829eaa979c75b76aa887816429bb18f3"/>\n'
    + '<title>' + esc(title) + '</title>\n'
    + '<meta name="description" content="' + esc(desc) + '"/>\n'
    + '<link rel="canonical" href="' + url + '"/>\n'
    + '<meta property="og:type" content="website"/>\n<meta property="og:site_name" content="빛의여행(gemini2k) 도구"/>\n'
    + '<meta property="og:title" content="' + esc(title) + '"/>\n'
    + '<meta property="og:description" content="' + esc(ogdesc) + '"/>\n'
    + '<meta property="og:url" content="' + url + '"/>\n<meta property="og:image" content="' + BASE + '/og.png"/>\n'
    + '<link rel="stylesheet" href="/fonts/pretendard.css"/>\n<link rel="stylesheet" href="style.css"/>\n'
    + '<script src="ga.js"></script>\n<script src="theme.js"></script>\n<script src="i18n.js"></script>\n<script src="tools.js"></script>\n'
    + '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5930096672475061" crossorigin="anonymous"></script>\n'
    + '<script type="application/ld+json">' + ldEscCat(JSON.stringify(bc)) + '</script>\n'
    + '<script type="application/ld+json">' + ldEscCat(JSON.stringify(il)) + '</script>\n'
    + '</head>\n<body>\n<div class="toolwrap">\n'
    + '<h1>' + esc(label) + ' 도구</h1>\n'
    + '<p class="sub">' + esc(blurb) + ' <b>' + n + '종</b>. 모두 100% 브라우저에서 동작하고 설치가 필요 없으며 입력 데이터는 서버로 전송되지 않습니다.</p>\n'
    + '<div class="grid">' + cards + '</div>\n'
    + '</div>\n<script src="tool-shell.js"></script>\n</body>\n</html>\n';
}
let catPages = 0;
for (const c of CATS){ fs.writeFileSync(path.join(DIST, 'cat-' + CAT_SLUG[c] + '.html'), buildCatPage(c)); catPages++; }

let optimized=0;
for (const f of fs.readdirSync(DIST)){
  if (!f.endsWith('.html') || f==='index.html') continue;
  const fp=path.join(DIST,f); let html=fs.readFileSync(fp,'utf8');
  if (html.indexOf('<script src="i18n.js"></script>')<0) continue;
  const cur=byHref[f];
  let patchScript='<script src="i18n-core.js"></script>';
  const P={}; LANGS.forEach(l=>{P[l]={};});
  if (cur){ const tk=toolStrings([cur.key].concat(relatedKeys(cur))); for(const l of LANGS) Object.assign(P[l], tk[l]); }
  const refs=refByFile[f];   // 페이지전용 본문키 인라인
  if (refs){ refs.forEach(k=>{ if(isPageKey(k)){ for(const l of LANGS){ const v=I18N[l][k]; if(v!=null)P[l][k]=v; } } }); }
  if (LANGS.some(l=>Object.keys(P[l]).length))
    patchScript += '\n<script>(function(){var P='+JSON.stringify(P)+',I=window.I18N=window.I18N||{};for(var l in P){I[l]=I[l]||{};for(var k in P[l])I[l][k]=P[l][k];}})();</script>';
  html=html.replace('<script src="i18n.js"></script>', patchScript);
  const sub = cur ? [subsetEntry(cur)].concat(relatedKeys(cur).map(k=>subsetEntry(byKey[k]))) : [];
  html=html.replace('<script src="tools.js"></script>', '<script>window.TOOLS='+JSON.stringify(sub)+';</script>');
  fs.writeFileSync(fp, html); optimized++;
}

// 2.5) 앱 코드 캐시버스팅 — 배포마다 ?v= 갱신해 모바일 캐시 staleness 방지 (vendor/fonts 는 불변이라 제외)
const VER = Date.now().toString(36);
const APP = ['style.css','ga.js','theme.js','i18n.js','i18n-core.js','tools.js','tool-shell.js','audit-kit.js','help-export.js'];
const appRe = new RegExp('(src|href)="(' + APP.map(f=>f.replace(/\./g,'\\.')).join('|') + ')"', 'g');
const PWA_HEAD = '<link rel="manifest" href="/manifest.json"/><meta name="theme-color" content="#1AA3E0"/>'
  + '<meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="default"/>'
  + '<meta name="apple-mobile-web-app-title" content="gemini2k 도구"/>';
let busted=0;
for (const f of fs.readdirSync(DIST)){
  if (!f.endsWith('.html')) continue;
  const fp=path.join(DIST,f); let html=fs.readFileSync(fp,'utf8');
  const out=html.replace(appRe, '$1="$2?v='+VER+'"');
  let html2=out;
  if (html2.indexOf('rel="manifest"')<0 && html2.indexOf('</head>')>=0)
    html2=html2.replace('</head>', PWA_HEAD+'</head>');           // PWA: 매니페스트·테마색 주입(멱등)
  if (html2!==html){ fs.writeFileSync(fp, html2); busted++; }
}
// offline.html(루트 HTML)은 자산 복사에서 제외되므로 명시 복사
if (fs.existsSync(path.join(ROOT,'offline.html'))) fs.copyFileSync(path.join(ROOT,'offline.html'), path.join(DIST,'offline.html'));

// 2.7) SEO 보강 주입(멱등): Twitter Card(전 페이지, og 기반) + BreadcrumbList JSON-LD(도구 페이지)
//   - HowTo/FAQPage 는 구글 리치결과 폐지(2023)로 제외. Breadcrumb 은 검색결과 경로 표시에 현역.
//   - 도입 2026-06-30. dist 락 시 scratchpad/seo_patch.mjs 로 제자리 패치(동일 로직) 가능.
const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
const ldEsc = s => s.replace(/</g, '\\u003c');   // JSON-LD 안 </script> 차단
let seoInjected = 0;
for (const f of fs.readdirSync(DIST)){
  if (!f.endsWith('.html')) continue;
  const fp = path.join(DIST, f); let html = fs.readFileSync(fp, 'utf8');
  const headEnd = html.indexOf('</head>');
  if (headEnd < 0) continue;
  let inject = '';

  // (a) Twitter Card — og 메타에서 도출, 아직 없을 때만
  if (html.indexOf('twitter:card') < 0){
    const ogT = attr(html, /<meta property="og:title" content="([^"]*)"/);
    const ogD = attr(html, /<meta property="og:description" content="([^"]*)"/);
    const ogI = attr(html, /<meta property="og:image" content="([^"]*)"/);
    if (ogT){
      inject += '<meta name="twitter:card" content="summary_large_image"/>';
      inject += '<meta name="twitter:title" content="' + ogT + '"/>';
      if (ogD) inject += '<meta name="twitter:description" content="' + ogD + '"/>';
      if (ogI) inject += '<meta name="twitter:image" content="' + ogI + '"/>';
    }
  }

  // (b) BreadcrumbList(홈 > 카테고리 > 도구) — 레지스트리 기반, 도구 페이지만, 아직 없을 때만
  const cur = byHref[f];
  if (cur && html.indexOf('BreadcrumbList') < 0){
    const title = (I18N.ko && I18N.ko['tool.' + cur.key + '.t'])
      || (attr(html, /<title>([^<]*)<\/title>/) || '').replace(/\s*[—-].*$/, '').trim() || cur.h;
    const catLabel = (I18N.ko && I18N.ko['cat.' + cur.cat]) || cur.cat;
    const bc = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: BASE + '/' },
        { '@type': 'ListItem', position: 2, name: catLabel, item: BASE + catUrl(cur.cat) },
        { '@type': 'ListItem', position: 3, name: title, item: BASE + '/' + cur.h }
      ]
    };
    inject += '<script type="application/ld+json">' + ldEsc(JSON.stringify(bc)) + '</script>';
  }

  if (inject){ html = html.slice(0, headEnd) + inject + html.slice(headEnd); fs.writeFileSync(fp, html); seoInjected++; }
}

// 2.8) 언어별 정적 URL 생성 (/en /zh /ja, ko=루트) + hreflang
//   - 본문은 window.__FORCE_LANG + i18n 엔진이 런타임 번역(Googlebot JS 렌더). head(title/desc/og/canonical/hreflang/lang)는 정적 번역.
const LANGS_OUT = [['en', 'en'], ['zh', 'zh-CN'], ['ja', 'ja']];
const SITE = { ko: '빛의여행(gemini2k) 도구', en: 'gemini2k Tools', zh: 'gemini2k 工具', ja: 'gemini2k ツール' };
const IDX_TITLE = { en: 'Free Online Tools — gemini2k', zh: '免费在线工具 — gemini2k', ja: '無料オンラインツール — gemini2k' };
const IDX_DESC = { en: '300+ free, privacy-first browser tools: text, calculators, converters, image/PDF, developer, GIS, games and more. No install, no upload.', zh: '300+ 款免费、注重隐私的浏览器工具：文本、计算器、转换、图像/PDF、开发者、GIS、游戏等。免安装、不上传。', ja: '300以上の無料・プライバシー重視のブラウザツール：テキスト・計算機・変換・画像/PDF・開発者・GIS・ゲームなど。インストール不要、アップロードなし。' };
const slug2cat = {}; CATS.forEach(c => { slug2cat['cat-' + CAT_SLUG[c] + '.html'] = c; });
const attrEsc = s => esc(s).replace(/"/g, '&quot;');
const pageFiles = fs.readdirSync(DIST).filter(f => f.endsWith('.html') && f !== 'offline.html');

function hreflangBlock(file) {
  const koLoc = file === 'index.html' ? BASE + '/' : BASE + '/' + file;
  let out = '<link rel="alternate" hreflang="ko" href="' + koLoc + '"/>';
  for (const [l, hl] of LANGS_OUT) { const loc = file === 'index.html' ? BASE + '/' + l + '/' : BASE + '/' + l + '/' + file; out += '<link rel="alternate" hreflang="' + hl + '" href="' + loc + '"/>'; }
  out += '<link rel="alternate" hreflang="x-default" href="' + koLoc + '"/>';
  return out;
}
const absolutize = html => html.replace(/(src|href)="([^"\/][^"]*\.(?:js|css))(\?[^"]*)?"/g, (m, a, p, q) => a + '="/' + p + (q || '') + '"');

// (a) ko 루트 페이지에 hreflang 주입
for (const f of pageFiles) {
  const fp = path.join(DIST, f); let h = fs.readFileSync(fp, 'utf8');
  if (h.indexOf('hreflang') < 0) { const he = h.indexOf('</head>'); if (he >= 0) { fs.writeFileSync(fp, h.slice(0, he) + hreflangBlock(f) + h.slice(he)); } }
}
// (b) 언어 변형 생성
const langUrls = [];
let langPages = 0;
function localize(html, file, lang, htmlLang) {
  const loc = file === 'index.html' ? BASE + '/' + lang + '/' : BASE + '/' + lang + '/' + file;
  html = html.replace(/<html lang="[^"]*"/, '<html lang="' + htmlLang + '"');
  html = html.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/><script>window.__FORCE_LANG=' + JSON.stringify(lang) + ';</script>');
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + loc + '$2');
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + loc + '$2');
  html = html.replace(/(<meta property="og:site_name" content=")[^"]*(")/, '$1' + attrEsc(SITE[lang]) + '$2');
  html = html.replace(/\/og\.png"/g, '/og-' + lang + '.png"');   // og:image·twitter:image 를 언어별 카드로
  html = html.replace(/"inLanguage"\s*:\s*"ko"/g, '"inLanguage":"' + lang + '"');
  // 제목/설명 번역
  let title = null, desc = null;
  const cur = byHref[file];
  if (cur && I18N[lang]) { const t = I18N[lang]['tool.' + cur.key + '.t'], d = I18N[lang]['tool.' + cur.key + '.d']; if (t) title = t + ' — ' + SITE[lang]; if (d) desc = d; }
  else if (file === 'index.html') { title = IDX_TITLE[lang]; desc = IDX_DESC[lang]; }
  else if (slug2cat[file] && I18N[lang]) { const lab = I18N[lang]['cat.' + slug2cat[file]] || slug2cat[file]; title = lab + ' — ' + SITE[lang]; }
  if (title) { html = html.replace(/<title>[^<]*<\/title>/, '<title>' + attrEsc(title) + '</title>'); html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + attrEsc(title) + '$2'); html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + attrEsc(title) + '$2'); }
  if (desc) { html = html.replace(/(<meta name="description" content=")[^"]*(")/, '$1' + attrEsc(desc) + '$2'); html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + attrEsc(desc) + '$2'); html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + attrEsc(desc) + '$2'); }
  return absolutize(html);
}
for (const [lang, htmlLang] of LANGS_OUT) {
  const dir = path.join(DIST, lang); fs.mkdirSync(dir, { recursive: true });
  for (const f of pageFiles) {
    const src = fs.readFileSync(path.join(DIST, f), 'utf8');
    fs.writeFileSync(path.join(dir, f), localize(src, f, lang, htmlLang));
    langUrls.push(f === 'index.html' ? '/' + lang + '/' : '/' + lang + '/' + f);
    langPages++;
  }
}

// 3) sitemap.xml + robots.txt (레지스트리 기반)
const reg = fs.readFileSync(path.join(SRC, '_site', 'index.html'), 'utf8'); // 존재 확인용
const toolsJs = toolsSrc;
const hrefs = [...toolsJs.matchAll(/h:'([^']+)'/g)].map(m => m[1]);
// 다국어 hreflang sitemap: 페이지마다 ko/en/zh/ja 4개 <url>, 각각 전체 alternate(xhtml:link) 명시(Google 국제화 권장).
const locOf = (file, lang) => file === 'index.html' ? BASE + '/' + (lang ? lang + '/' : '') : BASE + '/' + (lang ? lang + '/' : '') + file;
const altLinks = (file) => {
  let s = '<xhtml:link rel="alternate" hreflang="ko" href="' + locOf(file, '') + '"/>';
  for (const [l, hl] of LANGS_OUT) s += '<xhtml:link rel="alternate" hreflang="' + hl + '" href="' + locOf(file, l) + '"/>';
  return s + '<xhtml:link rel="alternate" hreflang="x-default" href="' + locOf(file, '') + '"/>';
};
const lmOf = (file) => { try { return '<lastmod>' + new Date(fs.statSync(seen.get(file) || path.join(DIST, file)).mtime).toISOString().slice(0, 10) + '</lastmod>'; } catch { return ''; } };
let smEntries = '';
for (const f of pageFiles) {
  const alts = altLinks(f), lm = lmOf(f);
  smEntries += '<url><loc>' + locOf(f, '') + '</loc>' + alts + lm + '</url>\n';
  for (const [l] of LANGS_OUT) smEntries += '<url><loc>' + locOf(f, l) + '</loc>' + alts + lm + '</url>\n';
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
  + smEntries + '</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + BASE + '/sitemap.xml\n');

const total = fs.readdirSync(DIST).filter(f => f.endsWith('.html')).length;
const coreSz = Math.round(fs.statSync(path.join(DIST,'i18n-core.js')).size/1024);
const smCount = pageFiles.length * (1 + LANGS_OUT.length);
console.log('빌드 완료 — html ' + total + '개(카테고리 ' + catPages + '), 언어변형 ' + langPages + '페이지(en/zh/ja), 공용자산 ' + assets + '항목, sitemap ' + smCount + ' URL(hreflang), SEO주입 ' + seoInjected + '페이지');
console.log('캐시버스팅 — v=' + VER + ' (앱코드 ' + busted + '개 html 적용)');
console.log('최적화 — 페이지 인라인 ' + optimized + '개, i18n-core.js ' + coreSz + 'KB (도구 수와 무관하게 고정)');
