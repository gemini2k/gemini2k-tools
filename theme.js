/* 다크모드 엔진 — 전 페이지 공유. 의존성 없음.
   - localStorage 'theme' = 'dark' | 'light' (없으면 OS 설정 prefers-color-scheme 따라감)
   - <html data-theme="dark|light"> 를 즉시 설정 (FOUC 최소화 위해 <head> 에서 동기 로드)
   - window.toggleTheme(): light↔dark 전환 + 저장 + 등록된 버튼 아이콘 갱신
   - window.initThemeToggle(el): 버튼에 클릭 핸들러 + 아이콘 연결 */
(function(){
  var KEY = 'theme';
  var btns = [];
  function saved(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function osDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function effective(){ var s = saved(); return (s === 'dark' || s === 'light') ? s : (osDark() ? 'dark' : 'light'); }
  function apply(){
    var th = effective();
    document.documentElement.setAttribute('data-theme', th);
    btns.forEach(function(b){ syncBtn(b, th); });
  }
  function syncBtn(b, th){
    th = th || effective();
    b.textContent = (th === 'dark') ? '☀️' : '🌙';
    b.setAttribute('aria-label', (th === 'dark') ? 'Light mode' : 'Dark mode');
    b.setAttribute('title', (th === 'dark') ? '라이트 모드' : '다크 모드');
  }
  window.toggleTheme = function(){
    var next = (effective() === 'dark') ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch(e){}
    apply();
  };
  window.initThemeToggle = function(el){
    if (!el || el._themeBound) return;
    el._themeBound = 1; btns.push(el);
    el.addEventListener('click', window.toggleTheme);
    syncBtn(el);
  };
  // OS 설정 변경 시 (저장된 선택이 없을 때만) 따라감
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function(){ if (!(saved() === 'dark' || saved() === 'light')) apply(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
  apply(); // <head> 동기 실행 — 첫 페인트 전에 테마 적용
})();

/* PWA 서비스워커 등록 — 지원 브라우저에서만 동작, 미지원/미설치 시 무영향(기존과 동일) */
(function(){
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(function(){});
  });
})();
