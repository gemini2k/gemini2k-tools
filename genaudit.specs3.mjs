// 전문가 도구 추가분 (OSS): alasql·JSHint·HTMLHint·CSSLint·hash-wasm + jsrsasign/forge 재활용
export const SPECS = [

{ key:'querysql', cat:'데이터', title:'CSV/JSON SQL 쿼리 실행기', oss:1,
  desc:'CSV나 JSON 데이터에 바로 SQL(SELECT·JOIN·GROUP BY·집계)을 실행해 결과를 표로 봅니다. 데이터 분석·검증에. AlaSQL 자체 호스팅. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'CSV·JSON에 SQL 쿼리 실행(AlaSQL). 브라우저에서만.',
  h1:'CSV/JSON SQL 쿼리 실행', sub:'표 데이터에 SQL을 바로 실행해 집계·필터·정렬합니다. 테이블명은 t 또는 data 입니다.',
  note:'오픈소스 <b>AlaSQL</b>(MIT, <a href="https://github.com/AlaSQL/alasql" target="_blank" rel="noopener">AlaSQL/alasql</a>)을 자체 호스팅합니다. 데이터는 전송되지 않고 브라우저에서만 처리됩니다.',
  libs:['/vendor/alasql-4/alasql.min.js'],
  body:'<div class="frm"><label>입력 형식 <select id="fmt"><option value="csv">CSV</option><option value="json">JSON 배열</option></select></label></div>'
    +'<textarea class="in" id="data" spellcheck="false">name,age,city\\n김철수,30,서울\\n이영희,25,부산\\n박민수,35,서울\\n최지우,28,부산\\n정해인,42,서울</textarea>'
    +'<div class="frm" style="margin-top:.5rem"><input type="text" id="q" value="SELECT city, COUNT(*) AS n, ROUND(AVG(age),1) AS avg_age FROM t GROUP BY city ORDER BY n DESC" style="flex:1;min-width:240px;font-family:ui-monospace,monospace"><button class="btn" id="run" type="button">실행</button></div>'
    +'<div class="err" id="err"></div><div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function parse(){var raw=$("data").value.replace(/\\\\n/g,"\\n").trim();if($("fmt").value==="json")return JSON.parse(raw);'
    +'var ls=raw.split(/\\r?\\n/).filter(Boolean);var h=ls[0].split(",").map(function(x){return x.trim();});'
    +'return ls.slice(1).map(function(l){var c=l.split(",");var o={};h.forEach(function(k,i){var v=(c[i]||"").trim();o[k]=/^-?\\d+(\\.\\d+)?$/.test(v)?+v:v;});return o;});}'
    +'function run(){$("err").textContent="";try{var rows=parse();'
    +'["t","data"].forEach(function(tn){alasql("DROP TABLE IF EXISTS "+tn);alasql("CREATE TABLE "+tn);alasql.tables[tn].data=rows;});'
    +'var r=alasql($("q").value);if(!Array.isArray(r)){$("res").innerHTML="<div class=\\"ak-rate\\">실행 완료</div>";return;}'
    +'if(!r.length){$("res").innerHTML="(결과 0행)";return;}var cols=Object.keys(r[0]);'
    +'var html="<table><tr>"+cols.map(function(c){return "<td><b>"+c+"</b></td>";}).join("")+"</tr>"+r.slice(0,200).map(function(row){return "<tr>"+cols.map(function(c){return "<td>"+(row[c]==null?"":String(row[c]))+"</td>";}).join("")+"</tr>";}).join("")+"</table>";'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+r.length+"행</b></div>"+html;'
    +'}catch(e){$("res").innerHTML="";$("err").textContent="\\u26a0\\ufe0f "+e.message;}}'
    +'$("run").addEventListener("click",run);["data","q","fmt"].forEach(function(i){$(i).addEventListener("change",run);});run();' },

{ key:'jshint', cat:'개발자', title:'JavaScript 코드 린트(정적 점검)', oss:1,
  desc:'JavaScript 코드를 JSHint로 정적 분석해 잠재적 오류·미사용 변수·위험 패턴·문법 문제를 줄 번호와 함께 알려 줍니다. 코드 품질 점검에. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'JS 코드 정적 린트(JSHint). 브라우저에서만.',
  h1:'JavaScript 코드 린트', sub:'코드의 잠재 오류·미사용 변수·위험 패턴을 정적 분석으로 찾습니다.',
  note:'오픈소스 <b>JSHint</b>(MIT, <a href="https://github.com/jshint/jshint" target="_blank" rel="noopener">jshint/jshint</a>)를 자체 호스팅합니다. 모든 분석은 브라우저에서만 이루어집니다.',
  libs:['/vendor/jshint-2/jshint.js'],
  body:'<textarea class="in" id="in" spellcheck="false">function add(a,b){\\n  var unused = 1;\\n  if (a == b) return\\n  return a+b\\n}</textarea><div class="res" id="res" style="margin-top:.6rem"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var code=$("in").value.replace(/\\\\n/g,"\\n");'
    +'try{JSHINT(code,{esversion:11,browser:true,undef:true,unused:true,eqeqeq:true},{});}catch(e){}'
    +'var errs=(typeof JSHINT!=="undefined"&&JSHINT.errors)?JSHINT.errors.filter(Boolean):[];'
    +'if(!errs.length){$("res").innerHTML="<span style=\\"color:#16a34a\\">발견된 문제가 없습니다.</span>";return;}'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+errs.length+"건</b></div><table>"+errs.map(function(e){var sev=e.code&&e.code[0]==="E"?"#dc2626":"#d97706";return "<tr><td style=\\"white-space:nowrap;color:"+sev+"\\">L"+e.line+":"+(e.character||"")+"</td><td>"+(e.reason||"").replace(/</g,"&lt;")+"</td></tr>";}).join("")+"</table>";}'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});run();' },

{ key:'htmlhint', cat:'개발자', title:'HTML 마크업 품질 점검', oss:1,
  desc:'HTML을 HTMLHint로 점검해 중복 id·필수 속성 누락·태그 닫힘·인라인 스타일 등 마크업 규칙 위반을 찾습니다. 웹 품질·표준 점검에. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'HTML 마크업 규칙 점검(HTMLHint). 브라우저에서만.',
  h1:'HTML 마크업 품질 점검', sub:'중복 id·필수 속성·태그 규칙 등 마크업 품질을 점검합니다.',
  note:'오픈소스 <b>HTMLHint</b>(MIT, <a href="https://github.com/htmlhint/HTMLHint" target="_blank" rel="noopener">htmlhint/HTMLHint</a>)를 자체 호스팅합니다. 접근성 자동 점검은 별도의 axe 도구를 함께 쓰세요. 모든 분석은 브라우저에서만 이루어집니다.',
  libs:['/vendor/htmlhint-1/htmlhint.min.js'],
  body:'<textarea class="in" id="in" spellcheck="false">&lt;div id="a"&gt;&lt;/div&gt;\\n&lt;div id="a"&gt;&lt;img src="x.png"&gt;&lt;/div&gt;\\n&lt;A HREF="#"&gt;링크&lt;/A&gt;</textarea><div class="res" id="res" style="margin-top:.6rem"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'var HH=(window.HTMLHint&&window.HTMLHint.HTMLHint)?window.HTMLHint.HTMLHint:window.HTMLHint;'
    +'function run(){var html=$("in").value.replace(/\\\\n/g,"\\n");var msgs=[];try{msgs=HH.verify(html);}catch(e){$("res").textContent="\\u26a0\\ufe0f "+e.message;return;}'
    +'if(!msgs.length){$("res").innerHTML="<span style=\\"color:#16a34a\\">규칙 위반이 없습니다.</span>";return;}'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+msgs.length+"건</b></div><table>"+msgs.map(function(m){var c=m.type==="error"?"#dc2626":"#d97706";return "<tr><td style=\\"white-space:nowrap;color:"+c+"\\">L"+m.line+":"+m.col+"</td><td>"+m.message.replace(/</g,"&lt;")+" <span style=\\"color:var(--muted)\\">("+m.rule.id+")</span></td></tr>";}).join("")+"</table>";}'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});run();' },

{ key:'csslint', cat:'개발자', title:'CSS 코드 점검(CSSLint)', oss:1,
  desc:'CSS를 CSSLint로 점검해 호환성·성능·오류·중복 등 잠재 문제를 줄 번호와 함께 알려 줍니다. 스타일시트 품질 점검에. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'CSS 코드 품질 점검(CSSLint). 브라우저에서만.',
  h1:'CSS 코드 점검', sub:'CSS의 호환성·성능·오류 등 잠재 문제를 점검합니다.',
  note:'오픈소스 <b>CSSLint</b>(MIT, <a href="https://github.com/CSSLint/csslint" target="_blank" rel="noopener">CSSLint/csslint</a>)를 자체 호스팅합니다. 일부 규칙은 권고사항이므로 맥락에 맞게 판단하세요. 모든 분석은 브라우저에서만 이루어집니다.',
  libs:['/vendor/csslint-1/csslint.js'],
  body:'<textarea class="in" id="in" spellcheck="false">.box {\\n  margin: 0px;\\n  color: #FFF;\\n  color: #fff;\\n}\\n#a { float: left; width: 100px; }</textarea><div class="res" id="res" style="margin-top:.6rem"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){var css=$("in").value.replace(/\\\\n/g,"\\n");var r;try{r=CSSLint.verify(css);}catch(e){$("res").textContent="\\u26a0\\ufe0f "+e.message;return;}'
    +'var msgs=r.messages||[];if(!msgs.length){$("res").innerHTML="<span style=\\"color:#16a34a\\">발견된 문제가 없습니다.</span>";return;}'
    +'$("res").innerHTML="<div class=\\"ak-rate\\"><b>"+msgs.length+"건</b></div><table>"+msgs.map(function(m){var c=m.type==="error"?"#dc2626":"#d97706";return "<tr><td style=\\"white-space:nowrap;color:"+c+"\\">L"+(m.line||"-")+"</td><td>"+(m.message||"").replace(/</g,"&lt;")+"</td></tr>";}).join("")+"</table>";}'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});run();' },

{ key:'checksum', cat:'보안·진단', title:'파일 무결성 체크섬(다중 해시)', oss:1,
  desc:'파일이나 텍스트의 MD5·SHA-1·SHA-256·SHA-512·SHA3-256·BLAKE2b·CRC32 해시를 한 번에 계산해 무결성을 검증합니다. 자체 호스팅 hash-wasm. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'파일·텍스트 다중 해시(무결성 검증, hash-wasm). 브라우저에서만.',
  h1:'파일 무결성 체크섬', sub:'파일 또는 텍스트의 여러 해시를 한 번에 계산합니다.',
  note:'오픈소스 <b>hash-wasm</b>(MIT, <a href="https://github.com/Daninet/hash-wasm" target="_blank" rel="noopener">Daninet/hash-wasm</a>)을 자체 호스팅합니다. 파일은 업로드되지 않고 브라우저에서만 해시됩니다. 배포파일 검증·다운로드 무결성 확인에 사용하세요.',
  libs:['/vendor/hashwasm-4/hash-wasm.min.js','audit-kit.js'],
  body:'<label class="drop" id="drop" for="file">\\ud83d\\udcc1 파일을 끌어다 놓거나 클릭해서 선택<input type="file" id="file" hidden/></label>'
    +'<div style="text-align:center;color:var(--muted);font-size:.85rem;margin:.4rem 0">— 또는 텍스트 —</div>'
    +'<textarea class="in" id="txt" spellcheck="false" style="min-height:70px">Hello, 빛의여행!</textarea>'
    +'<div class="meta" id="meta" style="font-size:.85rem;color:var(--muted);margin:.4rem 0"></div><div class="res" id="res" style="overflow-x:auto"></div>',
  script:'var $=function(i){return document.getElementById(i);};var HW=window.hashwasm;'
    +'function calc(bytes){var jobs=[["MD5",HW.md5(bytes)],["SHA-1",HW.sha1(bytes)],["SHA-256",HW.sha256(bytes)],["SHA-512",HW.sha512(bytes)],["SHA3-256",HW.sha3(bytes,256)],["BLAKE2b-256",HW.blake2b(bytes,256)],["CRC32",HW.crc32(bytes)]];'
    +'Promise.all(jobs.map(function(j){return j[1];})).then(function(vals){'
    +'$("res").innerHTML="<table>"+jobs.map(function(j,i){return "<tr><td style=\\"white-space:nowrap\\">"+j[0]+"</td><td style=\\"font-family:ui-monospace,monospace;font-size:.8rem;word-break:break-all;cursor:pointer\\" onclick=\\"navigator.clipboard&&navigator.clipboard.writeText(this.textContent)\\">"+vals[i]+"</td></tr>";}).join("")+"</table>";}).catch(function(e){$("res").textContent="\\u26a0\\ufe0f "+e.message;});}'
    +'function fromText(){$("meta").textContent="텍스트 "+(new Blob([$("txt").value]).size)+" bytes";calc(new TextEncoder().encode($("txt").value));}'
    +'$("txt").addEventListener("input",fromText);'
    +'$("file").addEventListener("change",function(){var f=$("file").files[0];if(!f)return;$("meta").textContent="파일: "+f.name+" ("+(f.size/1024).toFixed(1)+"KB)";var r=new FileReader();r.onload=function(){calc(new Uint8Array(r.result));};r.readAsArrayBuffer(f);$("drop").firstChild&&($("drop").childNodes[0].nodeValue="\\ud83d\\udcc1 "+f.name);});'
    +'fromText();' },

{ key:'csrgen', cat:'보안·진단', title:'CSR(인증서 서명요청) 생성기', oss:1,
  desc:'CN·조직·국가 등 정보를 입력하면 RSA 키쌍과 인증서 서명요청(CSR)을 PEM으로 생성합니다. SSL 인증서 발급 신청에. jsrsasign 자체 호스팅. 키는 전송 없이 브라우저에서만 생성됩니다.',
  ogd:'RSA 키쌍 + CSR(PEM) 생성(jsrsasign). 전송 없음.',
  h1:'CSR 생성기', sub:'인증서 발급에 필요한 CSR과 개인키를 만듭니다.',
  note:'오픈소스 <b>jsrsasign</b>(MIT, <a href="https://github.com/kjur/jsrsasign" target="_blank" rel="noopener">kjur/jsrsasign</a>)을 자체 호스팅합니다. 개인키와 CSR은 서버로 전송되지 않고 브라우저에서만 생성됩니다. 개인키는 안전하게 보관하세요.',
  libs:['/vendor/jsrsasign-11/jsrsasign-all-min.js'],
  body:'<div class="frm">'
    +'<label>CN(도메인)<input type="text" id="cn" value="example.com"></label>'
    +'<label>조직(O)<input type="text" id="o" value="Example Inc"></label>'
    +'<label>부서(OU)<input type="text" id="ou" value="IT"></label>'
    +'<label>지역(L)<input type="text" id="l" value="Seoul"></label>'
    +'<label>시도(ST)<input type="text" id="st" value="Seoul"></label>'
    +'<label>국가(C)<input type="text" id="c" value="KR" style="width:70px"></label>'
    +'<label>키 길이<select id="bits"><option>2048</option><option>3072</option><option>4096</option></select></label>'
    +'</div><div class="frm"><button class="btn" id="gen" type="button">CSR 생성</button><span id="st2" style="color:var(--muted);font-size:.9rem;align-self:center"></span></div>'
    +'<label style="font-weight:700;font-size:.85rem">CSR (PEM)</label><textarea class="out" id="csr" readonly style="min-height:140px"></textarea>'
    +'<label style="font-weight:700;font-size:.85rem;margin-top:.5rem;display:block">개인키 (PEM)</label><textarea class="out" id="key" readonly style="min-height:140px"></textarea>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'$("gen").addEventListener("click",function(){$("st2").textContent="생성 중\\u2026";$("gen").disabled=true;setTimeout(function(){try{'
    +'var kp=KEYUTIL.generateKeypair("RSA",+$("bits").value);'
    +'var dn="/C="+$("c").value+"/ST="+$("st").value+"/L="+$("l").value+"/O="+$("o").value+"/OU="+$("ou").value+"/CN="+$("cn").value;'
    +'var csr=KJUR.asn1.csr.CSRUtil.newCSRPEM({subject:{str:dn},sbjpubkey:kp.pubKeyObj,sigalg:"SHA256withRSA",sbjprvkey:kp.prvKeyObj});'
    +'$("csr").value=csr;$("key").value=KEYUTIL.getPEM(kp.prvKeyObj,"PKCS8PRV");$("st2").textContent="완료 \\u2713";'
    +'}catch(e){$("st2").textContent="\\u26a0\\ufe0f "+e.message;}$("gen").disabled=false;},30);});' },

{ key:'asn1', cat:'보안·진단', title:'ASN.1 / DER 디코더', oss:1,
  desc:'인증서·CSR·키 등 ASN.1(DER) 구조를 PEM 또는 16진수로 입력하면 SEQUENCE·OID·정수 등 계층 구조를 해석해 보여 줍니다. 보안·PKI 분석에. jsrsasign 자체 호스팅.',
  ogd:'ASN.1/DER 구조 디코드(jsrsasign). 브라우저에서만.',
  h1:'ASN.1 / DER 디코더', sub:'PEM 또는 16진수 DER의 ASN.1 구조를 계층으로 해석합니다.',
  note:'오픈소스 <b>jsrsasign</b>(MIT, <a href="https://github.com/kjur/jsrsasign" target="_blank" rel="noopener">kjur/jsrsasign</a>)을 자체 호스팅합니다. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/jsrsasign-11/jsrsasign-all-min.js'],
  body:'<div class="frm"><button class="btn btn-ghost" id="sample" type="button">예시(인증서) 넣기</button></div>'
    +'<textarea class="in" id="in" spellcheck="false" placeholder="-----BEGIN CERTIFICATE----- 또는 16진수"></textarea>'
    +'<div class="err" id="err"></div><div class="out" id="res" style="margin-top:.6rem;max-height:420px"></div>',
  script:'var $=function(i){return document.getElementById(i);};'
    +'function run(){$("err").textContent="";var t=$("in").value.trim();if(!t){$("res").textContent="";return;}'
    +'try{var hex;if(/-----BEGIN/.test(t)){hex=pemtohex(t);}else{hex=t.replace(/[^0-9a-fA-F]/g,"");}'
    +'$("res").textContent=ASN1HEX.dump(hex);}catch(e){$("res").textContent="";$("err").textContent="\\u26a0\\ufe0f 해석 실패: "+e.message;}}'
    +'$("sample").addEventListener("click",function(){var kp=KEYUTIL.generateKeypair("RSA",512);var c=new KJUR.asn1.x509.Certificate({version:3,serial:{int:1},issuer:{str:"/CN=Sample CA"},notbefore:"240101000000Z",notafter:"340101000000Z",subject:{str:"/CN=gemini2k.co.kr/O=gemini2k/C=KR"},sbjpubkey:kp.pubKeyObj,sigalg:"SHA256withRSA",cakey:kp.prvKeyObj});$("in").value=c.getPEM();run();});'
    +'var _t;$("in").addEventListener("input",function(){clearTimeout(_t);_t=setTimeout(run,300);});' },

{ key:'pkcs12', cat:'보안·진단', title:'PKCS#12(.p12/.pfx) 분석기', oss:1,
  desc:'PKCS#12 인증서 파일(.p12/.pfx)과 비밀번호로 내부 인증서의 발급대상·발급자·유효기간과 개인키 포함 여부를 확인합니다. node-forge 자체 호스팅. 업로드 없이 브라우저에서만 처리됩니다.',
  ogd:'.p12/.pfx 인증서 번들 분석(node-forge). 브라우저에서만.',
  h1:'PKCS#12(.p12/.pfx) 분석기', sub:'인증서 번들 파일의 내용을 비밀번호로 열어 확인합니다.',
  note:'오픈소스 <b>node-forge</b>(BSD, <a href="https://github.com/digitalbazaar/forge" target="_blank" rel="noopener">digitalbazaar/forge</a>)를 자체 호스팅합니다. 파일·비밀번호는 전송되지 않고 브라우저에서만 처리됩니다.',
  libs:['/vendor/forge-1/forge.min.js','audit-kit.js'],
  body:'<label class="drop" id="drop" for="file">\\ud83d\\udd10 .p12 / .pfx 파일을 끌어다 놓거나 클릭<input type="file" id="file" accept=".p12,.pfx" hidden/></label>'
    +'<div class="frm" style="margin-top:.5rem"><label>비밀번호<input type="text" id="pw" value=""></label><button class="btn btn-ghost" id="sample" type="button">예시 생성(pw:1234)</button></div>'
    +'<div class="err" id="err"></div><div class="res" id="res"></div>',
  script:'var $=function(i){return document.getElementById(i);};var lastDer=null;'
    +'function dn(a){return a.map(function(x){return x.shortName+"="+x.value;}).join(", ");}'
    +'function parse(der,pw){$("err").textContent="";try{var asn1=forge.asn1.fromDer(der);var p12=forge.pkcs12.pkcs12FromAsn1(asn1,pw);'
    +'var certs=[],keys=0;p12.safeContents.forEach(function(sc){sc.safeBags.forEach(function(bag){if(bag.cert){certs.push(bag.cert);}else if(bag.key||bag.type===forge.pki.oids.keyBag||bag.type===forge.pki.oids.pkcs8ShroudedKeyBag){keys++;}});});'
    +'var html="<table><tr><td>개인키 포함</td><td><b>"+(keys>0?"예 ("+keys+")":"아니오")+"</b></td></tr><tr><td>인증서 수</td><td><b>"+certs.length+"</b></td></tr></table>";'
    +'certs.forEach(function(c,i){var na=c.validity.notAfter;var days=Math.ceil((na-new Date())/86400000);html+="<div style=\\"border-top:1px solid var(--border);margin-top:.5rem;padding-top:.5rem\\"><b>인증서 "+(i+1)+"</b><table><tr><td>발급대상</td><td><b>"+dn(c.subject.attributes)+"</b></td></tr><tr><td>발급자</td><td>"+dn(c.issuer.attributes)+"</td></tr><tr><td>만료</td><td><b style=\\"color:"+(days<0?"#dc2626":days<30?"#d97706":"#16a34a")+"\\">"+(days<0?"만료됨":"D-"+days)+"</b> ("+na.toISOString().slice(0,10)+")</td></tr></table></div>";});'
    +'$("res").innerHTML=html;}catch(e){$("res").innerHTML="";$("err").textContent="\\u26a0\\ufe0f 열 수 없습니다(비밀번호 확인): "+e.message;}}'
    +'$("file").addEventListener("change",function(){var f=$("file").files[0];if(!f)return;var r=new FileReader();r.onload=function(){lastDer=r.result;parse(r.result,$("pw").value);};r.readAsBinaryString(f);});'
    +'$("pw").addEventListener("input",function(){if(lastDer)parse(lastDer,$("pw").value);});'
    +'$("sample").addEventListener("click",function(){var keys=forge.pki.rsa.generateKeyPair(1024);var cert=forge.pki.createCertificate();cert.publicKey=keys.publicKey;cert.serialNumber="01";cert.validity.notBefore=new Date();cert.validity.notAfter=new Date();cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear()+1);var at=[{name:"commonName",value:"sample.gemini2k.co.kr"},{name:"organizationName",value:"gemini2k"},{shortName:"C",value:"KR"}];cert.setSubject(at);cert.setIssuer(at);cert.sign(keys.privateKey,forge.md.sha256.create());var p12=forge.pkcs12.toPkcs12Asn1(keys.privateKey,[cert],"1234",{algorithm:"3des"});lastDer=forge.asn1.toDer(p12).getBytes();$("pw").value="1234";parse(lastDer,"1234");});' }

];
