// 성능테스트 도구 (OSS: Benchmark.js, simple-statistics + 원본 계산기)
export const SPECS = [

{ key:'jsbench', cat:'개발자', title:'JavaScript 코드 벤치마크', oss:1,
  desc:'두 개의 JavaScript 코드 조각의 실행 속도(ops/sec)를 통계적으로 측정·비교합니다. 성능 최적화·알고리즘 비교에. Benchmark.js 자체 호스팅, 모든 측정은 브라우저에서만 이루어집니다.',
  ogd:'JS 코드 ops/sec 벤치마크 비교(Benchmark.js). 브라우저에서만.',
  h1:'JavaScript 코드 벤치마크', sub:'두 코드의 초당 처리횟수(ops/sec)를 통계적으로 비교합니다.',
  note:'오픈소스 <b>Benchmark.js</b>(MIT, <a href="https://github.com/bestiejs/benchmark.js" target="_blank" rel="noopener">bestiejs/benchmark.js</a>)와 <b>lodash</b>(MIT)를 자체 호스팅합니다. 측정에 수 초가 걸릴 수 있습니다. 모든 실행은 브라우저에서만 이루어집니다.',
  libs:['/vendor/lodash-4/lodash.min.js','/vendor/platform-1/platform.js','/vendor/benchmark-2/benchmark.js'],
  body:'<label style="font-weight:700;font-size:.85rem;display:block;margin-bottom:.25rem">코드 A</label>'
    +'<textarea class="in" id="a" spellcheck="false" style="min-height:80px">var s="";for(var i=0;i<500;i++){s+=i;}</textarea>'
    +'<label style="font-weight:700;font-size:.85rem;display:block;margin:.5rem 0 .25rem">코드 B</label>'
    +'<textarea class="in" id="b" spellcheck="false" style="min-height:80px">var a=[];for(var i=0;i<500;i++){a.push(i);}a.join("");</textarea>'
    +'<details style="margin-top:.5rem"><summary style="cursor:pointer;font-size:.85rem;color:var(--muted)">공통 준비(setup) — 선택</summary><textarea class="in" id="setup" spellcheck="false" style="min-height:50px;margin-top:.4rem" placeholder="예: var data=[1,2,3];"></textarea></details>'
    +'<div class="frm" style="margin-top:.6rem"><button class="btn" id="run" type="button">벤치마크 실행</button><span id="st" style="align-self:center;color:var(--muted);font-size:.88rem"></span></div>'
    +'<div class="err" id="err"></div><div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function fmt(n){return Benchmark.formatNumber(n>=100?Math.round(n):+n.toFixed(2));}'
    +'function run(){$("err").textContent="";$("res").innerHTML="";$("st").textContent="측정 중…";$("run").disabled=true;'
    +'var setup=$("setup").value;var defs=[["A",$("a").value],["B",$("b").value]];var results=[];var bad=false;'
    +'var suite=new Benchmark.Suite();'
    +'defs.forEach(function(d){if(!d[1].trim())return;suite.add(d[0],{fn:d[1],setup:setup});});'
    +'suite.on("cycle",function(e){var b=e.target;if(b.error)return;results.push({name:b.name,hz:b.hz,rme:b.stats.rme,n:b.stats.sample.length});$("st").textContent=String(b);});'
    +'suite.on("error",function(e){bad=true;var er=e.target.error;$("err").textContent="⚠️ "+(er&&er.message?er.message:"실행 오류");});'
    +'suite.on("complete",function(){$("run").disabled=false;if(bad){$("st").textContent="";return;}$("st").textContent="완료 ✓";'
    +'results.sort(function(x,y){return y.hz-x.hz;});var max=results.length?results[0].hz:0;'
    +'var head="<tr><td><b>코드</b></td><td><b>ops/sec</b></td><td><b>±오차</b></td><td><b>샘플</b></td><td><b>상대</b></td></tr>";'
    +'var rows=results.map(function(r,i){return "<tr><td>"+r.name+(i===0?" ★":"")+"</td><td><b>"+fmt(r.hz)+"</b></td><td>±"+r.rme.toFixed(1)+"%</td><td>"+r.n+"</td><td>"+(max?(r.hz/max).toFixed(2)+"×":"-")+"</td></tr>";}).join("");'
    +'var verdict=results.length>1?("<div class=\\"ak-rate\\" style=\\"margin-top:.5rem\\"><b>"+results[0].name+"</b> 가 "+(results[0].hz/results[1].hz).toFixed(2)+"× 더 빠릅니다</div>"):"";'
    +'$("res").innerHTML="<table>"+head+rows+"</table>"+verdict;});'
    +'try{suite.run({async:true});}catch(e){$("run").disabled=false;$("err").textContent="⚠️ "+e.message;}}'
    +'$("run").addEventListener("click",run);' },

{ key:'latencystats', cat:'감리·검증', title:'응답시간 분포·통계 분석', oss:1,
  desc:'응답시간(지연시간) 목록을 붙여넣으면 평균·중앙값·표준편차·p90/p95/p99 백분위와 Apdex, 분포 히스토그램을 한 번에 계산합니다. 성능시험 결과 분석에. simple-statistics 자체 호스팅, 브라우저에서만 처리됩니다.',
  ogd:'응답시간 백분위·Apdex·히스토그램 분석(simple-statistics). 브라우저에서만.',
  h1:'응답시간 분포·통계 분석', sub:'지연시간 목록의 백분위·표준편차·Apdex·히스토그램을 계산합니다.',
  note:'오픈소스 <b>simple-statistics</b>(ISC, <a href="https://github.com/simple-statistics/simple-statistics" target="_blank" rel="noopener">simple-statistics/simple-statistics</a>)를 자체 호스팅합니다. Apdex는 임계 T 이하=만족, 4T 이하=허용으로 계산합니다. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/simplestats-7/simple-statistics.min.js'],
  body:'<label style="font-weight:700;font-size:.85rem;display:block;margin-bottom:.25rem">응답시간 목록 (ms) — 한 줄에 하나 또는 쉼표 구분</label>'
    +'<textarea class="in" id="in" spellcheck="false" style="min-height:120px">120\n135\n98\n210\n156\n88\n340\n175\n142\n119\n205\n167\n133\n410\n92\n178\n151\n123\n264\n147</textarea>'
    +'<div class="frm" style="margin-top:.5rem"><label>Apdex 임계 T (ms)<input type="number" id="t" value="200" min="1"></label><label>히스토그램 구간 수<input type="number" id="bins" value="8" min="2" max="30" style="width:90px"></label></div>'
    +'<div class="err" id="err"></div><div class="res" id="res"></div><div id="hist" style="margin-top:.7rem"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function nums(){return $("in").value.split(/[\\s,]+/).map(parseFloat).filter(function(x){return !isNaN(x);});}'
    +'function run(){$("err").textContent="";var a=nums();'
    +'if(a.length<2){$("res").innerHTML="";$("hist").innerHTML="";$("err").textContent="숫자를 2개 이상 입력하세요.";return;}'
    +'var T=+$("t").value||1;var sorted=a.slice().sort(function(x,y){return x-y;});'
    +'var sat=0,tol=0;a.forEach(function(x){if(x<=T)sat++;else if(x<=4*T)tol++;});var apdex=(sat+tol/2)/a.length;'
    +'var rate=apdex>=0.94?"우수":apdex>=0.85?"양호":apdex>=0.7?"보통":apdex>=0.5?"미흡":"불량";'
    +'var rows=[["샘플 수",a.length],["평균",ss.mean(a).toFixed(1)+" ms"],["중앙값(p50)",ss.quantileSorted(sorted,0.5).toFixed(1)+" ms"],["최소 / 최대",ss.min(a)+" / "+ss.max(a)+" ms"],["표준편차",ss.standardDeviation(a).toFixed(1)+" ms"],["p90",ss.quantileSorted(sorted,0.9).toFixed(1)+" ms"],["p95",ss.quantileSorted(sorted,0.95).toFixed(1)+" ms"],["p99",ss.quantileSorted(sorted,0.99).toFixed(1)+" ms"]];'
    +'$("res").innerHTML="<div class=\\"big\\">Apdex "+apdex.toFixed(2)+" <span style=\\"font-size:.9rem;font-weight:700\\">("+rate+")</span></div><table>"+rows.map(function(r){return "<tr><td>"+r[0]+"</td><td><b>"+r[1]+"</b></td></tr>";}).join("")+"<tr><td>만족 / 허용 / 불만</td><td><b>"+sat+" / "+tol+" / "+(a.length-sat-tol)+"</b> (T="+T+", 4T="+4*T+")</td></tr></table>";'
    +'var bins=Math.max(2,Math.min(30,+$("bins").value||8));var mn=ss.min(a),mx=ss.max(a),w=(mx-mn)/bins||1;var cnt=new Array(bins).fill(0);'
    +'a.forEach(function(x){var k=Math.min(bins-1,Math.floor((x-mn)/w));cnt[k]++;});var maxc=Math.max.apply(null,cnt);'
    +'var bars=cnt.map(function(c,i){var lo=Math.round(mn+i*w),hi=Math.round(mn+(i+1)*w);var pw=maxc?Math.round(c/maxc*100):0;'
    +'return "<div style=\\"display:flex;align-items:center;gap:.5rem;margin:.18rem 0\\"><span style=\\"width:100px;text-align:right;color:var(--muted);font-family:var(--mono);font-size:.72rem\\">"+lo+"–"+hi+"</span><span style=\\"flex:1;background:var(--ground);border-radius:4px;overflow:hidden\\"><span style=\\"display:block;height:14px;width:"+pw+"%;background:var(--accent)\\"></span></span><span style=\\"width:26px;font-family:var(--mono);font-size:.72rem\\">"+c+"</span></div>";}).join("");'
    +'$("hist").innerHTML="<div style=\\"font-size:.82rem;font-weight:700;margin-bottom:.3rem\\">분포 히스토그램 (ms)</div>"+bars;}'
    +'["in","t","bins"].forEach(function(i){$(i).addEventListener("input",run);});run();' },

{ key:'littlelaw', cat:'감리·검증', title:'Little\'s Law 계산기',
  desc:'리틀의 법칙(L = λ × W)으로 동시 처리수·처리율·평균 응답시간 중 둘을 입력해 나머지 하나를 계산합니다. 성능·용량 산정의 기본 관계식. 모든 계산은 브라우저에서 이루어집니다.',
  ogd:'리틀의 법칙(L=λW)으로 동시처리수·처리율·응답시간 계산.',
  h1:'Little\'s Law 계산기', sub:'L = λ × W — 동시 처리수·처리율·응답시간의 관계를 계산합니다.',
  note:'리틀의 법칙: 동시 처리수(L) = 처리율(λ) × 평균 체류시간(W). 부하시험 계획·용량 산정에 쓰입니다. λ는 초당 처리건수(req/s), W는 초 단위입니다.',
  body:'<div class="frm"><label>계산할 값<select id="target"><option value="L">동시 처리수 L</option><option value="lam">처리율 λ (req/s)</option><option value="W">평균 응답시간 W (초)</option></select></label></div>'
    +'<div class="frm"><label>처리율 λ (req/s)<input type="number" id="lam" value="50" step="any"></label>'
    +'<label>평균 응답시간 W (초)<input type="number" id="W" value="0.2" step="any"></label>'
    +'<label>동시 처리수 L<input type="number" id="L" step="any"></label></div>'
    +'<div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var tg=$("target").value;["lam","W","L"].forEach(function(i){$(i).disabled=(i===tg);});'
    +'var lam=+$("lam").value,W=+$("W").value,L=+$("L").value,out=0,label="";'
    +'if(tg==="L"){out=lam*W;$("L").value=isFinite(out)?out.toFixed(3):"";label="L = λ × W";}'
    +'else if(tg==="lam"){out=W?L/W:0;$("lam").value=isFinite(out)?out.toFixed(3):"";label="λ = L / W";}'
    +'else{out=lam?L/lam:0;$("W").value=isFinite(out)?out.toFixed(4):"";label="W = L / λ";}'
    +'lam=+$("lam").value;W=+$("W").value;L=+$("L").value;'
    +'var big=tg==="W"?out.toFixed(4)+" 초":tg==="lam"?out.toFixed(2)+" req/s":out.toFixed(2);'
    +'$("res").innerHTML="<div class=\\"big\\">"+(isFinite(out)?big:"-")+"</div><table><tr><td>적용 식</td><td><b>"+label+"</b></td></tr><tr><td>처리율 λ</td><td><b>"+lam+" req/s</b> ("+(lam*3600).toLocaleString()+" /시간)</td></tr><tr><td>응답시간 W</td><td><b>"+W+" 초</b></td></tr><tr><td>동시 처리수 L</td><td><b>"+L+"</b></td></tr></table>";}'
    +'["target","lam","W","L"].forEach(function(i){$(i).addEventListener("input",run);$(i).addEventListener("change",run);});run();' },

{ key:'apdex', cat:'감리·검증', title:'Apdex 성능지수 계산기',
  desc:'만족·허용·불만 건수를 입력하면 애플리케이션 성능 지수(Apdex)와 등급을 계산합니다. 사용자 체감 성능 KPI 산출에. 모든 계산은 브라우저에서 이루어집니다.',
  ogd:'Apdex 성능지수·등급 계산. 브라우저에서만.',
  h1:'Apdex 성능지수 계산기', sub:'만족·허용·불만 건수로 Apdex 점수와 등급을 산출합니다.',
  note:'Apdex = (만족 + 허용÷2) ÷ 전체. 만족=임계 T 이하 응답, 허용=T~4T, 불만=4T 초과. 등급: 0.94↑ 우수 · 0.85↑ 양호 · 0.70↑ 보통 · 0.50↑ 미흡 · 그 미만 불량.',
  body:'<div class="frm"><label>만족 건수 (≤T)<input type="number" id="s" value="850" min="0"></label>'
    +'<label>허용 건수 (T~4T)<input type="number" id="t" value="120" min="0"></label>'
    +'<label>불만 건수 (>4T)<input type="number" id="f" value="30" min="0"></label></div>'
    +'<div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var s=+$("s").value||0,t=+$("t").value||0,f=+$("f").value||0,n=s+t+f;'
    +'if(!n){$("res").innerHTML="<div class=\\"big\\">-</div>";return;}var ap=(s+t/2)/n;'
    +'var rate=ap>=0.94?"우수":ap>=0.85?"양호":ap>=0.7?"보통":ap>=0.5?"미흡":"불량";'
    +'var c=ap>=0.85?"var(--ok)":ap>=0.5?"#d97706":"#dc2626";'
    +'$("res").innerHTML="<div class=\\"big\\" style=\\"color:"+c+"\\">"+ap.toFixed(3)+" <span style=\\"font-size:.95rem;font-weight:700\\">"+rate+"</span></div><table><tr><td>전체</td><td><b>"+n+"</b></td></tr><tr><td>만족 비율</td><td><b>"+(s/n*100).toFixed(1)+"%</b></td></tr><tr><td>허용 비율</td><td><b>"+(t/n*100).toFixed(1)+"%</b></td></tr><tr><td>불만 비율</td><td><b>"+(f/n*100).toFixed(1)+"%</b></td></tr></table><div style=\\"margin-top:.5rem;height:10px;background:var(--border);border-radius:5px;overflow:hidden\\"><span style=\\"display:block;height:100%;width:"+(ap*100).toFixed(1)+"%;background:"+c+"\\"></span></div>";}'
    +'["s","t","f"].forEach(function(i){$(i).addEventListener("input",run);});run();' },

{ key:'vusizing', cat:'감리·검증', title:'부하시험 VU(가상사용자) 산정기',
  desc:'목표 처리량·평균 응답시간·Think time으로 부하시험에 필요한 가상사용자(VU) 수를 리틀의 법칙으로 산정합니다. k6·JMeter 부하 계획에. 모든 계산은 브라우저에서 이루어집니다.',
  ogd:'목표 TPS·응답시간·Think time으로 필요 VU 산정.',
  h1:'부하시험 VU 산정기', sub:'목표 처리량과 응답시간·Think time으로 필요한 가상사용자 수를 계산합니다.',
  note:'필요 VU ≈ 피크 처리량(TPS) × (응답시간 + Think time). 리틀의 법칙 기반이며, 실제값은 부하 패턴·시스템 상태에 따라 달라질 수 있으니 여유를 두세요.',
  body:'<div class="frm"><label>목표 처리량<input type="number" id="tp" value="50" step="any"></label>'
    +'<label>단위<select id="unit"><option value="1">초당 (TPS)</option><option value="0.0166667">분당</option><option value="0.000277778">시간당</option></select></label>'
    +'<label>평균 응답시간 (초)<input type="number" id="rt" value="0.3" step="any"></label>'
    +'<label>Think time (초)<input type="number" id="think" value="3" step="any"></label>'
    +'<label>피크 계수<input type="number" id="peak" value="1.5" step="any"></label></div>'
    +'<div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var tps=(+$("tp").value||0)*(+$("unit").value),rt=+$("rt").value||0,think=+$("think").value||0,peak=+$("peak").value||1;'
    +'var tpsPeak=tps*peak,vu=tpsPeak*(rt+think);'
    +'$("res").innerHTML="<div class=\\"big\\">필요 VU ≈ "+Math.ceil(vu)+"</div><table><tr><td>환산 처리량</td><td><b>"+tps.toFixed(2)+" TPS</b> ("+Math.round(tps*3600).toLocaleString()+" /시간)</td></tr><tr><td>피크 처리량</td><td><b>"+tpsPeak.toFixed(2)+" TPS</b> (×"+peak+")</td></tr><tr><td>VU당 처리량</td><td><b>"+(rt+think?(1/(rt+think)).toFixed(3):"-")+" TPS</b></td></tr><tr><td>권장 Ramp-up</td><td><b>"+Math.max(1,Math.ceil(vu/10))+"분</b> (분당 ~10 VU 증가 기준)</td></tr></table>";}'
    +'["tp","unit","rt","think","peak"].forEach(function(i){$(i).addEventListener("input",run);$(i).addEventListener("change",run);});run();' }

];
