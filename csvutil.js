/* 공용 CSV 유틸 — 데이터/CSV 도구 공통 (단일 진실원, 유지보수성).
   RFC4180 파서(따옴표 안 쉼표·줄바꿈·이스케이프 "" 처리) + 구분자 자동감지 + 직렬화.
   window.CSV.parse(text,opt) → { header, rows, delimiter, cols }   (rows = 객체 배열 아님, 2차원 배열)
   window.CSV.toText(matrix,opt) → CSV 문자열 (필요 시 셀 인용)
   브라우저 전역(window.CSV). 의존성 0. */
(function(){
  function detectDelimiter(text){
    var line = text.split(/\r?\n/).find(function(l){ return l.trim().length; }) || '';
    var cands=[',',';','\t','|'], best=',', bestN=-1;
    cands.forEach(function(d){
      // 따옴표 밖의 구분자만 카운트
      var n=0, q=false;
      for(var i=0;i<line.length;i++){ var c=line[i];
        if(c==='"') q=!q; else if(c===d && !q) n++;
      }
      if(n>bestN){ bestN=n; best=d; }
    });
    return best;
  }

  // 2차원 배열로 파싱 (헤더 분리는 호출측이 결정)
  function parseMatrix(text, delim){
    text = text.replace(/^﻿/, '');           // BOM 제거
    var rows=[], row=[], cell='', q=false, i=0, n=text.length;
    function endCell(){ row.push(cell); cell=''; }
    function endRow(){ endCell(); rows.push(row); row=[]; }
    while(i<n){
      var c=text[i];
      if(q){
        if(c==='"'){ if(text[i+1]==='"'){ cell+='"'; i+=2; continue; } q=false; i++; continue; }
        cell+=c; i++; continue;
      }
      if(c==='"'){ q=true; i++; continue; }
      if(c===delim){ endCell(); i++; continue; }
      if(c==='\r'){ if(text[i+1]==='\n') i++; endRow(); i++; continue; }
      if(c==='\n'){ endRow(); i++; continue; }
      cell+=c; i++;
    }
    // 마지막 셀/행 마무리 (완전히 빈 끝줄은 버림)
    if(cell.length || row.length){ endCell(); rows.push(row); }
    return rows;
  }

  function parse(text, opt){
    opt = opt || {};
    var delim = opt.delimiter && opt.delimiter!=='auto' ? opt.delimiter : detectDelimiter(text);
    var matrix = parseMatrix(text, delim);
    // 완전 빈 행 제거(끝부분 흔한 빈 줄)
    matrix = matrix.filter(function(r){ return !(r.length===1 && r[0]===''); });
    var header=[], rows=matrix;
    if(opt.header!==false && matrix.length){ header = matrix[0]; rows = matrix.slice(1); }
    // 열 폭 정규화
    var cols = header.length || (matrix[0]? matrix[0].length : 0);
    rows.forEach(function(r){ while(r.length<cols) r.push(''); });
    return { header: header, rows: rows, delimiter: delim, cols: cols };
  }

  function quote(v, delim){
    v = v==null ? '' : String(v);
    if(v.indexOf('"')>=0 || v.indexOf(delim)>=0 || v.indexOf('\n')>=0 || v.indexOf('\r')>=0)
      return '"' + v.replace(/"/g,'""') + '"';
    return v;
  }
  // matrix = 2차원 배열(헤더 포함해 호출측이 구성)
  function toText(matrix, opt){
    opt = opt || {};
    var delim = opt.delimiter || ',';
    return matrix.map(function(r){ return r.map(function(c){ return quote(c, delim); }).join(delim); }).join('\r\n');
  }

  // 헤더+행 → 객체 배열
  function toObjects(parsed){
    return parsed.rows.map(function(r){ var o={}; parsed.header.forEach(function(h,i){ o[h]=r[i]; }); return o; });
  }

  window.CSV = { detectDelimiter: detectDelimiter, parse: parse, toText: toText, toObjects: toObjects, quote: quote };
})();
