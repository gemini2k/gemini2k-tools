// 빌드: src/<카테고리>/*.html 을 dist/ 루트로 평면 출력 + 공용 자산 복사 + sitemap 생성.
// 서비스 URL은 평면 유지(/percent.html). 개발은 카테고리 폴더에서. 의존성 0(Node 내장 fs만).
// 실행: node build.mjs
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const BASE = 'https://gemini2k.co.kr';

// dist 초기화
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 1) 루트 공용 자산 복사(html·빌드·소스·문서·원본CSV 제외)
const SKIP = new Set([
  'src', 'dist', 'build.mjs', 'deploy', 'node_modules', '.git', '.gitignore',
  'README.md', 'LICENSE', 'NOTICE', '__pycache__', 'package.json', 'package-lock.json'
]);
let assets = 0;
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name)) continue;
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
// i18n-core.js 생성 (tool.*.t/.d 제거한 사전 + 원본 엔진)
const coreDict = {};
for (const l of LANGS){ coreDict[l]={}; for (const k in I18N[l]) if(!isToolKey(k)) coreDict[l][k]=I18N[l][k]; }
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
let optimized=0;
for (const f of fs.readdirSync(DIST)){
  if (!f.endsWith('.html') || f==='index.html') continue;
  const fp=path.join(DIST,f); let html=fs.readFileSync(fp,'utf8');
  if (html.indexOf('<script src="i18n.js"></script>')<0) continue;
  const cur=byHref[f];
  let patchScript='<script src="i18n-core.js"></script>';
  if (cur){ const keys=[cur.key].concat(relatedKeys(cur)); const P=toolStrings(keys);
    patchScript += '\n<script>(function(){var P='+JSON.stringify(P)+',I=window.I18N=window.I18N||{};for(var l in P){I[l]=I[l]||{};for(var k in P[l])I[l][k]=P[l][k];}})();</script>'; }
  html=html.replace('<script src="i18n.js"></script>', patchScript);
  const sub = cur ? [subsetEntry(cur)].concat(relatedKeys(cur).map(k=>subsetEntry(byKey[k]))) : [];
  html=html.replace('<script src="tools.js"></script>', '<script>window.TOOLS='+JSON.stringify(sub)+';</script>');
  fs.writeFileSync(fp, html); optimized++;
}

// 3) sitemap.xml + robots.txt (레지스트리 기반)
const reg = fs.readFileSync(path.join(SRC, '_site', 'index.html'), 'utf8'); // 존재 확인용
const toolsJs = toolsSrc;
const hrefs = [...toolsJs.matchAll(/h:'([^']+)'/g)].map(m => m[1]);
const urls = ['/'].concat(hrefs.map(h => '/' + h)).concat(['/privacy.html']);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(u => '<url><loc>' + BASE + u + '</loc></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + BASE + '/sitemap.xml\n');

const total = fs.readdirSync(DIST).filter(f => f.endsWith('.html')).length;
const coreSz = Math.round(fs.statSync(path.join(DIST,'i18n-core.js')).size/1024);
console.log('빌드 완료 — html ' + total + '개, 공용자산 ' + assets + '항목, sitemap ' + urls.length + ' URL');
console.log('최적화 — 페이지 인라인 ' + optimized + '개, i18n-core.js ' + coreSz + 'KB (도구 수와 무관하게 고정)');
