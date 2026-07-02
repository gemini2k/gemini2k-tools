// 테스트 전문가 도구 — chance.js(OSS) + 원본 6종
export const SPECS = [

{ key:'chancedata', cat:'데이터', title:'테스트 더미데이터 생성기', oss:1,
  desc:'이름·이메일·전화·주소·회사·날짜 등 다양한 타입의 가짜 테스트 데이터를 원하는 행 수만큼 생성합니다. 시드로 재현 가능. Chance.js 자체 호스팅. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'테스트용 더미데이터 생성(Chance.js). 브라우저에서만.',
  h1:'테스트 더미데이터 생성기', sub:'컬럼=타입을 정의하면 테스트용 가짜 데이터를 표·CSV·JSON으로 만듭니다.',
  note:'오픈소스 <b>Chance.js</b>(MIT, <a href="https://github.com/chancejs/chancejs" target="_blank" rel="noopener">chancejs/chancejs</a>)를 자체 호스팅합니다. 같은 시드를 넣으면 같은 데이터가 재현됩니다. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/chance-1/chance.min.js','audit-kit.js'],
  body:'<div class="frm"><label>행 수<input type="number" id="n" value="10" min="1" max="1000"></label><label>시드(선택)<input type="text" id="seed" placeholder="비우면 랜덤"></label><button class="btn" id="gen" type="button">생성</button><button class="btn btn-ghost" id="csv" type="button">⬇️ CSV</button><button class="btn btn-ghost" id="json" type="button">📋 JSON</button></div>'
    +'<label style="font-weight:700;font-size:.85rem">컬럼 정의 (한 줄에 <code>컬럼명=타입</code>)</label>'
    +'<textarea class="in" id="cols" spellcheck="false" style="min-height:120px">id=정수\\nname=이름\\nemail=이메일\\nphone=전화\\ncompany=회사\\njoined=날짜\\nactive=불리언</textarea>'
    +'<div style="font-size:.8rem;color:var(--muted);margin:.3rem 0">타입: 이름·이메일·전화·주소·도시·국가·회사·정수·금액·날짜·불리언·문장·단어·GUID·IP·나이</div>'
    +'<div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};var rows=[],cols=[];'
    +'function gen(){var C=$("seed").value?new Chance($("seed").value):new Chance();'
    +'var M={"이름":function(){return C.name();},"이메일":function(){return C.email();},"전화":function(){return C.phone();},"주소":function(){return C.address();},"도시":function(){return C.city();},"국가":function(){return C.country({full:true});},"회사":function(){return C.company();},"정수":function(){return C.integer({min:1,max:1000});},"금액":function(){return C.integer({min:1000,max:1000000});},"날짜":function(){return C.date({string:true,year:C.integer({min:2020,max:2025})});},"불리언":function(){return C.bool();},"문장":function(){return C.sentence({words:6});},"단어":function(){return C.word();},"GUID":function(){return C.guid();},"IP":function(){return C.ip();},"나이":function(){return C.age();}};'
    +'cols=$("cols").value.replace(/\\\\n/g,"\\n").split(/\\r?\\n/).map(function(l){var p=l.split("=");return {name:(p[0]||"").trim(),type:(p[1]||p[0]||"").trim()};}).filter(function(c){return c.name;});'
    +'var n=Math.max(1,Math.min(1000,+$("n").value||10));rows=[];for(var r=0;r<n;r++){var o={};cols.forEach(function(c){var f=M[c.type]||function(){return C.word();};o[c.name]=f();});rows.push(o);}'
    +'$("res").innerHTML="<table><tr>"+cols.map(function(c){return "<td><b>"+c.name+"</b></td>";}).join("")+"</tr>"+rows.slice(0,100).map(function(o){return "<tr>"+cols.map(function(c){return "<td>"+String(o[c.name])+"</td>";}).join("")+"</tr>";}).join("")+"</table>";}'
    +'$("gen").addEventListener("click",gen);'
    +'$("csv").addEventListener("click",function(){if(!rows.length)gen();AuditKit.csv("testdata.csv",[cols.map(function(c){return c.name;})].concat(rows.map(function(o){return cols.map(function(c){return o[c.name];});})));});'
    +'$("json").addEventListener("click",function(){if(!rows.length)gen();navigator.clipboard.writeText(JSON.stringify(rows,null,2)).then(function(){AuditKit.toast("JSON 복사됨");});});'
    +'gen();' },

{ key:'combos', cat:'감리·검증', title:'조합 테스트 케이스 생성기',
  desc:'여러 파라미터의 값들을 입력하면 전체 조합(곱집합)을 모두 나열해 테스트 케이스 표로 만듭니다. 조합 수가 폭증하면 페어와이즈 도구를 함께 쓰세요.',
  h1:'조합 테스트 케이스 생성', sub:'파라미터별 값을 입력하면 모든 조합(곱집합)을 표로 만듭니다.',
  note:'한 줄에 <code>파라미터: 값1, 값2, 값3</code> 형식으로 입력합니다. 조합 수 = 각 값 개수의 곱이므로 폭증 시 페어와이즈를 사용하세요. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['audit-kit.js'],
  body:'<textarea class="in" id="in" spellcheck="false" style="min-height:120px">브라우저: Chrome, Safari, Edge\\nOS: Windows, macOS, Android\\n네트워크: WiFi, LTE</textarea>'
    +'<div class="frm" style="margin-top:.5rem"><button class="btn" id="run" type="button">조합 생성</button><button class="btn btn-ghost" id="csv" type="button">⬇️ CSV</button><span id="cnt" style="align-self:center;color:var(--muted)"></span></div>'
    +'<div class="err" id="err"></div><div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};var names=[],tests=[];'
    +'function parse(){return $("in").value.replace(/\\\\n/g,"\\n").split(/\\r?\\n/).map(function(l){var idx=l.indexOf(":");if(idx<0)return null;return {name:l.slice(0,idx).trim(),values:l.slice(idx+1).split(",").map(function(x){return x.trim();}).filter(Boolean)};}).filter(function(p){return p&&p.name&&p.values.length;});}'
    +'function run(){$("err").textContent="";var ps=parse();if(!ps.length){$("err").textContent="파라미터를 입력하세요";return;}'
    +'var total=ps.reduce(function(a,p){return a*p.values.length;},1);if(total>5000){$("err").textContent="조합이 너무 많습니다("+total+"개). 값을 줄이거나 페어와이즈를 쓰세요.";$("res").innerHTML="";$("cnt").textContent="";return;}'
    +'names=ps.map(function(p){return p.name;});tests=[[]];ps.forEach(function(p){var nt=[];tests.forEach(function(t){p.values.forEach(function(v){nt.push(t.concat([v]));});});tests=nt;});'
    +'$("cnt").textContent=tests.length+"개 케이스";'
    +'$("res").innerHTML="<table><tr><td><b>#</b></td>"+names.map(function(n){return "<td><b>"+n+"</b></td>";}).join("")+"</tr>"+tests.slice(0,500).map(function(t,i){return "<tr><td>"+(i+1)+"</td>"+t.map(function(v){return "<td>"+v+"</td>";}).join("")+"</tr>";}).join("")+"</table>";}'
    +'$("run").addEventListener("click",run);$("csv").addEventListener("click",function(){if(!tests.length)run();AuditKit.csv("combos.csv",[["#"].concat(names)].concat(tests.map(function(t,i){return [i+1].concat(t);})));});run();' },

{ key:'pairwise', cat:'감리·검증', title:'페어와이즈(All-Pairs) 케이스 생성기',
  desc:'파라미터·값을 입력하면 모든 2-요소 조합(페어)을 한 번씩 덮는 최소 테스트 케이스를 생성합니다. 조합 폭발을 줄이면서 결함 검출력을 유지하는 핵심 기법입니다.',
  ogd:'페어와이즈(All-Pairs) 최소 테스트 케이스 생성. 브라우저에서만.',
  h1:'페어와이즈(All-Pairs) 케이스 생성', sub:'모든 값 쌍을 덮는 최소 케이스를 만들어 조합 폭발을 줄입니다.',
  note:'전체 조합 대비 케이스 수를 크게 줄이면서 2-요소 상호작용 결함을 검출합니다. 한 줄에 <code>파라미터: 값1, 값2, ...</code>로 입력하세요. 그리디 알고리즘 기반(최소에 근접). 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['audit-kit.js'],
  body:'<textarea class="in" id="in" spellcheck="false" style="min-height:130px">브라우저: Chrome, Safari, Edge, Firefox\\nOS: Windows, macOS, Android, iOS\\n결제: 카드, 계좌, 간편결제\\n언어: 한국어, English</textarea>'
    +'<div class="frm" style="margin-top:.5rem"><button class="btn" id="run" type="button">페어와이즈 생성</button><button class="btn btn-ghost" id="csv" type="button">⬇️ CSV</button></div>'
    +'<div class="err" id="err"></div><div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};var names=[],tests=[];'
    +'function parse(){return $("in").value.replace(/\\\\n/g,"\\n").split(/\\r?\\n/).map(function(l){var idx=l.indexOf(":");if(idx<0)return null;return {name:l.slice(0,idx).trim(),values:l.slice(idx+1).split(",").map(function(x){return x.trim();}).filter(Boolean)};}).filter(function(p){return p&&p.name&&p.values.length;});}'
    +'function allpairs(vals){var n=vals.length;function key(i,x,j,y){return i+"_"+x+"_"+j+"_"+y;}var need=Object.create(null);'
    +'for(var i=0;i<n;i++)for(var j=i+1;j<n;j++)for(var x=0;x<vals[i].length;x++)for(var y=0;y<vals[j].length;y++)need[key(i,x,j,y)]=1;'
    +'var res=[],guard=0;while(Object.keys(need).length&&guard++<10000){var t=new Array(n).fill(-1);var f=Object.keys(need)[0].split("_");t[+f[0]]=+f[1];t[+f[2]]=+f[3];'
    +'for(var k=0;k<n;k++){if(t[k]!==-1)continue;var best=0,bc=-1;for(var v=0;v<vals[k].length;v++){var cnt=0;for(var m=0;m<n;m++){if(m===k||t[m]===-1)continue;var lo=Math.min(k,m),hi=Math.max(k,m);var lv=lo===k?v:t[m],hv=hi===k?v:t[m];if(need[key(lo,lv,hi,hv)])cnt++;}if(cnt>bc){bc=cnt;best=v;}}t[k]=best;}'
    +'for(var a=0;a<n;a++)for(var b=a+1;b<n;b++)delete need[key(a,t[a],b,t[b])];res.push(t.slice());}return res;}'
    +'function run(){$("err").textContent="";var ps=parse();if(ps.length<2){$("err").textContent="2개 이상의 파라미터가 필요합니다";return;}'
    +'names=ps.map(function(p){return p.name;});var vals=ps.map(function(p){return p.values;});var idxTests=allpairs(vals);'
    +'tests=idxTests.map(function(t){return t.map(function(vi,k){return vals[k][vi];});});'
    +'var full=vals.reduce(function(a,v){return a*v.length;},1);'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+tests.length+"개</b> 케이스 <span>(전체조합 "+full+"개 대비 "+Math.round((1-tests.length/full)*100)+"% 감소)</span></div><table><tr><td><b>#</b></td>"+names.map(function(n){return "<td><b>"+n+"</b></td>";}).join("")+"</tr>"+tests.map(function(t,i){return "<tr><td>"+(i+1)+"</td>"+t.map(function(v){return "<td>"+v+"</td>";}).join("")+"</tr>";}).join("")+"</table>";}'
    +'$("run").addEventListener("click",run);$("csv").addEventListener("click",function(){if(!tests.length)run();AuditKit.csv("pairwise.csv",[["#"].concat(names)].concat(tests.map(function(t,i){return [i+1].concat(t);})));});run();' },

{ key:'junitview', cat:'감리·검증', title:'JUnit/xUnit 테스트 결과 뷰어',
  desc:'JUnit/xUnit XML 테스트 결과를 붙여넣으면 통과·실패·스킵 집계, 실패 케이스 목록, 소요시간을 보기 좋게 정리합니다. CI 결과 점검에. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'JUnit/xUnit XML 결과 집계·실패 목록. 브라우저에서만.',
  h1:'JUnit/xUnit 결과 뷰어', sub:'테스트 결과 XML을 통과/실패/스킵으로 집계하고 실패를 보여 줍니다.',
  note:'JUnit/xUnit 표준 XML(testsuite/testcase)을 인식합니다. 파일은 업로드되지 않고 브라우저에서만 파싱됩니다.',
  body:'<textarea class="in" id="in" spellcheck="false">&lt;testsuite name="suite" tests="4" failures="1" skipped="1" time="2.5"&gt;\\n  &lt;testcase name="login_ok" classname="AuthTest" time="0.3"/&gt;\\n  &lt;testcase name="login_fail" classname="AuthTest" time="0.2"&gt;&lt;failure message="expected 200 got 500"&gt;assert&lt;/failure&gt;&lt;/testcase&gt;\\n  &lt;testcase name="logout" classname="AuthTest" time="0.1"/&gt;\\n  &lt;testcase name="reset_pw" classname="AuthTest"&gt;&lt;skipped/&gt;&lt;/testcase&gt;\\n&lt;/testsuite&gt;</textarea>'
    +'<div class="res" id="res" style="margin-top:.6rem"></div><div class="err" id="err"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){$("err").textContent="";var xml=$("in").value.replace(/\\\\n/g,"\\n");try{var doc=new DOMParser().parseFromString(xml,"application/xml");if(doc.querySelector("parsererror"))throw new Error("XML 파싱 오류");'
    +'var cases=[].slice.call(doc.getElementsByTagName("testcase"));if(!cases.length){$("res").innerHTML="testcase 가 없습니다.";return;}'
    +'var pass=0,fail=0,skip=0,err=0,time=0,fails=[];cases.forEach(function(tc){var t=parseFloat(tc.getAttribute("time")||0)||0;time+=t;'
    +'if(tc.getElementsByTagName("failure").length){fail++;fails.push([tc.getAttribute("classname")||"",tc.getAttribute("name"),(tc.getElementsByTagName("failure")[0].getAttribute("message")||"").slice(0,80)]);}'
    +'else if(tc.getElementsByTagName("error").length){err++;fails.push([tc.getAttribute("classname")||"",tc.getAttribute("name"),"ERROR "+(tc.getElementsByTagName("error")[0].getAttribute("message")||"").slice(0,70)]);}'
    +'else if(tc.getElementsByTagName("skipped").length){skip++;}else{pass++;}});'
    +'var tot=cases.length,rate=tot?Math.round(pass/tot*100):0;'
    +'var html="<div class=\\"ak-rate\\"><b>"+rate+"%</b> 통과 <span>· 전체 "+tot+" · 통과 "+pass+" · 실패 "+fail+" · 오류 "+err+" · 스킵 "+skip+" · "+time.toFixed(2)+"s</span></div><div class=\\"ak-bar2\\"><i style=\\"width:"+rate+"%\\"></i></div>";'
    +'if(fails.length)html+="<table style=\\"margin-top:.6rem\\"><tr><td><b>클래스</b></td><td><b>테스트</b></td><td><b>메시지</b></td></tr>"+fails.map(function(f){return "<tr><td>"+f[0]+"</td><td style=\\"color:#dc2626\\">"+f[1]+"</td><td>"+f[2].replace(/</g,"&lt;")+"</td></tr>";}).join("")+"</table>";'
    +'$("res").innerHTML=html;}catch(e){$("res").innerHTML="";$("err").textContent="\\u26a0\\ufe0f "+e.message;}}'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});run();' },

{ key:'lcovview', cat:'감리·검증', title:'LCOV 커버리지 리포트 뷰어',
  desc:'lcov.info 커버리지 데이터를 붙여넣으면 파일별 라인·함수·브랜치 커버리지(%)와 전체 요약을 표로 보여 줍니다. 테스트 커버리지 점검에. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'LCOV 커버리지(라인·브랜치 %) 요약. 브라우저에서만.',
  h1:'LCOV 커버리지 뷰어', sub:'lcov.info를 파일별 라인·함수·브랜치 커버리지로 요약합니다.',
  note:'lcov.info 형식(SF/DA/LF/LH/FNF/FNH/BRF/BRH)을 파싱합니다. 모든 처리는 브라우저에서만 이루어집니다.',
  body:'<textarea class="in" id="in" spellcheck="false" style="min-height:130px">TN:\\nSF:src/auth.js\\nFNF:3\\nFNH:2\\nLF:40\\nLH:34\\nBRF:8\\nBRH:5\\nend_of_record\\nSF:src/util.js\\nFNF:5\\nFNH:5\\nLF:60\\nLH:60\\nBRF:4\\nBRH:3\\nend_of_record</textarea>'
    +'<div class="res" id="res" style="margin-top:.6rem;overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function pct(h,f){return f>0?Math.round(h/f*100):100;}'
    +'function color(p){return p>=80?"#16a34a":p>=50?"#d97706":"#dc2626";}'
    +'function run(){var txt=$("in").value.replace(/\\\\n/g,"\\n");var recs=txt.split(/end_of_record/);var files=[],T={LF:0,LH:0,FNF:0,FNH:0,BRF:0,BRH:0};'
    +'recs.forEach(function(r){var sf=(r.match(/SF:(.+)/)||[])[1];if(!sf)return;function g(k){return +((r.match(new RegExp(k+":(\\\\d+)"))||[])[1]||0);}var o={sf:sf.trim(),LF:g("LF"),LH:g("LH"),FNF:g("FNF"),FNH:g("FNH"),BRF:g("BRF"),BRH:g("BRH")};["LF","LH","FNF","FNH","BRF","BRH"].forEach(function(k){T[k]+=o[k];});files.push(o);});'
    +'if(!files.length){$("res").innerHTML="SF 레코드가 없습니다.";return;}'
    +'var lp=pct(T.LH,T.LF);'
    +'var html="<div class=\\"ak-rate\\"><b style=\\"color:"+color(lp)+"\\">"+lp+"%</b> 라인 커버리지 <span>· 함수 "+pct(T.FNH,T.FNF)+"% · 브랜치 "+pct(T.BRH,T.BRF)+"%</span></div><div class=\\"ak-bar2\\"><i style=\\"width:"+lp+"%\\"></i></div>";'
    +'html+="<table style=\\"margin-top:.6rem\\"><tr><td><b>파일</b></td><td><b>라인</b></td><td><b>함수</b></td><td><b>브랜치</b></td></tr>"+files.map(function(o){var l=pct(o.LH,o.LF);return "<tr><td>"+o.sf+"</td><td style=\\"color:"+color(l)+"\\"><b>"+l+"%</b> ("+o.LH+"/"+o.LF+")</td><td>"+pct(o.FNH,o.FNF)+"%</td><td>"+pct(o.BRH,o.BRF)+"%</td></tr>";}).join("")+"</table>";'
    +'$("res").innerHTML=html;}'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});run();' },

{ key:'decisiontable', cat:'감리·검증', title:'결정표(Decision Table) 생성기',
  desc:'조건들을 입력하면 모든 참/거짓 조합 규칙을 자동으로 만들어 결정표를 생성합니다. 액션 행을 채워 테스트 케이스로 활용하세요. 규칙 기반 테스트 설계에.',
  h1:'결정표(Decision Table) 생성', sub:'조건들의 모든 T/F 조합으로 규칙 표를 만듭니다.',
  note:'한 줄에 조건 하나씩 입력하면 2ⁿ개 규칙 열이 생성됩니다(조건 ≤ 8 권장). 각 규칙은 조건 조합 하나이며, 기대 액션을 채워 케이스로 쓰세요. CSV로 내보낼 수 있습니다.',
  libs:['audit-kit.js'],
  body:'<textarea class="in" id="in" spellcheck="false">회원 등급이 VIP인가\\n쿠폰을 보유했는가\\n구매액이 10만원 이상인가</textarea>'
    +'<div class="frm" style="margin-top:.5rem"><button class="btn" id="run" type="button">결정표 생성</button><button class="btn btn-ghost" id="csv" type="button">⬇️ CSV</button></div>'
    +'<div class="err" id="err"></div><div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};var grid=[];'
    +'function run(){$("err").textContent="";var conds=$("in").value.replace(/\\\\n/g,"\\n").split(/\\r?\\n/).map(function(s){return s.trim();}).filter(Boolean);'
    +'if(!conds.length){$("err").textContent="조건을 입력하세요";return;}if(conds.length>8){$("err").textContent="조건은 8개 이하 권장(현재 "+conds.length+")";}'
    +'var n=conds.length,rules=Math.pow(2,n);grid=[];'
    +'var head="<tr><td><b>조건 \\\\ 규칙</b></td>";for(var r=0;r<rules;r++)head+="<td><b>R"+(r+1)+"</b></td>";head+="</tr>";'
    +'var body="";conds.forEach(function(c,ci){var row="<tr><td>"+c+"</td>";var rowArr=[c];for(var r=0;r<rules;r++){var tf=((r>>(n-1-ci))&1)?"T":"F";row+="<td style=\\"text-align:center;color:"+(tf==="T"?"#16a34a":"#dc2626")+"\\">"+tf+"</td>";rowArr.push(tf);}row+="</tr>";body+=row;grid.push(rowArr);});'
    +'var arow="<tr><td><b>기대 액션</b></td>";var actArr=["기대 액션"];for(var r=0;r<rules;r++){arow+="<td><input data-r=\\""+r+"\\" style=\\"width:60px;padding:.2rem;border:1px solid var(--border);border-radius:6px;background:var(--input-bg);color:var(--text)\\"></td>";actArr.push("");}arow+="</tr>";grid.push(actArr);'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+rules+"개</b> 규칙</div><table>"+head+body+arow+"</table>";'
    +'$("res").querySelectorAll("input[data-r]").forEach(function(inp){inp.addEventListener("input",function(){grid[grid.length-1][+inp.dataset.r+1]=inp.value;});});}'
    +'$("run").addEventListener("click",run);$("csv").addEventListener("click",function(){if(!grid.length)run();AuditKit.csv("decision-table.csv",grid);});run();' },

{ key:'boundary', cat:'감리·검증', title:'경계값·동등분할 테스트 도우미',
  desc:'유효 입력 범위(최소·최대)를 넣으면 경계값 분석(BVA)과 동등분할(EP)에 따른 테스트 값을 자동으로 산출합니다. 입력값 검증 테스트 설계에.',
  h1:'경계값·동등분할 도우미', sub:'입력 범위로 경계값(BVA)·동등분할(EP) 테스트 값을 만듭니다.',
  note:'경계값 분석은 경계 주변(min−1, min, min+1 …)에서 결함이 자주 발생한다는 점을, 동등분할은 같은 처리 그룹에서 대표값 하나만 테스트한다는 점을 활용합니다.',
  body:'<div class="frm"><label>최소값<input type="number" id="min" value="1"></label><label>최대값<input type="number" id="max" value="100"></label><label>증분(단위)<input type="number" id="step" value="1"></label></div><div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var mn=+$("min").value,mx=+$("max").value,s=+$("step").value||1;if(isNaN(mn)||isNaN(mx)||mn>mx){$("res").innerHTML="최소 ≤ 최대로 입력하세요";return;}'
    +'var nominal=Math.round((mn+mx)/2);'
    +'var bva=[[mn-s,"무효(하한 미만)","#dc2626"],[mn,"유효(하한 경계)","#16a34a"],[mn+s,"유효(하한+1)","#16a34a"],[nominal,"유효(중간값)","#16a34a"],[mx-s,"유효(상한−1)","#16a34a"],[mx,"유효(상한 경계)","#16a34a"],[mx+s,"무효(상한 초과)","#dc2626"]];'
    +'var html="<div class=\\"ak-rate\\">경계값 분석(BVA)</div><table>"+bva.map(function(b){return "<tr><td><b>"+b[0]+"</b></td><td style=\\"color:"+b[2]+"\\">"+b[1]+"</td></tr>";}).join("")+"</table>";'
    +'html+="<div class=\\"ak-rate\\" style=\\"margin-top:.8rem\\">동등분할(EP) 대표값</div><table><tr><td>무효 (< "+mn+")</td><td><b>"+(mn-s)+"</b></td></tr><tr><td>유효 ("+mn+" ~ "+mx+")</td><td><b>"+nominal+"</b></td></tr><tr><td>무효 (> "+mx+")</td><td><b>"+(mx+s)+"</b></td></tr></table>";'
    +'$("res").innerHTML=html;}'
    +'["min","max","step"].forEach(function(i){$(i).addEventListener("input",run);});run();' }

];
