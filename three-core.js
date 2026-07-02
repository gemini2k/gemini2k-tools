/* 3D 게임 공통 셸 — Three.js 안전 부트스트랩.
   - WebGL 미지원/실패/런타임 오류 시 '에러' 대신 친절한 안내 메시지 표시
   - 렌더러·씬·카메라 셋업 + 리사이즈 + GameCore 일시정지 연동 + 안전 루프(try/catch)
   사용: var T=Three3D.setup(stageEl, {bg,fov,ratio,mount}); if(!T) return;  // null이면 안내 표시됨
        ...씬 구성... T.start(function(dt){ ...업데이트... });
   의존성: THREE(vendor) + GameCore(game-core.js). */
(function(){
  function supported(){
    try{ var c=document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
    catch(e){ return false; }
  }
  function fallback(el, msg){
    el.innerHTML = '<div class="g3d-fallback"><div class="ic" aria-hidden="true">🖥️</div><p>'
      + (msg || ((window.t && window.t('gc.webgl') !== 'gc.webgl') ? window.t('gc.webgl') : '이 브라우저·기기에서는 3D 그래픽을 표시할 수 없어요.<br>최신 Chrome·Edge·Safari에서 다시 시도해 주세요.'))
      + '</p></div>';
  }
  function setup(el, opts){
    opts = opts || {};
    if (typeof THREE === 'undefined' || !supported()) { fallback(el, opts.msg); return null; }
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch(e){ fallback(el, opts.msg); return null; }
    function dims(){ var w = el.clientWidth || 480; var h = opts.height || Math.round(w * (opts.ratio || 0.72)); return [w, h]; }
    var d = dims();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(d[0], d[1]);
    if (opts.shadow) { try { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; } catch(e){} }
    el.innerHTML = ''; el.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(opts.bg != null ? opts.bg : 0x0f1226);
    var camera = new THREE.PerspectiveCamera(opts.fov || 60, d[0] / d[1], opts.near || 0.1, opts.far || 1000);
    function resize(){ var dd = dims(); renderer.setSize(dd[0], dd[1]); camera.aspect = dd[0] / dd[1]; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', resize);

    var gc = window.GameCore ? GameCore.init({ mount: opts.mount || (el.closest && el.closest('.card')) || el.parentNode })
                             : { isPaused: function(){ return false; } };
    var raf = 0, updateFn = null, last = 0, dead = false;
    function frame(t){
      if (dead) return;
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, ((t - last) / 1000) || 0); last = t;
      try {
        if (updateFn && !gc.isPaused()) updateFn(dt);
        renderer.render(scene, camera);
      } catch(e){
        dead = true; cancelAnimationFrame(raf);
        fallback(el, '게임 실행 중 문제가 발생했어요. 페이지를 새로고침해 주세요.');
      }
    }
    return {
      THREE: THREE, scene: scene, camera: camera, renderer: renderer, gc: gc, dom: renderer.domElement,
      start: function(fn){ updateFn = fn; last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); },
      stop: function(){ dead = true; cancelAnimationFrame(raf); },
      resize: resize
    };
  }
  window.Three3D = { supported: supported, fallback: fallback, setup: setup };
})();
