// 감리·점검 전문가 도구 사양 — genaudit.mjs 가 읽어 HTML 생성
export const SPECS = [

/* ===== N1: 감리·검증 관리대장/체크리스트 (audit-kit) ===== */
{ key:'rtm', cat:'감리·검증', title:'요구사항 추적표(RTM) 생성기',
  desc:'요구사항-설계-구현-시험 추적성 매트릭스(RTM)를 작성하고 CSV로 내보냅니다. 정보시스템 감리·요구사항관리에. 입력값은 브라우저에만 저장됩니다.',
  h1:'요구사항 추적표 (RTM)', sub:'요구사항이 설계·구현·시험까지 빠짐없이 연결됐는지 추적합니다.',
  note:'입력 내용은 이 브라우저에만 저장됩니다(전송 없음). 시험케이스가 비면 추적 누락으로 점검하세요.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'rtm',cols:[
    {k:'rid',label:'요구사항 ID',w:'90px'},{k:'name',label:'요구사항명',w:'150px',type:'area'},
    {k:'type',label:'유형',type:'select',opts:['기능','비기능','데이터','인터페이스','보안']},
    {k:'pri',label:'중요도',type:'select',opts:['상','중','하']},
    {k:'design',label:'설계서',w:'110px',type:'area'},{k:'impl',label:'구현',w:'110px',type:'area'},
    {k:'tc',label:'시험케이스',w:'90px'},{k:'status',label:'상태',type:'select',opts:['미착수','진행','완료','보류']}],
    seed:[{rid:'REQ-001',name:'로그인 기능',type:'기능',pri:'상',design:'화면설계서 3.1',impl:'LoginCtrl',tc:'TC-001',status:'완료'},{rid:'REQ-002',name:'응답시간 2초 이내',type:'비기능',pri:'중',design:'아키텍처 4.2',impl:'',tc:'',status:'진행'}],
    summary:function(rows){var n=rows.length,done=rows.filter(function(r){return r.status==='완료';}).length,miss=rows.filter(function(r){return !r.tc;}).length;return '<div class="ak-rate"><b>'+(n?Math.round(done/n*100):0)+'%</b> 완료 <span>('+done+'/'+n+') · 시험케이스 미연결 '+miss+'건</span></div><div class="ak-bar2"><i style="width:'+(n?done/n*100:0)+'%"></i></div>';}});` },

{ key:'riskreg', cat:'감리·검증', title:'위험·이슈 관리대장',
  desc:'프로젝트 위험·이슈를 식별하고 영향도·발생가능성·대응방안·상태를 관리합니다. 감리·PM 산출물. 입력값은 브라우저에만 저장됩니다.',
  h1:'위험·이슈 관리대장', sub:'위험과 이슈를 식별·평가하고 대응 상태를 추적합니다.',
  note:'영향도·발생가능성이 모두 ‘상’이면 최우선 대응 대상입니다. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'riskreg',cols:[
    {k:'id',label:'ID',w:'70px'},{k:'kind',label:'구분',type:'select',opts:['위험','이슈']},
    {k:'content',label:'내용',w:'180px',type:'area'},
    {k:'impact',label:'영향도',type:'select',opts:['상','중','하']},{k:'prob',label:'발생가능성',type:'select',opts:['상','중','하']},
    {k:'plan',label:'대응방안',w:'160px',type:'area'},{k:'owner',label:'담당',w:'70px'},
    {k:'status',label:'상태',type:'select',opts:['식별','대응중','해결','종료']}],
    seed:[{id:'R-01',kind:'위험',content:'요구사항 변경 빈번',impact:'상',prob:'중',plan:'변경관리 절차 강화',owner:'PM',status:'대응중'}],
    summary:function(rows){var open=rows.filter(function(r){return r.status!=='해결'&&r.status!=='종료';}).length,hi=rows.filter(function(r){return r.impact==='상'&&r.prob==='상';}).length;return '<div class="ak-rate"><b>'+open+'건</b> 미해결 <span>· 고위험(영향·가능성 모두 상) '+hi+'건 / 전체 '+rows.length+'건</span></div>';}});` },

{ key:'raci', cat:'감리·검증', title:'RACI 책임배분 매트릭스',
  desc:'작업·산출물별 담당자의 R(실무)·A(승인)·C(협의)·I(통보) 책임을 배분합니다. PM·감리 산출물. 입력값은 브라우저에만 저장됩니다.',
  h1:'RACI 책임배분 매트릭스', sub:'작업별 책임(R·A·C·I)을 명확히 배분합니다.',
  note:'각 작업에는 A(승인책임)가 정확히 1명이어야 합니다. R은 실무수행, C는 협의, I는 통보 대상입니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'raci',cols:[
    {k:'task',label:'작업/산출물',w:'180px',type:'area'},
    {k:'r',label:'R 실무',w:'90px'},{k:'a',label:'A 승인',w:'90px'},{k:'c',label:'C 협의',w:'90px'},{k:'i',label:'I 통보',w:'90px'}],
    seed:[{task:'요구사항 정의',r:'분석가',a:'PM',c:'현업',i:'스폰서'},{task:'아키텍처 설계',r:'아키텍트',a:'PM',c:'개발팀',i:'감리'}]});` },

{ key:'stakeholder', cat:'감리·검증', title:'이해관계자 등록부',
  desc:'이해관계자를 식별하고 관심도·영향력·기대사항·대응전략을 관리합니다(관심도-영향력 매트릭스). PM·감리 산출물.',
  h1:'이해관계자 등록부', sub:'이해관계자를 식별하고 관심도·영향력에 따라 관리 전략을 세웁니다.',
  note:'관심도·영향력이 모두 높은 이해관계자는 “긴밀히 관리”, 영향력만 높으면 “만족 유지” 전략이 권장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'stakeholder',cols:[
    {k:'name',label:'이해관계자',w:'100px'},{k:'org',label:'소속/역할',w:'110px'},
    {k:'interest',label:'관심도',type:'select',opts:['상','중','하']},{k:'power',label:'영향력',type:'select',opts:['상','중','하']},
    {k:'expect',label:'기대사항',w:'150px',type:'area'},{k:'strategy',label:'대응전략',w:'150px',type:'area'},{k:'owner',label:'담당',w:'70px'}],
    seed:[{name:'발주부서장',org:'주관기관',interest:'상',power:'상',expect:'일정 준수·품질',strategy:'주간보고·긴밀 관리',owner:'PM'}]});` },

{ key:'changereq', cat:'감리·검증', title:'변경요청(CR) 관리대장',
  desc:'변경요청을 접수·영향분석·승인·반영까지 이력으로 관리합니다. 형상·변경관리 산출물. 입력값은 브라우저에만 저장됩니다.',
  h1:'변경요청(CR) 관리대장', sub:'변경요청의 접수부터 반영까지 통제·기록합니다.',
  note:'승인 전 영향분석(일정·비용·범위)을 반드시 기록하세요. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'changereq',cols:[
    {k:'no',label:'CR번호',w:'80px'},{k:'date',label:'요청일',type:'date'},{k:'req',label:'요청자',w:'80px'},
    {k:'content',label:'변경내용',w:'170px',type:'area'},{k:'impact',label:'영향분석',w:'150px',type:'area'},
    {k:'pri',label:'우선순위',type:'select',opts:['긴급','높음','보통','낮음']},
    {k:'status',label:'상태',type:'select',opts:['접수','검토','승인','반려','완료']},{k:'done',label:'반영일',type:'date'}],
    seed:[{no:'CR-001',date:'',req:'현업',content:'조회조건 추가',impact:'화면 1건 수정, 일정 영향 없음',pri:'보통',status:'검토',done:''}],
    summary:function(rows){var ap=rows.filter(function(r){return r.status==='승인'||r.status==='완료';}).length,pend=rows.filter(function(r){return r.status==='접수'||r.status==='검토';}).length;return '<div class="ak-rate"><b>'+rows.length+'건</b> <span>· 승인/완료 '+ap+' · 처리대기 '+pend+'</span></div>';}});` },

{ key:'testcase', cat:'감리·검증', title:'테스트케이스·결함 관리대장',
  desc:'테스트케이스를 작성하고 수행 결과·결함을 기록합니다. 수행률·통과율 자동 집계. 테스트·품질 산출물. 입력값은 브라우저에만 저장됩니다.',
  h1:'테스트케이스·결함 관리대장', sub:'테스트케이스와 결함을 기록하고 수행률·통과율을 집계합니다.',
  note:'결과가 Fail이면 결함ID를 연결하세요. 수행률·통과율이 자동 계산됩니다. 데이터는 브라우저에만 저장됩니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.register({mount:'#app',key:'testcase',cols:[
    {k:'id',label:'TC-ID',w:'80px'},{k:'mod',label:'기능/모듈',w:'100px'},{k:'scenario',label:'시나리오',w:'160px',type:'area'},
    {k:'input',label:'입력/조건',w:'120px',type:'area'},{k:'expect',label:'기대결과',w:'130px',type:'area'},
    {k:'result',label:'결과',type:'select',opts:['미수행','Pass','Fail','Block','N/A']},{k:'defect',label:'결함ID',w:'80px'},{k:'note',label:'비고',w:'90px',type:'area'}],
    seed:[{id:'TC-001',mod:'로그인',scenario:'정상 로그인',input:'유효 ID/PW',expect:'메인 이동',result:'Pass',defect:'',note:''},{id:'TC-002',mod:'로그인',scenario:'비번 오류',input:'틀린 PW',expect:'오류 메시지',result:'Fail',defect:'BUG-12',note:''}],
    summary:function(rows){var n=rows.length,run=rows.filter(function(r){return r.result&&r.result!=='미수행';}).length,pass=rows.filter(function(r){return r.result==='Pass';}).length,fail=rows.filter(function(r){return r.result==='Fail';}).length;var pr=(pass+fail)>0?Math.round(pass/(pass+fail)*100):0;return '<div class="ak-rate"><b>'+pr+'%</b> 통과율 <span>· 수행 '+run+'/'+n+' · Pass '+pass+' · Fail '+fail+'</span></div><div class="ak-bar2"><i style="width:'+pr+'%"></i></div>';}});` },

{ key:'deliverable', cat:'감리·검증', title:'단계별 산출물 점검 체크리스트',
  desc:'분석·설계·구현·시험·종료 단계별 산출물 완성도를 점검하고 충족률을 집계합니다. 정보시스템 감리 점검표.',
  h1:'단계별 산출물 점검 체크리스트', sub:'개발 단계별 산출물이 빠짐없이 작성·검토됐는지 점검합니다.',
  note:'충족/미충족/해당없음으로 표시하면 단계별 충족률이 집계됩니다. CSV로 감리 보고서에 첨부하세요.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'deliverable',groups:[
    {title:'분석 단계',items:['요구사항정의서 작성·승인','현행시스템 분석서','업무흐름도/프로세스 정의','요구사항 추적표(RTM) 초안','분석단계 검토(동료/감리)']},
    {title:'설계 단계',items:['화면설계서','DB설계서(ERD·테이블정의서)','인터페이스 정의서','프로그램 목록','아키텍처 설계서','보안설계 반영','설계단계 검토']},
    {title:'구현 단계',items:['소스코드 작성·코딩표준 준수','단위시험 수행·기록','형상관리(버전) 적용','시큐어코딩 점검','개발자 테스트 완료']},
    {title:'시험 단계',items:['통합시험계획서','테스트케이스·결함관리','성능시험 결과','사용자 인수시험(UAT)','시험단계 검토']},
    {title:'종료/이행',items:['운영자/사용자 매뉴얼','데이터 이행계획·검증','교육 수행','검수조서','하자보수 계획']}]});` },

{ key:'archcheck', cat:'감리·검증', title:'아키텍처 점검 체크리스트',
  desc:'시스템 아키텍처의 가용성·확장성·성능·보안·표준·운영 적정성을 점검합니다. 감리·기술검토 산출물.',
  h1:'아키텍처 점검 체크리스트', sub:'시스템 구조가 가용성·확장성·보안 등 비기능 요건을 충족하는지 점검합니다.',
  note:'정보시스템 감리·기술검토 시 활용하세요. 충족률이 자동 집계되며 CSV로 내보낼 수 있습니다.',
  libs:['audit-kit.js'],
  script:`AuditKit.checklist({mount:'#app',key:'archcheck',groups:[
    {title:'가용성/신뢰성',items:['서버/네트워크/DB 이중화','장애 감지·자동 전환(Failover)','백업·복구 절차 수립·검증','단일장애점(SPOF) 제거']},
    {title:'확장성/성능',items:['수평/수직 확장 가능 설계','부하분산(L4/L7) 적용','캐시·CDN 전략','성능 목표(응답시간·TPS) 정의·검증']},
    {title:'보안',items:['망분리/구간 암호화(TLS)','인증·권한(접근통제) 설계','로그·감사추적 기록','개인정보/중요정보 보호 설계']},
    {title:'표준/구조',items:['전자정부 표준프레임워크/계층 준수','인터페이스 표준화','공통모듈 재사용','개발/스테이징/운영 환경 분리']},
    {title:'운영',items:['모니터링·알림 체계','배포/형상관리 자동화','용량 산정·증설 계획','운영 매뉴얼/Runbook']}]});` },

/* ===== N2: 계산기 (감리·검증) ===== */
{ key:'evm', cat:'감리·검증', title:'획득가치(EVM) 계산기',
  desc:'PV·EV·AC로 SPI·CPI·SV·CV·EAC·ETC·VAC를 계산해 일정·원가 성과를 분석합니다. PMP·감리 진척관리.',
  h1:'획득가치(EVM) 계산기', sub:'계획가치·획득가치·실제원가로 일정·원가 성과지표를 산출합니다.',
  note:'SPI/CPI ≥ 1 이면 일정/원가 양호, < 1 이면 지연/초과입니다. EAC는 현재 효율(CPI) 유지 가정의 최종 예상원가입니다.',
  body:`<div class="frm">
    <label>BAC 총예산<input type="number" id="bac" value="100000000"></label>
    <label>PV 계획가치<input type="number" id="pv" value="40000000"></label>
    <label>EV 획득가치<input type="number" id="ev" value="35000000"></label>
    <label>AC 실제원가<input type="number" id="ac" value="42000000"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};function f(n){return (Math.round(n)).toLocaleString();}
  function run(){var bac=+$('bac').value,pv=+$('pv').value,ev=+$('ev').value,ac=+$('ac').value;
    var sv=ev-pv,cv=ev-ac,spi=pv?ev/pv:0,cpi=ac?ev/ac:0,eac=cpi?bac/cpi:0,etc=eac-ac,vac=bac-eac,pc=bac?ev/bac*100:0;
    function badge(v){return '<b style="color:'+(v>=1?'#16a34a':'#dc2626')+'">'+v.toFixed(2)+'</b>';}
    $('res').innerHTML='<table>'+
    '<tr><td>진척률 (EV/BAC)</td><td><b>'+pc.toFixed(1)+'%</b></td></tr>'+
    '<tr><td>일정차이 SV (EV−PV)</td><td><b style="color:'+(sv>=0?'#16a34a':'#dc2626')+'">'+f(sv)+'</b></td></tr>'+
    '<tr><td>원가차이 CV (EV−AC)</td><td><b style="color:'+(cv>=0?'#16a34a':'#dc2626')+'">'+f(cv)+'</b></td></tr>'+
    '<tr><td>일정성과지수 SPI</td><td>'+badge(spi)+'</td></tr>'+
    '<tr><td>원가성과지수 CPI</td><td>'+badge(cpi)+'</td></tr>'+
    '<tr><td>완료시점 예상원가 EAC</td><td><b>'+f(eac)+'</b></td></tr>'+
    '<tr><td>잔여 예상원가 ETC</td><td><b>'+f(etc)+'</b></td></tr>'+
    '<tr><td>완료시점 차이 VAC (BAC−EAC)</td><td><b style="color:'+(vac>=0?'#16a34a':'#dc2626')+'">'+f(vac)+'</b></td></tr>'+
    '</table>';}
  ['bac','pv','ev','ac'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'fp', cat:'감리·검증', title:'기능점수(FP) 간이 산정기',
  desc:'데이터·트랜잭션 기능 수로 간이기능점수(평균복잡도)를 산정합니다. SW 규모·대가 산정 기초. 감리·발주.',
  h1:'기능점수(FP) 간이 산정', sub:'데이터·트랜잭션 기능 개수로 미보정 기능점수(UFP)를 추정합니다.',
  note:'간이법(평균복잡도) 가중치: 내부논리파일 7.5 · 외부연계파일 5.4 · 외부입력 4.0 · 외부출력 5.2 · 외부조회 3.9. 실제 대가산정은 보정계수가 필요합니다.',
  body:`<div class="frm">
    <label>내부논리파일(ILF)<input type="number" id="ilf" value="8"></label>
    <label>외부연계파일(EIF)<input type="number" id="eif" value="3"></label>
    <label>외부입력(EI)<input type="number" id="ei" value="20"></label>
    <label>외부출력(EO)<input type="number" id="eo" value="12"></label>
    <label>외부조회(EQ)<input type="number" id="eq" value="15"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};var W={ilf:7.5,eif:5.4,ei:4.0,eo:5.2,eq:3.9};
  function run(){var t=0,rows='';[['ilf','내부논리파일 ILF'],['eif','외부연계파일 EIF'],['ei','외부입력 EI'],['eo','외부출력 EO'],['eq','외부조회 EQ']].forEach(function(x){var c=+$(x[0]).value||0,fp=c*W[x[0]];t+=fp;rows+='<tr><td>'+x[1]+' ('+c+'×'+W[x[0]]+')</td><td><b>'+fp.toFixed(1)+'</b></td></tr>';});
    $('res').innerHTML='<div class="big">UFP '+t.toFixed(1)+' FP</div><table>'+rows+'</table>';}
  ['ilf','eif','ei','eo','eq'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'swcost', cat:'감리·검증', title:'SW 사업대가·투입공수 계산기',
  desc:'기능점수와 FP단가·보정계수로 SW 개발원가를, 생산성으로 투입공수(MM)를 추정합니다. 발주·감리 참고.',
  h1:'SW 사업대가·투입공수(MM)', sub:'기능점수 기반 개발원가와 투입 인월(MM)을 추정합니다.',
  note:'FP단가는 예시 기본값이며 매년 고시되는 ‘SW사업 대가산정 가이드’ 값으로 바꿔 쓰세요. 보정계수(규모·연계·성능 등)는 사업 특성에 맞게 조정합니다. 참고용 추정입니다.',
  body:`<div class="frm">
    <label>기능점수(FP)<input type="number" id="fp" value="500"></label>
    <label>FP 단가(원)<input type="number" id="rate" value="553000"></label>
    <label>보정계수<input type="number" id="adj" value="1.0" step="0.05"></label>
    <label>생산성(FP/MM)<input type="number" id="prod" value="20"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};function f(n){return Math.round(n).toLocaleString();}
  function run(){var fp=+$('fp').value||0,rate=+$('rate').value||0,adj=+$('adj').value||1,prod=+$('prod').value||1;
    var cost=fp*rate*adj,mm=fp/prod;
    $('res').innerHTML='<div class="big">'+f(cost)+' 원</div><table>'+
    '<tr><td>개발원가 (FP×단가×보정)</td><td><b>'+f(cost)+' 원</b></td></tr>'+
    '<tr><td>투입공수 (FP÷생산성)</td><td><b>'+mm.toFixed(1)+' MM</b></td></tr>'+
    '<tr><td>FP당 원가</td><td><b>'+f(rate*adj)+' 원</b></td></tr></table>';}
  ['fp','rate','adj','prod'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'roi', cat:'감리·검증', title:'정보화 ROI·TCO 계산기',
  desc:'투자비와 연간 효과·운영비로 ROI·순효과·회수기간(Payback)·총소유비용(TCO)을 계산합니다. 사업타당성 검토.',
  h1:'정보화 ROI·TCO 계산기', sub:'투자 대비 효과(ROI)와 총소유비용(TCO), 투자 회수기간을 산출합니다.',
  note:'ROI = (누적 순효과 ÷ 총비용) × 100. 회수기간은 연간 순효과로 초기 투자비를 회수하는 데 걸리는 기간입니다. 참고용 추정입니다.',
  body:`<div class="frm">
    <label>초기 투자비(원)<input type="number" id="inv" value="500000000"></label>
    <label>연간 운영비(원)<input type="number" id="op" value="50000000"></label>
    <label>연간 효과(원)<input type="number" id="ben" value="200000000"></label>
    <label>분석기간(년)<input type="number" id="yr" value="5"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};function f(n){return Math.round(n).toLocaleString();}
  function run(){var inv=+$('inv').value||0,op=+$('op').value||0,ben=+$('ben').value||0,yr=+$('yr').value||1;
    var tco=inv+op*yr,totalBen=ben*yr,net=totalBen-tco,roi=tco?net/tco*100:0,annualNet=ben-op,payback=annualNet>0?inv/annualNet:Infinity;
    $('res').innerHTML='<div class="big" style="color:'+(roi>=0?'var(--accent)':'#dc2626')+'">ROI '+roi.toFixed(1)+'%</div><table>'+
    '<tr><td>총소유비용 TCO ('+yr+'년)</td><td><b>'+f(tco)+' 원</b></td></tr>'+
    '<tr><td>누적 효과</td><td><b>'+f(totalBen)+' 원</b></td></tr>'+
    '<tr><td>순효과 (효과−비용)</td><td><b style="color:'+(net>=0?'#16a34a':'#dc2626')+'">'+f(net)+' 원</b></td></tr>'+
    '<tr><td>연간 순효과</td><td><b>'+f(annualNet)+' 원</b></td></tr>'+
    '<tr><td>투자 회수기간</td><td><b>'+(isFinite(payback)?payback.toFixed(1)+' 년':'회수 불가')+'</b></td></tr></table>';}
  ['inv','op','ben','yr'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'sla', cat:'감리·검증', title:'가용성(SLA) 다운타임 계산기',
  desc:'목표 가용성(%)에 따른 연·월·주간 허용 다운타임을 계산하고, 반대로 다운타임으로 가용성을 역산합니다. SLA 협의·운영.',
  h1:'가용성(SLA) 계산기', sub:'목표 가용성(9의 개수)에 따른 허용 다운타임을 계산합니다.',
  note:'예: 99.9%(쓰리나인)는 연 8시간 45분, 99.99%(포나인)는 연 52분의 다운타임이 허용됩니다.',
  body:`<div class="frm">
    <label>목표 가용성(%)<input type="number" id="av" value="99.9" step="0.001"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function dur(min){if(min<1)return Math.round(min*60)+'초';if(min<60)return min.toFixed(1)+'분';if(min<1440)return (min/60).toFixed(1)+'시간';return (min/1440).toFixed(2)+'일';}
  function run(){var av=+$('av').value;if(isNaN(av)||av<0||av>100){$('res').innerHTML='0~100 사이 값을 입력하세요';return;}
    var down=(100-av)/100;var yr=down*365*24*60,mo=down*30*24*60,wk=down*7*24*60,day=down*24*60;
    $('res').innerHTML='<div class="big">'+av+'% 가용성</div><table>'+
    '<tr><td>연간 허용 다운타임</td><td><b>'+dur(yr)+'</b></td></tr>'+
    '<tr><td>월간</td><td><b>'+dur(mo)+'</b></td></tr>'+
    '<tr><td>주간</td><td><b>'+dur(wk)+'</b></td></tr>'+
    '<tr><td>일간</td><td><b>'+dur(day)+'</b></td></tr></table>';}
  $('av').addEventListener('input',run);run();` },

{ key:'capacity', cat:'감리·검증', title:'시스템 용량 산정 계산기',
  desc:'동시사용자·트랜잭션·피크계수로 필요 TPS를, 행 수·행 크기·증가율로 데이터 스토리지를 산정합니다. 인프라 설계.',
  h1:'시스템 용량 산정', sub:'필요 처리량(TPS)과 데이터 스토리지 용량을 추정합니다.',
  note:'TPS = 동시사용자 × 사용자당 시간당 요청 ÷ 3600 × 피크계수. 스토리지는 인덱스·여유율을 포함한 근사치입니다. 참고용 추정입니다.',
  body:`<div class="frm">
    <label>동시 사용자<input type="number" id="users" value="500"></label>
    <label>사용자당 요청/시간<input type="number" id="req" value="120"></label>
    <label>피크계수<input type="number" id="peak" value="2" step="0.1"></label>
  </div><div class="frm">
    <label>일 발생 행 수<input type="number" id="rows" value="100000"></label>
    <label>행당 크기(byte)<input type="number" id="size" value="500"></label>
    <label>보존(년)<input type="number" id="years" value="3"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function gb(b){if(b<1048576)return (b/1024).toFixed(1)+' KB';if(b<1073741824)return (b/1048576).toFixed(1)+' MB';if(b<1099511627776)return (b/1073741824).toFixed(2)+' GB';return (b/1099511627776).toFixed(2)+' TB';}
  function run(){var u=+$('users').value||0,r=+$('req').value||0,pk=+$('peak').value||1;
    var tps=u*r/3600*pk;
    var rows=+$('rows').value||0,sz=+$('size').value||0,yr=+$('years').value||1;
    var raw=rows*sz*365*yr;var withIdx=raw*1.5;var withFree=withIdx*1.3;
    $('res').innerHTML='<div class="big">'+tps.toFixed(1)+' TPS</div><table>'+
    '<tr><td>필요 처리량(피크)</td><td><b>'+tps.toFixed(1)+' TPS</b> ('+Math.ceil(tps)+'건/초)</td></tr>'+
    '<tr><td>순수 데이터('+yr+'년)</td><td><b>'+gb(raw)+'</b></td></tr>'+
    '<tr><td>+ 인덱스(×1.5)</td><td><b>'+gb(withIdx)+'</b></td></tr>'+
    '<tr><td>+ 여유율 30% (권장 산정)</td><td><b>'+gb(withFree)+'</b></td></tr></table>';}
  ['users','req','peak','rows','size','years'].forEach(function(i){$(i).addEventListener('input',run);});run();` },

{ key:'bandwidth', cat:'감리·검증', title:'대역폭·전송시간 계산기',
  desc:'데이터량과 회선속도로 전송시간을, 동시사용자와 사용자당 대역으로 필요 회선 대역폭을 계산합니다. 네트워크 설계.',
  h1:'대역폭·전송시간 계산기', sub:'전송시간과 필요 회선 대역폭을 계산합니다.',
  note:'전송시간 = 데이터량 ÷ (회선속도 × 효율). bit/byte 환산(×8)과 회선 효율을 반영합니다. 참고용 추정입니다.',
  body:`<div class="frm">
    <label>데이터량<input type="number" id="data" value="500"></label>
    <label>단위<select id="unit"><option value="1">MB</option><option value="1024">GB</option></select></label>
    <label>회선속도(Mbps)<input type="number" id="speed" value="100"></label>
    <label>효율(%)<input type="number" id="eff" value="80"></label>
  </div><div class="frm">
    <label>동시 사용자<input type="number" id="users" value="200"></label>
    <label>사용자당 대역(Kbps)<input type="number" id="per" value="256"></label>
  </div><div class="res" id="res"></div>`,
  script:`var $=function(i){return document.getElementById(i);};
  function dur(s){if(s<60)return s.toFixed(1)+'초';if(s<3600)return (s/60).toFixed(1)+'분';return (s/3600).toFixed(2)+'시간';}
  function run(){var mb=(+$('data').value||0)*(+$('unit').value),speed=+$('speed').value||1,eff=(+$('eff').value||100)/100;
    var sec=(mb*8)/(speed*eff);
    var u=+$('users').value||0,per=+$('per').value||0;var needMbps=u*per/1024;
    $('res').innerHTML='<div class="big">'+dur(sec)+'</div><table>'+
    '<tr><td>전송시간 ('+mb+'MB @ '+speed+'Mbps)</td><td><b>'+dur(sec)+'</b></td></tr>'+
    '<tr><td>필요 대역폭 (동시 '+u+'명)</td><td><b>'+needMbps.toFixed(1)+' Mbps</b></td></tr>'+
    '<tr><td>권장 회선(여유 30%)</td><td><b>'+(needMbps*1.3).toFixed(1)+' Mbps</b></td></tr></table>';}
  ['data','unit','speed','eff','users','per'].forEach(function(i){$(i).addEventListener('input',run);$(i).addEventListener('change',run);});run();` }

];
