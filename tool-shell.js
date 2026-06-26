/* 도구 페이지 공용 셸 — 반복되는 body 크롬(헤더/뒤로가기/푸터/토스트)을 주입.
   SEO·AdSense 핵심(head 의 title·meta·canonical·og·stylesheet·ga.js·i18n.js·AdSense 로더)은
   각 페이지에 정적으로 둔다. 셸은 본문 바깥 크롬만 담당 → 헤더/푸터 전역 변경이 이 한 파일로.

   도구 페이지 사용법 (body):
     <div class="toolwrap"> <h1>..</h1> <p class="sub">..</p> <div class="card">..</div> </div>
     <script src="tool-shell.js"></script>      // ← 본문 뒤, 도구 로직 스크립트보다 먼저
     <script> ...도구 로직... </script>
   헤더/뒤로가기/푸터/토스트(#toast)는 이 셸이 자동 생성한다. */
(function(){
  var LOGO = '<svg class="mk" viewBox="0 0 32 32" width="30" height="30" role="img" aria-label="빛의여행">'
    + '<defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">'
    + '<stop stop-color="#15C39A"/><stop offset=".5" stop-color="#1AA3E0"/><stop offset="1" stop-color="#3D7BF0"/>'
    + '</linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#lg)"/>'
    + '<path d="M25.5 3.6 L26.5 6.5 L29.4 7.5 L26.5 8.5 L25.5 11.4 L24.5 8.5 L21.6 7.5 L24.5 6.5 Z" fill="#fff"/>'
    + '<text x="15.5" y="22.2" text-anchor="middle" font-family="\'Pretendard Variable\',Pretendard,system-ui,sans-serif" font-size="12.5" font-weight="800" letter-spacing="-.5" fill="#fff">G2K</text></svg>';

  var HEADER = '<header class="top"><div class="top-in">'
    + '<a class="logo" href="index.html">' + LOGO + ' 빛의여행(gemini2k) 도구</a>'
    + '<nav>'
    + '<button id="themeBtn" class="theme-btn" type="button" aria-label="theme">🌙</button>'
    + '<select id="langsel" aria-label="language" style="padding:.4rem .6rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);font-family:inherit;font-size:.88rem;color:var(--text);">'
    + '<option value="ko">한국어</option><option value="en">English</option>'
    + '<option value="zh">中文</option><option value="ja">日本語</option></select>'
    + '<span class="nav-sep" aria-hidden="true"></span>'
    + '<a href="https://gemini2k.kr" target="_blank" rel="noopener" data-i18n="nav.blog">블로그</a>'
    + '</nav></div></header>';

  var BACK = '<a class="back" href="index.html" data-i18n="back">← 전체 도구</a>';

  var FOOTER = '<footer class="foot"><div class="foot-in">'
    + '<span>© 빛의여행(gemini2k) 도구</span><span data-i18n="foot.tail">· 모든 처리는 브라우저에서</span>'
    + '<a href="mailto:gemini2k@naver.com" data-i18n="foot.contact">· 문의 gemini2k@naver.com</a>'
    + '<a href="privacy.html" data-i18n="foot.policy">· 개인정보처리방침</a>'
    + '<span class="sp"></span><a href="index.html" data-i18n="foot.more">다른 도구 보기 →</a>'
    + '</div></footer>';

  var TOAST = '<div class="toast" id="toast"></div>';

  function build(){
    var body = document.body; if (!body) return;
    if (!document.querySelector('header.top'))
      body.insertAdjacentHTML('afterbegin', HEADER);
    var tw = document.querySelector('.toolwrap');
    if (tw && !tw.querySelector('.back'))
      tw.insertAdjacentHTML('afterbegin', BACK);
    if (!document.querySelector('footer.foot'))
      body.insertAdjacentHTML('beforeend', FOOTER);
    if (!document.getElementById('toast'))
      body.insertAdjacentHTML('beforeend', TOAST);
    if (window.initThemeToggle) window.initThemeToggle(document.getElementById('themeBtn'));
    // 이미 i18n apply 가 끝난 뒤(readyState!=='loading')라면 주입한 크롬을 다시 번역.
    // 아직 'loading' 이면 i18n 의 DOMContentLoaded apply 가 알아서 처리한다.
    if (document.readyState !== 'loading' && window.setLang && window.curLang) setLang(curLang());
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
