// 감리·점검 전문가 도구 사양 2차 (N3 보안·진단 / N4 개인정보·데이터 / N5 요구·테스트·접근성·네트워크)
export const SPECS = [

/* ===== N3: 보안·진단 ===== */
{ key:'swweakness', cat:'보안·진단', title:'SW 보안약점 자가점검 체크리스트',
  desc:'행정안전부 SW 개발보안 가이드 7개 유형(입력검증·보안기능·시간및상태·에러처리·코드오류·캡슐화·API오용)의 보안약점을 자가점검합니다.',
  h1:'SW 보안약점 자가점검', sub:'행안부 SW 개발보안 가이드 기준 보안약점을 유형별로 점검합니다.',
  note:'행정안전부 「소프트웨어 개발보안 가이드」 7개 유형 대표 항목입니다. 충족률이 자동 집계되며 CSV로 진단보고서에 첨부하세요.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'swweakness',groups:[
    {title:'1. 입력데이터 검증 및 표현',items:['SQL 삽입 방지(파라미터 바인딩)','경로 조작 및 자원 삽입 차단','크로스사이트 스크립트(XSS) 방지','운영체제 명령어 삽입 차단','위험한 형식 파일 업로드 제한','신뢰되지 않은 URL 자동접속 차단','XML/XPath/LDAP 삽입 방지']},
    {title:'2. 보안 기능',items:['적절한 인증 없는 중요기능 차단','부적절한 인가(접근통제) 차단','중요정보 평문 저장/전송 금지(암호화)','취약한 암호화 알고리즘 미사용','하드코딩된 비밀번호/키 제거','충분한 키 길이·안전한 난수 사용']},
    {title:'3. 시간 및 상태',items:['경쟁조건(Race Condition) 방지','종료되지 않는 반복/재귀 차단']},
    {title:'4. 에러 처리',items:['오류 메시지에 민감정보 노출 금지','예외처리 누락/부적절 차단']},
    {title:'5. 코드 오류',items:['널 포인터 역참조 방지','부적절한 자원 해제 차단','초기화되지 않은 변수 사용 금지']},
    {title:'6. 캡슐화',items:['중요정보 포함 메서드 접근제한','제거되지 않은 디버그 코드 점검','시스템 정보 노출 차단']},
    {title:'7. API 오용',items:['위험한(취약한) API 사용 금지','신뢰할 수 없는 함수 사용 점검']}]});` },

{ key:'cvss', cat:'보안·진단', title:'CVSS 3.1 점수 계산기',
  desc:'취약점 기본 평가지표(공격경로·복잡도·권한·사용자상호작용·범위·CIA 영향)로 CVSS 3.1 기본점수와 심각도·벡터를 계산합니다.',
  h1:'CVSS 3.1 점수 계산기', sub:'취약점의 기본 메트릭으로 CVSS 3.1 기본 점수와 심각도를 산출합니다.',
  note:'FIRST CVSS v3.1 기본점수(Base Score) 공식 기준입니다. 시간·환경 지표는 제외한 기본 평가입니다.',
  body:`<div class="frm">
    <label>공격 경로(AV)<select id="AV"><option value="0.85">네트워크(N)</option><option value="0.62">인접(A)</option><option value="0.55">로컬(L)</option><option value="0.2">물리(P)</option></select></label>
    <label>공격 복잡도(AC)<select id="AC"><option value="0.77">낮음(L)</option><option value="0.44">높음(H)</option></select></label>
    <label>필요 권한(PR)<select id="PR"><option value="0.85">없음(N)</option><option value="0.62">낮음(L)</option><option value="0.27">높음(H)</option></select></label>
    <label>사용자 상호작용(UI)<select id="UI"><option value="0.85">불필요(N)</option><option value="0.62">필요(R)</option></select></label>
    <label>범위(S)<select id="S"><option value="U">변경없음(U)</option><option value="C">변경됨(C)</option></select></label>
    <label>기밀성(C)<select id="C"><option value="0.56">높음(H)</option><option value="0.22">낮음(L)</option><option value="0">없음(N)</option></select></label>
    <label>무결성(I)<select id="I"><option value="0.56">높음(H)</option><option value="0.22">낮음(L)</option><option value="0">없음(N)</option></select></label>
    <label>가용성(A)<select id="A"><option value="0.56">높음(H)</option><option value="0.22">낮음(L)</option><option value="0">없음(N)</option></select></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function rup(x){return Math.ceil(x*10)/10;}
  function run(){var av=+$('AV').value,ac=+$('AC').value,ui=+$('UI').value,scope=$('S').value;
    var pr=+$('PR').value; if(scope==='C'){if(pr===0.62)pr=0.68;else if(pr===0.27)pr=0.5;}
    var c=+$('C').value,i=+$('I').value,a=+$('A').value;
    var iss=1-(1-c)*(1-i)*(1-a);
    var impact=scope==='C'?7.52*(iss-0.029)-3.25*Math.pow(iss-0.02,15):6.42*iss;
    var expl=8.22*av*ac*pr*ui;
    var base;
    if(impact<=0)base=0;else if(scope==='C')base=Math.min(rup(1.08*(impact+expl)),10);else base=Math.min(rup(impact+expl),10);
    var sev=base===0?'없음':base<4?'낮음(Low)':base<7?'중간(Medium)':base<9?'높음(High)':'심각(Critical)';
    var col=base<4?'#16a34a':base<7?'#d97706':base<9?'#dc2626':'#9333ea';
    var avc={'0.85':'N','0.62':'A','0.55':'L','0.2':'P'}[$('AV').value];
    var vec='CVSS:3.1/AV:'+avc+'/AC:'+($('AC').value==='0.77'?'L':'H')+'/PR:'+({'0.85':'N','0.62':'L','0.27':'H'}[$('PR').value])+'/UI:'+($('UI').value==='0.85'?'N':'R')+'/S:'+scope+'/C:'+({'0.56':'H','0.22':'L','0':'N'}[$('C').value])+'/I:'+({'0.56':'H','0.22':'L','0':'N'}[$('I').value])+'/A:'+({'0.56':'H','0.22':'L','0':'N'}[$('A').value]);
    $('res').innerHTML='<div class="big" style="color:'+col+'">'+base.toFixed(1)+' / 10 · '+sev+'</div><table><tr><td>심각도</td><td><b style="color:'+col+'">'+sev+'</b></td></tr><tr><td>벡터</td><td style="font-family:ui-monospace,monospace;font-size:.82rem">'+vec+'</td></tr></table>';}
  ['AV','AC','PR','UI','S','C','I','A'].forEach(function(i){$(i).addEventListener('change',run);});run();` },

{ key:'seccode', cat:'보안·진단', title:'시큐어코딩 패턴 스캐너',
  desc:'소스코드를 붙여넣으면 SQL인젝션·XSS·하드코딩·위험함수 등 보안약점 의심 패턴을 휴리스틱으로 찾아 줄 번호와 함께 알려 줍니다(참고용).',
  h1:'시큐어코딩 패턴 스캐너', sub:'소스에서 보안약점 의심 패턴을 찾아 줄 번호로 표시합니다.',
  note:'정규식 휴리스틱 기반 참고용 점검입니다(정적분석 도구를 대체하지 않음). 모든 분석은 브라우저에서만 이루어지며 코드는 전송되지 않습니다.',
  body:`<textarea class="in" id="in" spellcheck="false">function search(q){
  var sql = "SELECT * FROM users WHERE name = '" + q + "'";
  el.innerHTML = q;
  var token = Math.random().toString(36);
  var pw = "admin1234";
  eval(userInput);
}</textarea><div class="err" id="err"></div><div class="out" id="out" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  var RULES=[
    [/\\.innerHTML\\s*=|document\\.write\\s*\\(/,'XSS','innerHTML/document.write 직접 사용 — 출력 인코딩/textContent 권장'],
    [/(SELECT|INSERT|UPDATE|DELETE)[^;]*['"]\\s*\\+|\\+\\s*['"][^;]*(WHERE|VALUES)/i,'SQL 삽입','SQL 문자열 결합 — 파라미터 바인딩(PreparedStatement) 사용'],
    [/\\beval\\s*\\(|new\\s+Function\\s*\\(/,'코드 삽입','eval/new Function — 동적 코드 실행 제거'],
    [/Math\\.random\\s*\\(/,'취약한 난수','보안 토큰에 Math.random 금지 — crypto.getRandomValues 사용'],
    [/(password|passwd|pwd|secret|api[_-]?key|token)\\s*[:=]\\s*['"][^'"]{3,}/i,'하드코딩 비밀','코드에 비밀번호/키 하드코딩 — 환경변수/비밀관리'],
    [/\\bmd5\\b|\\bsha1\\b/i,'취약한 해시','MD5/SHA-1 — SHA-256 이상 사용'],
    [/exec\\s*\\(|child_process|Runtime\\.getRuntime|os\\.system/,'명령 삽입','외부 명령 실행 — 입력 검증/화이트리스트'],
    [/http:\\/\\//,'평문 전송','http:// 사용 — https 권장'],
    [/console\\.(log|debug)\\s*\\(/,'디버그 코드','운영 배포 전 디버그 출력 제거']
  ];
  function run(){$('err').textContent='';var lines=$('in').value.split(/\\n/);var hits=[];
    lines.forEach(function(ln,i){RULES.forEach(function(r){if(r[0].test(ln))hits.push({line:i+1,type:r[1],msg:r[2],code:ln.trim().slice(0,80)});});});
    if(!hits.length){$('out').innerHTML='<span style="color:#16a34a">의심 패턴이 발견되지 않았습니다.</span>';return;}
    $('out').innerHTML='<b>'+hits.length+'건 의심:</b>\\n\\n'+hits.map(function(h){return 'L'+h.line+' ['+h.type+'] '+h.msg+'\\n   '+h.code;}).join('\\n\\n');}
  $('in').addEventListener('input',run);run();` },

{ key:'secretscan', cat:'보안·진단', title:'하드코딩 시크릿·키 탐지기',
  desc:'소스·설정 텍스트에서 AWS 키·구글 API 키·개인키·토큰·비밀번호 등 노출된 시크릿 패턴을 탐지해 마스킹과 함께 보여 줍니다(참고용).',
  h1:'하드코딩 시크릿·키 탐지', sub:'코드·설정에 노출된 API 키·비밀번호 등 시크릿을 찾아 줍니다.',
  note:'정규식 휴리스틱 기반 참고용 점검입니다. 모든 분석은 브라우저에서만 이루어지며 입력은 전송되지 않습니다.',
  body:`<textarea class="in" id="in" spellcheck="false">aws_access_key_id = AKIAIOSFODNN7EXAMPLE
GOOGLE_API_KEY="AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0"
db.password = "P@ssw0rd!2024"
-----BEGIN RSA PRIVATE KEY-----
slack_token=xoxb-1234567890-abcdefghijkl</textarea><div class="out" id="out" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function mask(s){return s.length<=8?s[0]+'***':s.slice(0,4)+'****'+s.slice(-3);}
  var RULES=[
    [/AKIA[0-9A-Z]{16}/g,'AWS Access Key'],
    [/AIza[0-9A-Za-z\\-_]{35}/g,'Google API Key'],
    [/xox[baprs]-[0-9A-Za-z-]{10,}/g,'Slack Token'],
    [/-----BEGIN(?:\\s\\w+)? PRIVATE KEY-----/g,'Private Key Block'],
    [/eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{5,}/g,'JWT'],
    [/(?:password|passwd|pwd|secret|token|api[_-]?key)\\s*[:=]\\s*['"]?([^\\s'"]{6,})/gi,'하드코딩 비밀']
  ];
  function run(){var txt=$('in').value,lines=txt.split(/\\n/),hits=[];
    lines.forEach(function(ln,i){RULES.forEach(function(r){var m;r[1];var re=new RegExp(r[0].source,r[0].flags);while((m=re.exec(ln))){hits.push({line:i+1,type:r[1],val:mask(m[1]||m[0])});}});});
    if(!hits.length){$('out').innerHTML='<span style="color:#16a34a">노출된 시크릿이 발견되지 않았습니다.</span>';return;}
    $('out').innerHTML='<b style="color:#dc2626">'+hits.length+'건 발견:</b>\\n\\n'+hits.map(function(h){return 'L'+h.line+' ['+h.type+'] '+h.val;}).join('\\n');}
  $('in').addEventListener('input',run);run();` },

{ key:'secheaders', cat:'보안·진단', title:'보안 HTTP 헤더 점검·생성기',
  desc:'HTTP 응답 헤더를 붙여넣으면 CSP·HSTS·X-Frame-Options 등 보안 헤더의 적용 여부를 점검하고 권장 헤더를 생성합니다.',
  h1:'보안 HTTP 헤더 점검·생성', sub:'응답 헤더를 붙여넣어 보안 헤더 적용 여부를 점검합니다.',
  note:'주요 보안 응답 헤더의 존재 여부를 점검합니다. 권장값은 환경에 맞게 조정하세요. 모든 처리는 브라우저에서만 이루어집니다.',
  body:`<textarea class="in" id="in" spellcheck="false">HTTP/2 200
content-type: text/html
x-content-type-options: nosniff</textarea><div class="res" id="res" style="margin-top:.6rem"></div><h3 style="font-size:.9rem;margin:1rem 0 .3rem">권장 헤더</h3><div class="out" id="rec"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  var CHK=[
    ['Strict-Transport-Security','HSTS — HTTPS 강제','max-age=31536000; includeSubDomains'],
    ['Content-Security-Policy','CSP — XSS/주입 완화',"default-src 'self'"],
    ['X-Frame-Options','클릭재킹 방지','DENY'],
    ['X-Content-Type-Options','MIME 스니핑 방지','nosniff'],
    ['Referrer-Policy','리퍼러 정보 제한','strict-origin-when-cross-origin'],
    ['Permissions-Policy','브라우저 기능 제한','geolocation=(), camera=()']
  ];
  function run(){var txt=$('in').value.toLowerCase();
    var rows=CHK.map(function(c){var ok=txt.indexOf(c[0].toLowerCase()+':')>=0||txt.indexOf(c[0].toLowerCase()+' :')>=0;
      return '<tr><td>'+(ok?'✅':'❌')+' '+c[0]+'</td><td>'+c[1]+'</td></tr>';}).join('');
    var n=CHK.filter(function(c){return txt.indexOf(c[0].toLowerCase())>=0;}).length;
    $('res').innerHTML='<div class="ak-rate"><b>'+n+'/'+CHK.length+'</b> 적용</div><table>'+rows+'</table>';
    $('rec').textContent=CHK.map(function(c){return c[0]+': '+c[2];}).join('\\n');}
  $('in').addEventListener('input',run);run();` },

{ key:'certparse', cat:'보안·진단', title:'인증서(PEM) 분석기', oss:1,
  desc:'X.509 인증서(PEM)를 붙여넣으면 발급대상·발급자·유효기간·만료일·일련번호·서명알고리즘을 분석합니다. node-forge 자체 호스팅.',
  h1:'인증서(PEM) 분석기', sub:'X.509 인증서의 발급자·유효기간·만료일을 확인합니다.',
  note:'오픈소스 <b>node-forge</b>(BSD, <a href="https://github.com/digitalbazaar/forge" target="_blank" rel="noopener">digitalbazaar/forge</a>)를 자체 호스팅합니다. 인증서는 전송되지 않고 브라우저에서만 분석됩니다.',
  libs:['/vendor/forge-1/forge.min.js','audit-kit.js'],
  body:`<div class="frm"><button class="btn btn-ghost" id="sample" type="button">예시 인증서 생성</button></div><textarea class="in" id="in" spellcheck="false" placeholder="-----BEGIN CERTIFICATE-----"></textarea><div class="err" id="err"></div><div class="res" id="res" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function dn(a){return a.map(function(x){return x.shortName+'='+x.value;}).join(', ');}
  function run(){$('err').textContent='';var pem=$('in').value.trim();if(!pem){$('res').innerHTML='';return;}
    try{var c=forge.pki.certificateFromPem(pem);var na=c.validity.notAfter,nb=c.validity.notBefore;
      var days=Math.ceil((na-new Date())/86400000);var bits=c.publicKey&&c.publicKey.n?c.publicKey.n.bitLength():'-';
      $('res').innerHTML='<table>'+
      '<tr><td>발급대상(Subject)</td><td><b>'+dn(c.subject.attributes)+'</b></td></tr>'+
      '<tr><td>발급자(Issuer)</td><td>'+dn(c.issuer.attributes)+'</td></tr>'+
      '<tr><td>유효기간</td><td>'+nb.toISOString().slice(0,10)+' ~ '+na.toISOString().slice(0,10)+'</td></tr>'+
      '<tr><td>만료까지</td><td><b style="color:'+(days<0?'#dc2626':days<30?'#d97706':'#16a34a')+'">'+(days<0?'만료됨':'D-'+days)+'</b></td></tr>'+
      '<tr><td>일련번호</td><td style="font-family:ui-monospace,monospace;font-size:.8rem">'+c.serialNumber+'</td></tr>'+
      '<tr><td>서명 알고리즘</td><td>'+(forge.pki.oids[c.signatureOid]||c.signatureOid)+'</td></tr>'+
      '<tr><td>공개키</td><td>'+bits+' bit</td></tr></table>';
    }catch(e){$('res').innerHTML='';$('err').textContent='⚠️ 인증서를 분석할 수 없습니다: '+e.message;}}
  $('sample').addEventListener('click',function(){
    var keys=forge.pki.rsa.generateKeyPair(512);var c=forge.pki.createCertificate();
    c.publicKey=keys.publicKey;c.serialNumber='01'+Date.now();c.validity.notBefore=new Date();
    c.validity.notAfter=new Date();c.validity.notAfter.setFullYear(c.validity.notBefore.getFullYear()+1);
    var attrs=[{name:'commonName',value:'gemini2k.co.kr'},{name:'organizationName',value:'gemini2k'},{shortName:'C',value:'KR'}];
    c.setSubject(attrs);c.setIssuer(attrs);c.sign(keys.privateKey,forge.md.sha256.create());
    $('in').value=forge.pki.certificateToPem(c);run();});
  $('in').addEventListener('input',run);` },

/* ===== N4: 개인정보 ===== */
{ key:'pia', cat:'개인정보', title:'개인정보 영향평가(PIA) 체크리스트',
  desc:'개인정보 수집·이용·제공·보관·파기·안전성확보조치·정보주체 권리 보장 등 개인정보 영향평가(PIA) 항목을 점검하고 충족률을 집계합니다.',
  h1:'개인정보 영향평가(PIA) 체크리스트', sub:'개인정보 처리 전반의 위험요소를 영역별로 점검합니다.',
  note:'개인정보보호법·영향평가 수행안내서 기준의 대표 점검항목입니다. 실제 영향평가는 전문기관 수행이 필요하며, 본 도구는 사전 자가점검용입니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'pia',groups:[
    {title:'수집·이용',items:['수집 목적의 명확성·최소수집 원칙','정보주체 동의(또는 법적근거) 확보','고유식별정보/민감정보 별도 동의·근거','수집 항목·목적 고지(개인정보 처리방침)']},
    {title:'보유·파기',items:['보유기간 명시·최소화','보유기간 경과 시 지체없는 파기','파기 방법(복구 불가)·파기 기록']},
    {title:'제공·위탁',items:['제3자 제공 동의/근거 확보','처리위탁 시 위탁계약·문서화','국외이전 시 별도 고지·동의','수탁자 관리·감독']},
    {title:'안전성 확보조치',items:['접근권한 최소화·관리','접근통제(인증·접속기록)','암호화(저장·전송)','접속기록 보관·점검(1년 이상)','악성코드 방지·물리적 보호','개인정보처리시스템 망분리/접근제한']},
    {title:'정보주체 권리·관리',items:['열람·정정·삭제·처리정지 절차','개인정보 처리방침 공개','개인정보 보호책임자(CPO) 지정','유출 대응·신고 절차 수립']}]});` },

{ key:'pdflow', cat:'개인정보', title:'개인정보 흐름표 생성기',
  desc:'개인정보의 수집·이용·제공·위탁·보관·파기 단계별 항목·목적·법적근거·보유기간·담당을 흐름표로 작성하고 CSV로 내보냅니다.',
  h1:'개인정보 흐름표', sub:'개인정보 생명주기(수집~파기) 흐름을 표로 정리합니다.',
  note:'개인정보 영향평가·처리방침 작성의 기초 자료입니다. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'pdflow',cols:[
    {k:'stage',label:'단계',type:'select',opts:['수집','이용','제공','위탁','보관','파기']},
    {k:'item',label:'개인정보 항목',w:'150px',type:'area'},
    {k:'purpose',label:'처리 목적',w:'140px',type:'area'},
    {k:'basis',label:'법적근거',type:'select',opts:['동의','법령','계약이행','정당한이익','기타']},
    {k:'period',label:'보유기간',w:'90px'},{k:'dept',label:'처리부서/담당',w:'100px'},{k:'system',label:'처리시스템',w:'100px'}],
    seed:[{stage:'수집',item:'성명, 연락처, 이메일',purpose:'회원 가입·식별',basis:'동의',period:'탈퇴 시까지',dept:'서비스팀',system:'회원DB'}]});` },

{ key:'pdcategory', cat:'개인정보', title:'개인정보 항목 분류 점검표',
  desc:'시스템이 수집하는 정보를 일반·고유식별정보·민감정보·금융정보로 분류하고 법적 처리요건(별도 동의 등)을 점검합니다.',
  h1:'개인정보 항목 분류 점검', sub:'수집 정보를 유형별로 분류해 법적 처리요건을 확인합니다.',
  note:'고유식별정보(주민·여권·운전면허·외국인등록번호)와 민감정보(건강·사상·노조 등)는 원칙적으로 별도 동의 또는 법령 근거가 필요합니다. ‘충족=수집함’으로 표시하세요.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'pdcategory',groups:[
    {title:'일반 개인정보',items:['성명','연락처(전화·이메일)','주소','생년월일','아이디/비밀번호','IP·접속기록·쿠키']},
    {title:'고유식별정보 (별도 동의/법령 필요)',items:['주민등록번호','여권번호','운전면허번호','외국인등록번호']},
    {title:'민감정보 (별도 동의/법령 필요)',items:['건강·의료 정보','사상·신념','노동조합·정당 가입','정치적 견해','유전정보·범죄경력','생체인식정보']},
    {title:'금융·재산 정보',items:['계좌번호','신용카드번호','거래내역','자산·소득 정보']}]});` },

{ key:'retention', cat:'개인정보', title:'보유기간·파기일정 계산기',
  desc:'수집일과 법정/내부 보유기간으로 파기 예정일과 D-day를 계산합니다. 주요 법정 보유기간 참고표 포함.',
  h1:'보유기간·파기일정 계산기', sub:'수집일과 보유기간으로 파기 예정일을 계산합니다.',
  note:'법정 보유기간 예: 계약·청약철회 5년, 대금결제 5년, 소비자 불만·분쟁 3년, 표시·광고 6개월, 통신비밀보호법 접속기록 3개월(통신) 등. 실제 적용 법령을 확인하세요.',
  body:`<div class="frm">
    <label>수집일<input type="date" id="start"></label>
    <label>보유기간<input type="number" id="num" value="3"></label>
    <label>단위<select id="unit"><option value="y">년</option><option value="m">개월</option><option value="d">일</option></select></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};function pad(n){return(n<10?'0':'')+n;}
  (function(){var n=new Date();$('start').value=n.getFullYear()+'-'+pad(n.getMonth()+1)+'-'+pad(n.getDate());})();
  function run(){var s=new Date($('start').value);if(isNaN(s)){$('res').innerHTML='수집일을 입력하세요';return;}
    var num=+$('num').value||0,u=$('unit').value,d=new Date(s);
    if(u==='y')d.setFullYear(d.getFullYear()+num);else if(u==='m')d.setMonth(d.getMonth()+num);else d.setDate(d.getDate()+num);
    var days=Math.ceil((d-new Date())/86400000);
    $('res').innerHTML='<div class="big">'+d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'</div><table><tr><td>파기 예정일</td><td><b>'+d.toISOString().slice(0,10)+'</b></td></tr><tr><td>남은 기간</td><td><b style="color:'+(days<0?'#dc2626':days<30?'#d97706':'#16a34a')+'">'+(days<0?'파기 기한 경과('+(-days)+'일)':'D-'+days)+'</b></td></tr></table>';}
  ['start','num','unit'].forEach(function(i){$(i).addEventListener('input',run);$(i).addEventListener('change',run);});run();` },

/* ===== N4: 데이터/DB ===== */
{ key:'dbnaming', cat:'데이터', title:'DB 명명규칙 검사기',
  desc:'테이블·컬럼명 목록을 붙여넣으면 영문·대소문자·길이·예약어·접두어 등 표준 명명규칙 위반을 점검합니다. DB 표준화에.',
  h1:'DB 명명규칙 검사기', sub:'테이블/컬럼명이 표준 명명규칙을 지키는지 점검합니다.',
  note:'기본 규칙: 영문 소문자·숫자·언더스코어만, 숫자로 시작 금지, 예약어 금지, 길이 제한. 규칙은 기관 표준에 맞게 참고하세요. 모든 처리는 브라우저에서만 이루어집니다.',
  body:`<div class="frm"><label>최대 길이<input type="number" id="max" value="30" style="width:90px"></label>
  <label style="flex-direction:row;align-items:center;gap:.4rem"><input type="checkbox" id="upper">대문자 허용</label></div>
  <textarea class="in" id="in" spellcheck="false">user_master
USER_LOG
2nd_table
order
customer_name
ord_dt
tbl_상품</textarea><div class="res" id="res" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  var RES=['select','from','where','order','group','table','user','date','desc','asc','index','key','int','char','number'];
  function run(){var max=+$('max').value||30,up=$('upper').checked;
    var names=$('in').value.split(/\\n/).map(function(s){return s.trim();}).filter(Boolean);
    var rows=names.map(function(n){var errs=[];
      var re=up?/^[A-Za-z0-9_]+$/:/^[a-z0-9_]+$/;
      if(!re.test(n))errs.push(up?'영문/숫자/_ 만 허용':'영문 소문자/숫자/_ 만 허용');
      if(/^[0-9]/.test(n))errs.push('숫자로 시작 불가');
      if(n.length>max)errs.push('길이 초과('+n.length+'>'+max+')');
      if(RES.indexOf(n.toLowerCase())>=0)errs.push('예약어');
      if(/[가-힣]/.test(n))errs.push('한글 포함');
      return '<tr><td>'+(errs.length?'❌':'✅')+' '+n+'</td><td style="color:#dc2626">'+errs.join(', ')+'</td></tr>';});
    var ok=names.filter(function(n){var re=up?/^[A-Za-z0-9_]+$/:/^[a-z0-9_]+$/;return re.test(n)&&!/^[0-9]/.test(n)&&n.length<=max&&RES.indexOf(n.toLowerCase())<0&&!/[가-힣]/.test(n);}).length;
    $('res').innerHTML='<div class="ak-rate"><b>'+ok+'/'+names.length+'</b> 통과</div><table>'+rows.join('')+'</table>';}
  ['in','max','upper'].forEach(function(i){$(i).addEventListener('input',run);$(i).addEventListener('change',run);});run();` },

{ key:'commoncode', cat:'데이터', title:'공통코드 정의서',
  desc:'코드그룹·코드값·코드명·설명·사용여부를 정의서로 작성하고 중복 코드값을 점검합니다. DB 표준·코드 관리에.',
  h1:'공통코드 정의서', sub:'공통코드(코드그룹·코드값)를 정의하고 중복을 점검합니다.',
  note:'같은 코드그룹 내 코드값이 중복되면 경고합니다. CSV로 내보내 표준 산출물로 쓰세요. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'commoncode',cols:[
    {k:'grp',label:'코드그룹',w:'100px'},{k:'code',label:'코드값',w:'80px'},{k:'name',label:'코드명',w:'120px'},
    {k:'desc',label:'설명',w:'150px',type:'area'},{k:'sort',label:'정렬',w:'60px',type:'num'},{k:'use',label:'사용',type:'select',opts:['Y','N']}],
    seed:[{grp:'GENDER',code:'M',name:'남성',desc:'',sort:'1',use:'Y'},{grp:'GENDER',code:'F',name:'여성',desc:'',sort:'2',use:'Y'}],
    summary:function(rows){var seen={},dup=[];rows.forEach(function(r){var k=r.grp+'|'+r.code;if(seen[k])dup.push(k);seen[k]=1;});
      return dup.length?'<div class="ak-rate" style="color:#dc2626"><b>중복 '+dup.length+'건</b> <span>'+dup.join(', ')+'</span></div>':'<div class="ak-rate" style="color:#16a34a"><b>중복 없음</b> <span>총 '+rows.length+'건</span></div>';}});` },

{ key:'dataquality', cat:'데이터', title:'데이터 품질진단(CSV)',
  desc:'CSV를 붙여넣으면 열별 완전성(결측률)·유효성(형식)·유일성을 진단하고 품질점수를 산출합니다. 데이터 품질관리에.',
  h1:'데이터 품질진단', sub:'CSV 열별 완전성·유효성·유일성을 진단합니다.',
  note:'완전성=비어있지 않은 비율, 유일성=고유값 비율, 유효성=숫자/날짜 등 일관 형식 비율(추정). 모든 처리는 브라우저에서만 이루어집니다.',
  body:`<textarea class="in" id="in" spellcheck="false">id,name,age,email,join_date
1,김철수,30,kim@test.com,2024-01-15
2,이영희,,lee@test.com,2024-02-20
3,박민수,28,,2024-03-10
4,김철수,abc,choi@test.com,bad-date</textarea><div class="res" id="res" style="margin-top:.6rem;overflow-x:auto"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function parse(t){return t.split(/\\r?\\n/).filter(function(l){return l.trim();}).map(function(l){return l.split(',');});}
  function run(){var rows=parse($('in').value);if(rows.length<2){$('res').innerHTML='헤더+데이터가 필요합니다';return;}
    var head=rows[0],data=rows.slice(1),n=data.length;
    var out='<table><tr><td>열</td><td>완전성</td><td>유일성</td><td>유효성</td></tr>';
    head.forEach(function(h,ci){var vals=data.map(function(r){return (r[ci]||'').trim();});
      var filled=vals.filter(function(v){return v!=='';}).length;
      var uniq=new Set(vals.filter(function(v){return v!=='';})).size;
      var nonEmpty=vals.filter(function(v){return v!=='';});
      var numLike=nonEmpty.filter(function(v){return /^-?\\d+(\\.\\d+)?$/.test(v);}).length;
      var dateLike=nonEmpty.filter(function(v){return /^\\d{4}-\\d{2}-\\d{2}/.test(v);}).length;
      var mailLike=nonEmpty.filter(function(v){return /@/.test(v);}).length;
      var best=Math.max(numLike,dateLike,mailLike);var valid=nonEmpty.length?(best/nonEmpty.length):1;
      var validShow=best>nonEmpty.length*0.5?Math.round(valid*100)+'%':'—';
      out+='<tr><td><b>'+h+'</b></td><td>'+Math.round(filled/n*100)+'%</td><td>'+Math.round(uniq/n*100)+'%</td><td>'+validShow+'</td></tr>';});
    out+='</table>';
    var totalCells=n*head.length,filledCells=0;data.forEach(function(r){head.forEach(function(h,ci){if((r[ci]||'').trim()!=='')filledCells++;});});
    var score=Math.round(filledCells/totalCells*100);
    $('res').innerHTML='<div class="ak-rate"><b>'+score+'%</b> 완전성(전체) <span>· '+n+'행 × '+head.length+'열</span></div>'+out;}
  $('in').addEventListener('input',run);run();` },

{ key:'ddlparse', cat:'데이터', title:'DDL → 테이블정의서 변환', oss:1,
  desc:'CREATE TABLE DDL을 붙여넣으면 컬럼·자료형·NULL여부·키·기본값을 파싱해 테이블정의서로 정리합니다. node-sql-parser 자체 호스팅.',
  h1:'DDL → 테이블정의서', sub:'CREATE TABLE 문을 테이블정의서 표로 변환합니다.',
  note:'오픈소스 <b>node-sql-parser</b>(Apache-2.0, <a href="https://github.com/taozhi8833998/node-sql-parser" target="_blank" rel="noopener">node-sql-parser</a>)를 자체 호스팅합니다(MySQL 문법). 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/sqlparser-4/mysql.umd.js'],
  body:`<textarea class="in" id="in" spellcheck="false">CREATE TABLE user_master (
  user_id    BIGINT NOT NULL AUTO_INCREMENT,
  login_id   VARCHAR(50) NOT NULL,
  user_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(200),
  status     CHAR(1) DEFAULT 'Y',
  reg_dt     DATETIME NOT NULL,
  PRIMARY KEY (user_id)
);</textarea><div class="err" id="err"></div><div class="res" id="res" style="margin-top:.6rem;overflow-x:auto"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function run(){$('err').textContent='';var sql=$('in').value.trim();if(!sql){$('res').innerHTML='';return;}
    try{var parser=new Parser();var ast=parser.astify(sql,{database:'mysql'});if(!Array.isArray(ast))ast=[ast];
      var html='';
      ast.forEach(function(st){if(st.type!=='create'||st.keyword!=='table')return;
        var tbl=(st.table&&st.table[0]&&st.table[0].table)||'(table)';
        var pk=[];(st.create_definitions||[]).forEach(function(d){if(d.constraint_type==='primary key'&&d.definition)d.definition.forEach(function(c){pk.push(c.column);});});
        html+='<h3 style="font-size:.95rem;color:var(--accent);margin:.8rem 0 .3rem">'+tbl+'</h3><table><tr><td>컬럼</td><td>자료형</td><td>NULL</td><td>키</td><td>기본값</td></tr>';
        (st.create_definitions||[]).forEach(function(d){if(d.resource!=='column')return;
          var col=d.column.column;var dt=d.definition.dataType+(d.definition.length?'('+d.definition.length+')':'');
          var nn=(d.nullable&&d.nullable.type==='not null')?'N':'Y';
          var key=pk.indexOf(col)>=0?'PK':'';var def=d.default_val&&d.default_val.value?(d.default_val.value.value!==undefined?d.default_val.value.value:''):'';
          html+='<tr><td><b>'+col+'</b></td><td>'+dt+'</td><td>'+nn+'</td><td>'+key+'</td><td>'+def+'</td></tr>';});
        html+='</table>';});
      $('res').innerHTML=html||'<span class="err">CREATE TABLE 문을 찾지 못했습니다.</span>';
    }catch(e){$('res').innerHTML='';$('err').textContent='⚠️ 파싱 오류: '+e.message;}}
  $('in').addEventListener('input',run);run();` },

/* ===== N5: 요구·테스트·접근성·네트워크 ===== */
{ key:'srs', cat:'감리·검증', title:'요구사항 정의서(SRS)',
  desc:'기능·비기능 요구사항을 ID·유형·우선순위·수용기준과 함께 정의서로 작성하고 CSV로 내보냅니다. 요구사항관리 산출물.',
  h1:'요구사항 정의서 (SRS)', sub:'기능·비기능 요구사항을 표준 항목으로 정의합니다.',
  note:'각 요구사항에 수용기준(검증 가능 조건)을 함께 적으면 시험·검수가 명확해집니다. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'srs',cols:[
    {k:'id',label:'ID',w:'80px'},{k:'cat',label:'구분',type:'select',opts:['기능','성능','보안','품질','인터페이스','제약사항']},
    {k:'name',label:'요구사항명',w:'140px',type:'area'},{k:'detail',label:'상세설명',w:'180px',type:'area'},
    {k:'pri',label:'우선순위',type:'select',opts:['필수','높음','보통','낮음']},{k:'src',label:'출처',w:'90px'},{k:'accept',label:'수용기준',w:'150px',type:'area'}],
    seed:[{id:'SFR-001',cat:'기능',name:'회원 로그인',detail:'ID/PW 기반 인증',pri:'필수',src:'제안요청서',accept:'유효 계정 로그인 성공, 5회 실패 시 잠금'}]});` },

{ key:'reqpriority', cat:'감리·검증', title:'요구사항 우선순위(MoSCoW)',
  desc:'요구사항을 가치·비용·위험으로 평가해 우선순위 점수와 MoSCoW(Must/Should/Could/Won’t) 분류로 정렬합니다.',
  h1:'요구사항 우선순위 결정', sub:'가치·비용·위험을 평가해 우선순위를 산정합니다.',
  note:'우선순위 점수 = 가치 ÷ (비용 보정). MoSCoW로 범위(Scope)를 합의하세요. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'reqpriority',cols:[
    {k:'name',label:'요구사항',w:'160px',type:'area'},
    {k:'value',label:'가치(1-5)',type:'select',opts:['5','4','3','2','1']},
    {k:'cost',label:'비용(1-5)',type:'select',opts:['1','2','3','4','5']},
    {k:'risk',label:'위험(1-5)',type:'select',opts:['1','2','3','4','5']},
    {k:'moscow',label:'MoSCoW',type:'select',opts:['Must','Should','Could','Won\\'t']}],
    seed:[{name:'핵심 결제 기능',value:'5',cost:'3',risk:'2',moscow:'Must'},{name:'테마 변경',value:'2',cost:'1',risk:'1',moscow:'Could'}],
    summary:function(rows){function sc(r){return ((+r.value||0)/((+r.cost||1)*0.6+(+r.risk||1)*0.4)).toFixed(2);}
      var sorted=rows.map(function(r){return r.name+' ('+sc(r)+')';});
      var m={};rows.forEach(function(r){m[r.moscow]=(m[r.moscow]||0)+1;});
      return '<div class="ak-rate"><b>MoSCoW</b> <span>Must '+(m.Must||0)+' · Should '+(m.Should||0)+' · Could '+(m.Could||0)+' · Won\\'t '+(m['Won\\'t']||0)+'</span></div>';}});` },

{ key:'testmetrics', cat:'감리·검증', title:'결함밀도·품질지표 계산기',
  desc:'결함 수·규모(KLOC/FP)·테스트 결과로 결함밀도·통과율·결함제거효율(DRE)·MTBF 등 소프트웨어 품질지표를 계산합니다.',
  h1:'결함밀도·품질지표 계산기', sub:'결함밀도·통과율·결함제거효율(DRE)을 산출합니다.',
  note:'결함밀도 = 결함 ÷ KLOC. DRE = 출시 전 결함 ÷ (출시 전 + 출시 후 결함) × 100. 값이 높을수록 결함을 잘 걸러낸 것입니다.',
  body:`<div class="frm">
    <label>총 결함 수<input type="number" id="def" value="48"></label>
    <label>규모(KLOC)<input type="number" id="kloc" value="12"></label>
    <label>테스트케이스<input type="number" id="tc" value="200"></label>
    <label>통과 수<input type="number" id="pass" value="185"></label>
  </div><div class="frm">
    <label>출시 전 결함<input type="number" id="pre" value="42"></label>
    <label>출시 후 결함<input type="number" id="post" value="6"></label>
    <label>총 가동시간(h)<input type="number" id="uptime" value="720"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function run(){var def=+$('def').value||0,kloc=+$('kloc').value||1,tc=+$('tc').value||0,pass=+$('pass').value||0;
    var pre=+$('pre').value||0,post=+$('post').value||0,up=+$('uptime').value||0;
    var density=def/kloc,passRate=tc?pass/tc*100:0,dre=(pre+post)?pre/(pre+post)*100:0,mtbf=post?up/post:up;
    $('res').innerHTML='<table>'+
    '<tr><td>결함밀도</td><td><b>'+density.toFixed(2)+' 결함/KLOC</b></td></tr>'+
    '<tr><td>테스트 통과율</td><td><b>'+passRate.toFixed(1)+'%</b></td></tr>'+
    '<tr><td>결함제거효율 DRE</td><td><b style="color:'+(dre>=85?'#16a34a':'#d97706')+'">'+dre.toFixed(1)+'%</b></td></tr>'+
    '<tr><td>평균 무고장시간 MTBF</td><td><b>'+mtbf.toFixed(1)+' 시간</b></td></tr></table>';}
  ['def','kloc','tc','pass','pre','post','uptime'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'complexity', cat:'개발자', title:'코드 복잡도(순환복잡도) 분석', oss:1,
  desc:'JavaScript 코드의 함수별 순환복잡도(Cyclomatic Complexity)를 계산합니다. 분기·반복·논리연산 기반. acorn 자체 호스팅.',
  h1:'코드 복잡도 분석', sub:'JavaScript 함수별 순환복잡도를 계산합니다.',
  note:'오픈소스 <b>acorn</b>(MIT) 파서로 AST를 분석합니다. 순환복잡도 10 이하 권장, 20 초과는 리팩터링 대상입니다. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/acorn-8/acorn.js'],
  body:`<textarea class="in" id="in" spellcheck="false">function classify(n) {
  if (n < 0) return 'neg';
  else if (n === 0) return 'zero';
  for (var i = 0; i < n; i++) {
    if (i % 2 === 0 && i > 10) continue;
  }
  return n > 100 ? 'big' : 'small';
}</textarea><div class="err" id="err"></div><div class="res" id="res" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function walk(node,fn){if(!node||typeof node.type!=='string')return;fn(node);for(var k in node){if(k==='type')continue;var v=node[k];if(Array.isArray(v))v.forEach(function(c){if(c&&c.type)walk(c,fn);});else if(v&&v.type)walk(v,fn);}}
  function cc(node){var c=1;walk(node,function(n){if(/IfStatement|ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement|CatchClause|ConditionalExpression/.test(n.type))c++;else if(n.type==='SwitchCase'&&n.test)c++;else if(n.type==='LogicalExpression'&&(n.operator==='&&'||n.operator==='||'))c++;});return c;}
  function run(){$('err').textContent='';try{var ast=acorn.parse($('in').value,{ecmaVersion:'latest'});var fns=[];
    walk(ast,function(n){if(/FunctionDeclaration|FunctionExpression|ArrowFunctionExpression/.test(n.type)){var name=(n.id&&n.id.name)||'(익명)';fns.push({name:name,cc:cc(n)});}});
    if(!fns.length){fns.push({name:'(전체)',cc:cc(ast)});}
    var rows=fns.map(function(f){var col=f.cc<=10?'#16a34a':f.cc<=20?'#d97706':'#dc2626';return '<tr><td><b>'+f.name+'</b></td><td><b style="color:'+col+'">'+f.cc+'</b> '+(f.cc<=10?'양호':f.cc<=20?'주의':'위험')+'</td></tr>';}).join('');
    var max=Math.max.apply(null,fns.map(function(f){return f.cc;}));
    $('res').innerHTML='<div class="ak-rate"><b>최대 '+max+'</b> <span>· 함수 '+fns.length+'개</span></div><table>'+rows+'</table>';
  }catch(e){$('res').innerHTML='';$('err').textContent='⚠️ 파싱 오류: '+e.message;}}
  $('in').addEventListener('input',run);run();` },

{ key:'ifspec', cat:'감리·검증', title:'인터페이스(I/F) 정의서',
  desc:'연계 인터페이스의 송수신 시스템·연계방식·주기·데이터형식·보안을 정의서로 작성합니다. 아키텍처·연계 설계 산출물.',
  h1:'인터페이스(I/F) 정의서', sub:'시스템 간 연계 인터페이스 명세를 정리합니다.',
  note:'연계방식(EAI/ESB/API/FEP/파일)·주기·전문형식·보안(암호화·인증)을 명확히 하세요. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'ifspec',cols:[
    {k:'id',label:'I/F ID',w:'80px'},{k:'name',label:'인터페이스명',w:'130px',type:'area'},
    {k:'from',label:'송신',w:'90px'},{k:'to',label:'수신',w:'90px'},
    {k:'method',label:'연계방식',type:'select',opts:['API(REST)','API(SOAP)','EAI/ESB','FEP','파일(FTP)','DB링크','메시지큐']},
    {k:'cycle',label:'주기',type:'select',opts:['실시간','준실시간','시간','일','주','월','수시']},
    {k:'format',label:'데이터형식',type:'select',opts:['JSON','XML','고정길이','CSV','기타']},{k:'sec',label:'보안',w:'90px',type:'area'}],
    seed:[{id:'IF-001',name:'회원정보 연계',from:'포털',to:'CRM',method:'API(REST)',cycle:'실시간',format:'JSON',sec:'TLS, API Key'}]});` },

{ key:'kwcag', cat:'감리·검증', title:'웹 접근성(KWCAG 2.2) 자가점검',
  desc:'한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2의 4개 원칙(인식·운용·이해·견고성) 검사항목을 자가점검하고 충족률을 집계합니다.',
  h1:'웹 접근성(KWCAG 2.2) 자가점검', sub:'4대 원칙별 접근성 검사항목을 점검합니다.',
  note:'KWCAG 2.2 검사항목 기준입니다. 전자정부 웹사이트 품질관리·인증 준비에 활용하세요. 자동 점검은 마크업 점검 도구를 함께 사용하세요.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'kwcag',groups:[
    {title:'1. 인식의 용이성',items:['이미지 등에 대체 텍스트 제공','동영상 자막/원고/수어 제공','표의 구성(제목·요약) 제공','콘텐츠 논리적 순서·명확한 지시','색에만 의존하지 않는 정보 전달','자동 재생 음성 제어','텍스트 명도대비 4.5:1 이상','자동 변경 콘텐츠(움직임) 제어']},
    {title:'2. 운용의 용이성',items:['모든 기능 키보드 사용 가능','초점 이동 시 함정 없음','시간 제한 조절 가능','깜빡임(3회/초) 제한','반복 영역 건너뛰기 링크','페이지 제목 제공','적절한 링크 텍스트','단일 포인터/동작 대체 수단']},
    {title:'3. 이해의 용이성',items:['기본 언어(lang) 명시','사용자 의도와 다른 기능 실행 금지','온라인 서식 레이블 제공','오류 정정·안내 제공','명령어 입력 도움 제공']},
    {title:'4. 견고성',items:['마크업 문법 준수(중복 id 등 없음)','웹 애플리케이션 접근성(ARIA) 준수']}]});` },

{ key:'a11ycheck', cat:'개발자', title:'웹 접근성 자동 점검(axe)', oss:1,
  desc:'HTML을 붙여넣으면 axe-core 엔진으로 접근성 위반(대체텍스트·레이블·명도대비·ARIA 등)을 자동 진단합니다. 마크업 품질 점검.',
  h1:'웹 접근성 자동 점검', sub:'HTML의 접근성 위반을 axe 엔진으로 자동 진단합니다.',
  note:'오픈소스 <b>axe-core</b>(MPL-2.0, Deque, <a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noopener">dequelabs/axe-core</a>)를 자체 호스팅합니다. 자동 점검은 일부 항목만 커버하므로 수동 점검(KWCAG)과 병행하세요. 모든 처리는 브라우저에서만 이루어집니다.',
  libs:['/vendor/axe-4/axe.min.js'],
  body:`<textarea class="in" id="in" spellcheck="false">&lt;img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="&gt;
&lt;button&gt;&lt;/button&gt;
&lt;input type="text"&gt;
&lt;a href="#"&gt;여기&lt;/a&gt;
&lt;p style="color:#bbb;background:#ccc"&gt;저대비 텍스트&lt;/p&gt;</textarea><div class="frm" style="margin-top:.5rem"><button class="btn" id="run" type="button">점검 실행</button></div><div class="err" id="err"></div><div class="res" id="res"></div><div id="sandbox" style="position:absolute;left:-99999px;top:0;width:820px;"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function run(){$('err').textContent='';$('res').innerHTML='점검 중…';
    var sb=$('sandbox');sb.innerHTML=$('in').value;
    try{ axe.run(sb,{resultTypes:['violations']},function(err,res){
      sb.innerHTML='';
      if(err){$('res').innerHTML='';$('err').textContent='⚠️ '+err.message;return;}
      var v=res.violations;if(!v.length){$('res').innerHTML='<span style="color:#16a34a">위반이 발견되지 않았습니다(자동 점검 범위 내).</span>';return;}
      var imp={critical:'#9333ea',serious:'#dc2626',moderate:'#d97706',minor:'#0891b2'};
      $('res').innerHTML='<div class="ak-rate"><b>'+v.length+'종</b> 위반</div>'+v.map(function(x){return '<div style="border-bottom:1px solid var(--border);padding:.5rem 0"><b style="color:'+(imp[x.impact]||'#666')+'">['+(x.impact||'')+']</b> '+x.help+' <span style="color:var(--muted)">('+x.nodes.length+'곳)</span></div>';}).join('');
    }); }catch(e){$('res').innerHTML='';$('err').textContent='⚠️ '+e.message;}}
  $('run').addEventListener('click',run);setTimeout(run,400);` },

{ key:'ipplan', cat:'개발자', title:'IP 주소계획·서브넷 분할',
  desc:'기준 네트워크(CIDR)를 지정한 개수로 균등 분할하여 서브넷별 네트워크·호스트 범위·브로드캐스트를 계획표로 만듭니다.',
  h1:'IP 주소계획·서브넷 분할', sub:'네트워크를 N개 서브넷으로 분할해 주소계획을 만듭니다.',
  note:'기준 CIDR을 2의 거듭제곱 개수로 균등 분할(FLSM)합니다. 모든 계산은 브라우저에서만 이루어집니다.',
  body:`<div class="frm">
    <label>기준 네트워크<input type="text" id="net" value="192.168.0.0" style="width:140px"></label>
    <label>/<input type="number" id="pfx" value="24" min="0" max="30" style="width:70px"></label>
    <label>서브넷 수<select id="cnt"><option>2</option><option>4</option><option>8</option><option>16</option><option>32</option></select></label>
  </div><div class="err" id="err"></div><div class="res" id="res" style="overflow-x:auto"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function toInt(ip){var p=ip.split('.');if(p.length!==4)return null;var n=0;for(var i=0;i<4;i++){var x=+p[i];if(isNaN(x)||x<0||x>255)return null;n=n*256+x;}return n>>>0;}
  function toIp(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');}
  function run(){$('err').textContent='';var base=toInt($('net').value.trim()),pfx=+$('pfx').value,cnt=+$('cnt').value;
    if(base===null){$('err').textContent='올바른 IP를 입력하세요';$('res').innerHTML='';return;}
    var bits=Math.log2(cnt),newPfx=pfx+bits;if(newPfx>30){$('err').textContent='분할이 너무 많습니다(/'+newPfx+')';$('res').innerHTML='';return;}
    var size=Math.pow(2,32-newPfx),mask=(0xFFFFFFFF<<(32-newPfx))>>>0,netBase=(base&((0xFFFFFFFF<<(32-pfx))>>>0))>>>0;
    var rows='';for(var i=0;i<cnt;i++){var nw=(netBase+i*size)>>>0,bc=(nw+size-1)>>>0;
      rows+='<tr><td>'+(i+1)+'</td><td><b>'+toIp(nw)+'/'+newPfx+'</b></td><td>'+toIp(nw+1)+' ~ '+toIp(bc-1)+'</td><td>'+toIp(bc)+'</td><td>'+(size>2?size-2:size)+'</td></tr>';}
    $('res').innerHTML='<div class="ak-rate"><b>/'+newPfx+'</b> <span>· 서브넷당 호스트 '+(size>2?size-2:size)+'개 · 마스크 '+toIp(mask)+'</span></div><table><tr><td>#</td><td>네트워크</td><td>호스트 범위</td><td>브로드캐스트</td><td>호스트수</td></tr>'+rows+'</table>';}
  ['net','pfx','cnt'].forEach(function(i){$(i).addEventListener('input',run);$(i).addEventListener('change',run);});run();` },

{ key:'fwpolicy', cat:'개발자', title:'방화벽 정책 정의표',
  desc:'출발지·목적지·포트·프로토콜·허용여부로 방화벽 정책을 정의표로 작성하고 중복/광범위(any) 정책을 점검합니다.',
  h1:'방화벽 정책 정의표', sub:'방화벽 정책을 정리하고 중복·과도한 허용을 점검합니다.',
  note:'출발지·목적지·포트가 모두 any인 허용 정책은 보안 위험으로 표시됩니다. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'fwpolicy',cols:[
    {k:'no',label:'순번',w:'50px',type:'num'},{k:'src',label:'출발지',w:'110px'},{k:'dst',label:'목적지',w:'110px'},
    {k:'port',label:'포트',w:'80px'},{k:'proto',label:'프로토콜',type:'select',opts:['TCP','UDP','ICMP','ANY']},
    {k:'action',label:'정책',type:'select',opts:['허용','차단']},{k:'desc',label:'용도',w:'120px',type:'area'}],
    seed:[{no:'1',src:'192.168.1.0/24',dst:'10.0.0.10',port:'443',proto:'TCP',action:'허용',desc:'웹서버 접근'}],
    summary:function(rows){var allow=rows.filter(function(r){return r.action==='허용';}).length;
      var risky=rows.filter(function(r){return r.action==='허용'&&/any/i.test(r.src)&&/any/i.test(r.dst)&&(/any/i.test(r.port)||!r.port);}).length;
      return '<div class="ak-rate"><b>'+rows.length+'건</b> <span>· 허용 '+allow+' · 차단 '+(rows.length-allow)+(risky?' · <span style="color:#dc2626">⚠️ 과도한 허용(any) '+risky+'건</span>':'')+'</span></div>';}});` },

{ key:'perfanalyze', cat:'감리·검증', title:'성능시험 결과 분석기',
  desc:'응답시간(ms) 목록을 붙여넣으면 평균·최소·최대·표준편차·백분위수(p50/p90/p95/p99)·추정 TPS를 분석합니다. 성능시험 결과 정리에.',
  h1:'성능시험 결과 분석', sub:'응답시간 데이터로 백분위수·TPS 등 성능 지표를 분석합니다.',
  note:'한 줄에 응답시간(ms) 하나씩 붙여넣으세요. p95/p99는 SLA 판정에 중요합니다. 모든 처리는 브라우저에서만 이루어집니다.',
  body:`<textarea class="in" id="in" spellcheck="false">120
135
98
210
156
142
880
175
130
145
160
2200
118</textarea><div class="res" id="res" style="margin-top:.6rem"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function pct(a,p){if(!a.length)return 0;var idx=Math.ceil(p/100*a.length)-1;return a[Math.max(0,Math.min(a.length-1,idx))];}
  function run(){var v=$('in').value.split(/[\\s,]+/).map(Number).filter(function(x){return !isNaN(x);});
    if(!v.length){$('res').innerHTML='데이터를 입력하세요';return;}
    var s=v.slice().sort(function(a,b){return a-b;});var n=v.length,sum=v.reduce(function(a,b){return a+b;},0),avg=sum/n;
    var sd=Math.sqrt(v.reduce(function(a,b){return a+(b-avg)*(b-avg);},0)/n);
    var tps=avg>0?1000/avg:0;
    $('res').innerHTML='<div class="big">p95 '+pct(s,95)+' ms</div><table>'+
    '<tr><td>샘플 수</td><td><b>'+n+'</b></td></tr>'+
    '<tr><td>평균</td><td><b>'+avg.toFixed(1)+' ms</b></td></tr>'+
    '<tr><td>최소 / 최대</td><td><b>'+s[0]+' / '+s[n-1]+' ms</b></td></tr>'+
    '<tr><td>표준편차</td><td><b>'+sd.toFixed(1)+' ms</b></td></tr>'+
    '<tr><td>p50 (중앙값)</td><td><b>'+pct(s,50)+' ms</b></td></tr>'+
    '<tr><td>p90</td><td><b>'+pct(s,90)+' ms</b></td></tr>'+
    '<tr><td>p95</td><td><b>'+pct(s,95)+' ms</b></td></tr>'+
    '<tr><td>p99</td><td><b>'+pct(s,99)+' ms</b></td></tr>'+
    '<tr><td>추정 처리량(1스레드)</td><td><b>'+tps.toFixed(1)+' TPS</b></td></tr></table>';}
  $('in').addEventListener('input',run);run();` }

];
