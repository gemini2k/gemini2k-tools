/* help-export.js — 공유 도움말 내보내기(웹 도움말 섹션 → 인쇄 / PDF / PPT)
   규약: 도구 페이지에 <section class="toolhelp"> ... </section> (h2/h3/p/ul/ol/li, data-i18n).
   이 스크립트가 섹션 상단에 [인쇄(PDF)] [PDF] [PPT] 버튼 주입.
   - 인쇄: 무의존, 한글 완벽·선택가능(기본). - PDF: html2canvas+jsPDF(래스터, 한글OK). - PPT: PptxGenJS.
   라이브러리는 버튼 클릭 시 지연로드(페이지 로드·SEO 영향 0). 전부 MIT, 자체호스팅. */
(function () {
  var T = function (k, d) { return (window.t && window.t(k) !== k) ? window.t(k) : d; };
  function help() { return document.querySelector('.toolhelp'); }
  function title() { var h = document.querySelector('h1'); return (h ? h.textContent : document.title).trim(); }
  var loaded = {};
  function load(src) {
    return new Promise(function (res, rej) {
      if (loaded[src]) return res();
      var s = document.createElement('script'); s.src = src;
      s.onload = function () { loaded[src] = 1; res(); }; s.onerror = function () { rej(new Error('load ' + src)); };
      document.head.appendChild(s);
    });
  }
  // 도움말 DOM → 블록 추출(PPT 슬라이드/구조화용)
  function extract(sec) {
    var blocks = [], cur = null;
    sec.querySelectorAll('h2,h3,p,li').forEach(function (n) {
      if (n.closest('.help-tools')) return;
      var tag = n.tagName.toLowerCase(), txt = (n.textContent || '').trim(); if (!txt) return;
      if (tag === 'h2' || tag === 'h3') { cur = { heading: txt, items: [] }; blocks.push(cur); }
      else { if (!cur) { cur = { heading: '', items: [] }; blocks.push(cur); } cur.items.push((tag === 'li' ? '• ' : '') + txt); }
    });
    return blocks;
  }
  function doPrint() {
    var sec = help(); if (!sec) return;
    var clone = sec.cloneNode(true); var bt = clone.querySelector('.help-tools'); if (bt) bt.remove();
    var w = window.open('', '_blank'); if (!w) { alert('팝업이 차단되었습니다. 허용 후 다시 시도하세요.'); return; }
    w.document.write('<!doctype html><html lang="' + (document.documentElement.lang || 'ko') + '"><head><meta charset="utf-8"><title>' + title() + '</title>'
      + '<style>body{font-family:Pretendard,system-ui,-apple-system,sans-serif;max-width:780px;margin:2rem auto;padding:0 1.5rem;color:#1a1a1a;line-height:1.7}'
      + 'h1{font-size:1.5rem;margin-bottom:1rem}h2{font-size:1.15rem;margin:1.5rem 0 .5rem;border-bottom:1px solid #ddd;padding-bottom:.3rem}h3{font-size:1rem;margin:1rem 0 .3rem}'
      + 'ul,ol{padding-left:1.3rem}li{margin:.2rem 0}p{margin:.4rem 0}@media print{body{margin:0}}</style></head><body>'
      + '<h1>' + title() + '</h1>' + clone.innerHTML + '</body></html>');
    w.document.close(); w.focus(); setTimeout(function () { try { w.print(); } catch (e) {} }, 350);
  }
  async function doPDF(btn) {
    var sec = help(); if (!sec) return; var old = btn.textContent; btn.disabled = true; btn.textContent = '…';
    try {
      await load('/vendor/html2canvas-1.4/html2canvas.min.js');
      await load('/vendor/jspdf-2.5/jspdf.umd.min.js');
      var bar = sec.querySelector('.help-tools'); if (bar) bar.style.visibility = 'hidden';
      var canvas = await html2canvas(sec, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      if (bar) bar.style.visibility = '';
      var JS = window.jspdf.jsPDF, pdf = new JS('p', 'mm', 'a4');
      var pw = 210, ph = 297, m = 10, iw = pw - m * 2, pxmm = canvas.width / iw, pageHpx = (ph - m * 2) * pxmm;
      var sy = 0, slice = document.createElement('canvas'), cx = slice.getContext('2d'); slice.width = canvas.width;
      while (sy < canvas.height) {
        var hpx = Math.min(pageHpx, canvas.height - sy); slice.height = hpx;
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, slice.width, hpx);
        cx.drawImage(canvas, 0, sy, canvas.width, hpx, 0, 0, canvas.width, hpx);
        pdf.addImage(slice.toDataURL('image/png'), 'PNG', m, m, iw, hpx / pxmm);
        sy += hpx; if (sy < canvas.height) pdf.addPage();
      }
      pdf.save((title() || 'help') + '.pdf');
    } catch (e) { alert('PDF 생성 실패: ' + (e && e.message || e)); }
    finally { btn.disabled = false; btn.textContent = old; }
  }
  async function doPPT(btn) {
    var sec = help(); if (!sec) return; var old = btn.textContent; btn.disabled = true; btn.textContent = '…';
    try {
      await load('/vendor/pptxgen-3/pptxgen.bundle.js');
      var blocks = extract(sec), p = new PptxGenJS(); p.layout = 'LAYOUT_WIDE'; var ttl = title();
      var s0 = p.addSlide();
      s0.addText(ttl, { x: 0.5, y: 2.4, w: 12.3, h: 1, fontSize: 34, bold: true, align: 'center', color: '1F2937' });
      s0.addText('gemini2k 도구 · ' + T('help.title', '도움말'), { x: 0.5, y: 3.5, w: 12.3, h: 0.5, fontSize: 15, align: 'center', color: '94A3B8' });
      blocks.forEach(function (b) {
        var s = p.addSlide();
        s.addText(b.heading || ttl, { x: 0.5, y: 0.4, w: 12.3, h: 0.8, fontSize: 22, bold: true, color: '2563EB' });
        if (b.items.length) s.addText(b.items.map(function (t) { return { text: t, options: { breakLine: true, fontSize: 15 } }; }), { x: 0.6, y: 1.4, w: 12.1, h: 5.4, valign: 'top', color: '1F2937' });
      });
      await p.writeFile({ fileName: (ttl || 'help') + '.pptx' });
    } catch (e) { alert('PPT 생성 실패: ' + (e && e.message || e)); }
    finally { btn.disabled = false; btn.textContent = old; }
  }
  function init() {
    var sec = help(); if (!sec || sec.querySelector('.help-tools')) return;
    var bar = document.createElement('div'); bar.className = 'help-tools';
    [['🖨 ' + T('help.print', '인쇄/PDF'), doPrint], ['📄 PDF', function (e) { doPDF(e.target); }], ['📊 PPT', function (e) { doPPT(e.target); }]]
      .forEach(function (x) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn-help'; b.textContent = x[0]; b.addEventListener('click', x[1]); bar.appendChild(b); });
    sec.insertBefore(bar, sec.firstChild);
  }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
