/* JSON 큰 수 보존 — JSON.parse 는 모든 숫자를 64비트 실수로 바꿔
   2^53 을 넘는 정수(트위터·스노우플레이크 ID 등)와 유효숫자 16자리 이상 소수의 끝자리를 바꾼다.
   JSONB.parse 는 그런 숫자만 문자열 표식("__JSONBIG__<원문>__")으로 감싸 읽고,
   JSONB.stringify / JSONB.unmark 가 출력 단계에서 원래 숫자 글자 그대로 되돌린다.

   JSONB.parse(text)               JSON.parse 대체(문법 오류 메시지는 원문 기준 그대로)
   JSONB.stringify(v, rep, indent) JSON.stringify 대체(표식 → 숫자)
   JSONB.unmark(str)               YAML·CSV·ENV 등 다른 형식 출력 문자열에서 표식 → 숫자
   JSONB.has(text)                 텍스트에 정밀도를 잃는 숫자가 있는지 */
(function(){
  var PRE = '__JSONBIG__', SUF = '__';
  var NUM = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
  var UN = /(["']?)__JSONBIG__(-?[\d.eE+-]+)__\1/g;

  function lossy(lit){
    if (/^-?\d+$/.test(lit)) return !Number.isSafeInteger(Number(lit));
    var m = lit.replace(/^-/, '').split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
    return m.replace(/0+$/, '').length > 15;          // double 은 유효숫자 15자리까지만 보장
  }

  // 문자열 밖 숫자 토큰만 검사. 바꿀 게 없으면 null.
  function wrap(text){
    var out = '', last = 0, i = 0, n = text.length, changed = false;
    while (i < n){
      var c = text.charCodeAt(i);
      if (c === 34){                                   // " 문자열 건너뛰기
        i++;
        while (i < n){ var d = text.charCodeAt(i); if (d === 92){ i += 2; continue; } i++; if (d === 34) break; }
        continue;
      }
      if (c === 45 || (c >= 48 && c <= 57)){
        NUM.lastIndex = i; var m = NUM.exec(text);
        if (m && m[0].length){
          var lit = m[0];
          var big = lit.replace(/[^\d]/g, '').length > 15 && lossy(lit);
          if (!big && /[eE]/.test(lit)){                 // 1e400 → Infinity(출력 null), 1e-400 → 0 방지
            var x = Number(lit); big = !isFinite(x) || (x === 0 && /[1-9]/.test(lit.split(/[eE]/)[0]));
          }
          if (big){
            out += text.slice(last, i) + '"' + PRE + lit + SUF + '"'; last = i + lit.length; changed = true;
          }
          i += lit.length; continue;
        }
      }
      i++;
    }
    return changed ? out + text.slice(last) : null;
  }

  function parse(text){
    text = String(text);
    var w = wrap(text);
    if (w === null) return JSON.parse(text);
    try { return JSON.parse(w); }
    catch (e){ return JSON.parse(text); }              // 문법 오류면 원문으로 다시 던져 위치 정보 유지
  }
  function unmark(s){ return typeof s === 'string' ? s.replace(UN, '$2') : s; }
  function stringify(v, rep, ind){ return unmark(JSON.stringify(v, rep, ind)); }
  function has(text){ return wrap(String(text)) !== null; }
  function isBig(v){ return typeof v === 'string' && v.indexOf(PRE) === 0 && v.slice(-2) === SUF; }

  window.JSONB = { parse: parse, stringify: stringify, unmark: unmark, has: has, isBig: isBig };
})();
