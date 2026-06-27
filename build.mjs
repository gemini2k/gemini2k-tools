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

// 3) sitemap.xml + robots.txt (레지스트리 기반)
const reg = fs.readFileSync(path.join(SRC, '_site', 'index.html'), 'utf8'); // 존재 확인용
const toolsJs = fs.readFileSync(path.join(ROOT, 'tools.js'), 'utf8');
const hrefs = [...toolsJs.matchAll(/h:'([^']+)'/g)].map(m => m[1]);
const urls = ['/'].concat(hrefs.map(h => '/' + h)).concat(['/privacy.html']);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(u => '<url><loc>' + BASE + u + '</loc></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + BASE + '/sitemap.xml\n');

const total = fs.readdirSync(DIST).filter(f => f.endsWith('.html')).length;
console.log('빌드 완료 — html ' + total + '개, 공용자산 ' + assets + '항목, sitemap ' + urls.length + ' URL');
