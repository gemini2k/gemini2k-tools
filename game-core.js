/* 게임 공통 셸 — 일시정지/재개 컨트롤(버튼 + Space/P 키 + 탭 숨김 자동 일시정지).
   사용: var gc = GameCore.init({ onPause:fn, onResume:fn, mount:el });
         게임 루프에서 if(gc.isPaused()) 면 업데이트 건너뜀.
   의존성 0. 실시간 게임(루프형)에 일관된 일시정지를 제공. */
(function(){
  function init(cfg){
    cfg = cfg || {};
    var paused = false;
    var bar = document.createElement('div'); bar.className = 'gc-bar';
    var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'gc-btn'; pb.id = 'gcPause';
    var L = function(k, d){ return (window.t && window.curLang) ? (window.t(k) !== k ? window.t(k) : d) : d; };
    pb.textContent = '⏸ ' + L('gc.pause', '일시정지');
    bar.appendChild(pb);
    var mount = cfg.mount || document.querySelector('.toolwrap .card') || document.querySelector('.toolwrap') || document.body;
    mount.appendChild(bar);

    function apply(v){
      if (v === paused) return;
      paused = v;
      pb.textContent = v ? ('▶ ' + L('gc.resume', '계속하기')) : ('⏸ ' + L('gc.pause', '일시정지'));
      pb.classList.toggle('on', v);
      try { if (v) { cfg.onPause && cfg.onPause(); } else { cfg.onResume && cfg.onResume(); } } catch(e){}
    }
    pb.addEventListener('click', function(){ apply(!paused); });
    document.addEventListener('keydown', function(e){
      if (e.key !== ' ' && e.key !== 'p' && e.key !== 'P') return;
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      e.preventDefault(); apply(!paused);
    });
    document.addEventListener('visibilitychange', function(){
      if (document.hidden && !paused) apply(true);   // 탭 가리면 자동 일시정지
    });

    return {
      isPaused: function(){ return paused; },
      pause: function(){ apply(true); },
      resume: function(){ apply(false); }
    };
  }
  window.GameCore = { init: init };
})();
