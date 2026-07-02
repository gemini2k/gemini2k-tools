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
    + '<a class="logo" href="index.html">' + LOGO + '<span class="logo-t"> 빛의여행(gemini2k) 도구</span></a>'
    + '<nav>'
    + '<button id="themeBtn" class="theme-btn" type="button" aria-label="theme">🌙</button>'
    + '<select id="langsel" aria-label="language" style="padding:.4rem .6rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);font-family:inherit;font-size:.88rem;color:var(--text);">'
    + '<option value="ko">한국어</option><option value="en">English</option>'
    + '<option value="zh">中文</option><option value="ja">日本語</option></select>'
    + '<span class="nav-sep" aria-hidden="true"></span>'
    + '<a href="https://gemini2k.kr" target="_blank" rel="noopener" data-i18n="nav.blog">블로그</a>'
    + '</nav></div></header>';

  var BACK = '<a class="back" href="index.html" data-i18n="back">← 전체 도구</a>';

  // 카테고리 푸터 내비 — 전 페이지에서 카테고리 랜딩페이지로 연결(내부링크·크롤성). 레지스트리 카테고리와 동기.
  var CATNAV = [['text','텍스트'],['calc','계산기'],['convert','변환기'],['gen','생성기'],['image','이미지'],
    ['pdf','PDF'],['doc','문서'],['dev','개발자'],['data','데이터'],['viz','시각화'],['time','시간'],
    ['pii','개인정보'],['security','보안·진단'],['audit','감리·검증'],['gis','GIS'],['health','건강'],
    ['game','게임'],['fortune','심리·운세']];
  var CATNAV_HTML = '<nav class="footcats" aria-label="categories">'
    + CATNAV.map(function(c){ return '<a href="cat-'+c[0]+'.html" data-i18n="cat.'+c[1]+'">'+c[1]+'</a>'; }).join('')
    + '</nav>';

  var FOOTER = '<footer class="foot"><div class="foot-in">'
    + '<span>© 빛의여행(gemini2k) 도구</span><span data-i18n="foot.tail">· 모든 처리는 브라우저에서</span>'
    + '<a href="mailto:gemini2k@naver.com" data-i18n="foot.contact">· 문의 gemini2k@naver.com</a>'
    + '<a href="privacy.html" data-i18n="foot.policy">· 개인정보처리방침</a>'
    + '<span class="sp"></span><a href="index.html" data-i18n="foot.more">다른 도구 보기 →</a>'
    + '</div>' + CATNAV_HTML + '</footer>';

  var TOAST = '<div class="toast" id="toast"></div>';

  // 관련 도구 섹션 — 레지스트리(window.TOOLS) 기반. related(선별) → 같은 카테고리 자동 보완.
  function relatedHtml(){
    var T = window.TOOLS; if (!T || !T.length) return '';
    var file = location.pathname.split('/').pop() || 'index.html';
    var cur = null; for (var i=0;i<T.length;i++){ if (T[i].h===file){ cur=T[i]; break; } }
    if (!cur) return '';
    var byKey = function(k){ for (var j=0;j<T.length;j++) if (T[j].key===k) return T[j]; return null; };
    var keys = [], add = function(k){ if (k && k!==cur.key && keys.indexOf(k)<0 && byKey(k)) keys.push(k); };
    var next = {}; (cur.related||[]).forEach(function(k){ next[k]=1; add(k); });
    for (var c=0;c<T.length;c++){ if (T[c].cat===cur.cat) add(T[c].key); }
    keys = keys.slice(0,6);
    if (!keys.length) return '';
    var cards = keys.map(function(k){ var t=byKey(k);
      return '<a class="relcard" href="'+t.h+'">'
        + '<span class="relic '+t.chip+'">'+t.ic+'</span>'
        + '<span class="reltxt"><b data-i18n="tool.'+t.key+'.t"></b><i data-i18n="tool.'+t.key+'.d"></i></span>'
        + (next[k] ? '<span class="relnext" data-i18n="rel.next">다음 단계</span>' : '')
        + '</a>';
    }).join('');
    return '<section class="relsec"><div class="relsec-h"><span aria-hidden="true">🔗</span>'
      + '<span data-i18n="rel.title">관련 도구</span></div><div class="relgrid">'+cards+'</div></section>';
  }

  function build(){
    var body = document.body; if (!body) return;
    if (!document.querySelector('header.top'))
      body.insertAdjacentHTML('afterbegin', HEADER);
    var tw = document.querySelector('.toolwrap') || document.querySelector('.wrap');
    if (tw && !tw.querySelector('.back'))
      tw.insertAdjacentHTML('afterbegin', BACK);
    if (tw && !tw.querySelector('.relsec'))
      tw.insertAdjacentHTML('beforeend', relatedHtml());
    if (!document.querySelector('footer.foot'))
      body.insertAdjacentHTML('beforeend', FOOTER);
    if (!document.getElementById('toast'))
      body.insertAdjacentHTML('beforeend', TOAST);
    if (window.initThemeToggle) window.initThemeToggle(document.getElementById('themeBtn'));
    // 모바일/인앱 브라우저 파일 업로드 호환: 터치 기기에서 파일 input 을 드롭존 위 투명 오버레이로 만들어
    // 탭하면 '네이티브' 파일 선택창이 열리게 한다(인앱 브라우저는 JS input.click() 을 막는 경우가 많음).
    // 데스크톱은 기존 동작(드래그·JS클릭) 유지.
    try {
      if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        var fis = document.querySelectorAll('input[type="file"]');
        for (var fi = 0; fi < fis.length; fi++) {
          var inp = fis[fi];
          var zone = (inp.closest && inp.closest('.drop')) ||
            (inp.parentElement && inp.parentElement.querySelector && inp.parentElement.querySelector('.drop')) ||
            document.querySelector('.drop');
          if (!zone || zone === inp || inp.dataset.akOverlay) continue;
          if (zone.tagName === 'LABEL') continue; // label[for] 은 네이티브로 동작하므로 오버레이 불필요
          if (zone.querySelector('button, a, select')) continue; // 버튼 등 상호작용 요소가 있는 드롭존은 가리지 않도록 제외
          if (getComputedStyle(zone).position === 'static') zone.style.position = 'relative';
          inp.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3;margin:0;padding:0;display:block;';
          inp.dataset.akOverlay = '1';
          if (inp.parentNode !== zone) zone.appendChild(inp);
          inp.addEventListener('click', function (e) { e.stopPropagation(); }); // .drop 의 JS click 핸들러 중복 방지
        }
      }
    } catch (e) {}
    // 이미 i18n apply 가 끝난 뒤(readyState!=='loading')라면 주입한 크롬을 다시 번역.
    // 아직 'loading' 이면 i18n 의 DOMContentLoaded apply 가 알아서 처리한다.
    if (document.readyState !== 'loading' && window.setLang && window.curLang) setLang(curLang());
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
