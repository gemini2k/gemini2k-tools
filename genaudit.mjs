// 감리·점검 전문가 도구 생성기 — 공통 head/shell 을 입혀 src/audit/*.html 출력
import fs from 'fs'; import path from 'path';
const OUT = path.join(process.cwd(), 'src', 'audit');
fs.mkdirSync(OUT, { recursive: true });
const esc = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function page(s){
  const libs = (s.libs||[]).map(l=>`<script src="${l}"></script>`).join('');
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/><link rel="icon" href="/favicon.ico" sizes="any"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="google-site-verification" content="21lomLkO-jad8-GrfWyLlP2mW99lqPI9WTLL34GY1kU"/><meta name="naver-site-verification" content="f9485999829eaa979c75b76aa887816429bb18f3"/>
<title>${s.title} — 빛의여행(gemini2k) 도구</title>
<meta name="description" content="${esc(s.desc)}"/>
<link rel="canonical" href="https://gemini2k.co.kr/${s.key}.html"/>
<meta property="og:type" content="website"/><meta property="og:site_name" content="빛의여행(gemini2k) 도구"/><meta property="og:title" content="${esc(s.title)} — 빛의여행(gemini2k) 도구"/><meta property="og:description" content="${esc(s.ogd||s.desc)}"/><meta property="og:url" content="https://gemini2k.co.kr/${s.key}.html"/><meta property="og:image" content="https://gemini2k.co.kr/og.png"/>
<link rel="stylesheet" href="/fonts/pretendard.css"/><link rel="stylesheet" href="style.css"/>
<script src="ga.js"></script><script src="theme.js"></script><script src="i18n.js"></script><script src="tools.js"></script>
<style>.note{margin-top:1.1rem;font-size:.8rem;line-height:1.6;color:var(--muted);background:var(--accent-soft);border:1px solid var(--border);border-radius:10px;padding:.8rem .9rem;}
.frm{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin-bottom:.6rem;}
.frm label{font-size:.85rem;font-weight:600;display:inline-flex;flex-direction:column;gap:.2rem;}
.frm input,.frm select,.frm textarea{padding:.5rem .6rem;border:1px solid var(--border);border-radius:9px;background:var(--input-bg);color:var(--text);font-family:inherit;font-size:.95rem;}
.frm input[type=number]{width:130px;}
.res{border:1px solid var(--border);border-radius:12px;background:var(--ground);padding:1rem;margin-top:.4rem;}
.res table{width:100%;border-collapse:collapse;font-size:.92rem;}.res td{padding:.45rem .5rem;border-bottom:1px solid var(--border);word-break:break-word;overflow-wrap:anywhere;}.res td:first-child{color:var(--muted);white-space:nowrap;}
.res td b{font-variant-numeric:tabular-nums;}
.big{font-size:1.5rem;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums;word-break:break-word;overflow-wrap:anywhere;}
.out{border:1px solid var(--border);border-radius:11px;background:var(--ground);padding:.8rem;font-family:ui-monospace,monospace;font-size:.84rem;white-space:pre-wrap;word-break:break-word;overflow:auto;}
textarea.in{width:100%;min-height:120px;padding:.7rem;border:1px solid var(--border);border-radius:11px;background:var(--input-bg);font-family:ui-monospace,monospace;font-size:.85rem;color:var(--text);resize:vertical;}
.err{color:#e0563b;font-size:.85rem;min-height:1.1em;}
.drop{display:block;border:2px dashed var(--border);border-radius:12px;padding:1.3rem;text-align:center;cursor:pointer;color:var(--muted);font-weight:600;}
.drop:hover{border-color:var(--accent);background:var(--accent-soft);}${s.css||''}</style>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5930096672475061" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"${s.ld||'SoftwareApplication'}","name":"${esc(s.title)}","description":"${esc(s.desc)}","url":"https://gemini2k.co.kr/${s.key}.html","applicationCategory":"BusinessApplication","operatingSystem":"Web","inLanguage":"ko","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"},"publisher":{"@type":"Organization","name":"빛의여행(gemini2k) 도구","url":"https://gemini2k.co.kr/"}}</script>
</head>
<body>
<div class="toolwrap" style="max-width:${s.wide||'1000px'};">
  <h1>${s.h1}</h1>
  <p class="sub">${s.sub}</p>
  <div class="card" style="max-width:none;">
    ${s.body||'<div id="app"></div>'}
    <div class="note">${s.note}</div>
  </div>
</div>
${libs}<script src="tool-shell.js"></script>
<script>
${s.script}
</script>
</body>
</html>
`;
}
async function main(){
  let specs = (await import('./genaudit.specs.mjs')).SPECS;
  if (fs.existsSync(path.join(process.cwd(),'genaudit.specs2.mjs')))
    specs = specs.concat((await import('./genaudit.specs2.mjs')).SPECS);
  if (fs.existsSync(path.join(process.cwd(),'genaudit.specs3.mjs')))
    specs = specs.concat((await import('./genaudit.specs3.mjs')).SPECS);
  if (fs.existsSync(path.join(process.cwd(),'genaudit.specs4.mjs')))
    specs = specs.concat((await import('./genaudit.specs4.mjs')).SPECS);
  if (fs.existsSync(path.join(process.cwd(),'genaudit.specs5.mjs')))
    specs = specs.concat((await import('./genaudit.specs5.mjs')).SPECS);
  let n=0; for(const s of specs){ fs.writeFileSync(path.join(OUT, s.key+'.html'), page(s)); n++; }
  console.log('생성 완료:', n, '개 →', OUT);
}
main();
