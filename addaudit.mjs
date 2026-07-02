// 감리·점검 도구를 tools.js + i18n.js(4개국어)에 일괄 등록. 키 단위 멱등(이미 있으면 건너뜀).
import fs from 'fs';
const q = s => String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");

// [key, ic, chip, cat, kw, related, oss?]
const REG = [
  ['rtm','📋','c-blue','감리·검증','요구사항 추적 rtm 추적성 매트릭스 traceability requirement 감리','riskreg,testcase,srs'],
  ['riskreg','⚠️','c-rose','감리·검증','위험 이슈 관리대장 risk issue register 위험관리 감리','changereq,stakeholder,rtm'],
  ['raci','🧩','c-violet','감리·검증','raci 책임 배분 매트릭스 역할 responsibility','stakeholder,rtm,evm'],
  ['stakeholder','👥','c-cyan','감리·검증','이해관계자 등록부 stakeholder 관심도 영향력 pm','raci,riskreg,changereq'],
  ['changereq','🔁','c-amber','감리·검증','변경요청 cr 형상관리 change request 변경관리','riskreg,rtm,testcase'],
  ['testcase','🧪','c-green','감리·검증','테스트케이스 결함 버그 관리 test case defect 통과율 시험','rtm,testmetrics,deliverable'],
  ['deliverable','📑','c-blue','감리·검증','산출물 점검 체크리스트 deliverable 단계 감리 점검표','archcheck,rtm,testcase'],
  ['archcheck','🏛️','c-violet','감리·검증','아키텍처 점검 체크리스트 architecture 가용성 확장성 감리','deliverable,capacity,ifspec'],
  ['evm','📈','c-blue','감리·검증','획득가치 evm spi cpi eac 진척 원가 pmp earned value','roi,fp,swcost'],
  ['fp','🔢','c-amber','감리·검증','기능점수 fp function point 규모 산정 대가','swcost,roi,evm'],
  ['swcost','💰','c-green','감리·검증','sw 사업대가 투입공수 mm 개발원가 비용 산정','fp,roi,evm'],
  ['roi','📊','c-cyan','감리·검증','정보화 roi tco 투자 효과 회수기간 타당성','swcost,fp,evm'],
  ['sla','⏱️','c-rose','감리·검증','가용성 sla 다운타임 availability uptime 운영','capacity,bandwidth,archcheck'],
  ['capacity','🗄️','c-violet','감리·검증','용량 산정 tps 스토리지 capacity 동시사용자 성능','bandwidth,sla,perfanalyze'],
  ['bandwidth','🌐','c-blue','감리·검증','대역폭 전송시간 회선 bandwidth 네트워크 용량','capacity,sla,ipplan'],

  ['swweakness','🛡️','c-rose','보안·진단','보안약점 시큐어코딩 행안부 47 진단 secure coding weakness owasp','seccode,cvss,secretscan',1?0:0],
  ['swweakness2',0,0,0,0,0], // placeholder guard (ignored)
];
REG.pop(); REG.pop(); // remove placeholders, re-add swweakness cleanly below
REG.push(
  ['swweakness','🛡️','c-rose','보안·진단','보안약점 시큐어코딩 행안부 진단 secure coding weakness 점검','seccode,cvss,secheaders'],
  ['cvss','🎯','c-violet','보안·진단','cvss 취약점 점수 심각도 score vulnerability 보안','swweakness,secheaders,certparse'],
  ['seccode','🔍','c-amber','보안·진단','시큐어코딩 패턴 스캐너 소스 보안약점 sql xss eval 진단','secretscan,swweakness,complexity'],
  ['secretscan','🔑','c-rose','보안·진단','시크릿 키 탐지 하드코딩 비밀번호 api key secret 노출','seccode,swweakness,sanitize'],
  ['secheaders','🧱','c-blue','보안·진단','보안 http 헤더 csp hsts x-frame 점검 security header','swweakness,cvss,certparse'],
  ['certparse','📜','c-green','보안·진단','인증서 pem x509 분석 만료 ssl tls certificate','secheaders,rsakey,jwtsign',1],

  ['pia','🛟','c-violet','개인정보','개인정보 영향평가 pia 체크리스트 privacy impact 점검','pdflow,pdcategory,retention'],
  ['pdflow','🔀','c-cyan','개인정보','개인정보 흐름표 수집 이용 제공 파기 flow 처리','pia,pdcategory,mask'],
  ['pdcategory','🗂️','c-amber','개인정보','개인정보 항목 분류 고유식별 민감정보 category 점검','pia,pdflow,mask'],
  ['retention','🗓️','c-green','개인정보','보유기간 파기일정 계산 retention 개인정보 파기','pdflow,pia,dday'],

  ['dbnaming','🏷️','c-blue','데이터','db 명명규칙 표준 테이블 컬럼 naming convention 표준화','commoncode,dataquality,ddlparse'],
  ['commoncode','🔢','c-violet','데이터','공통코드 정의서 코드값 중복 common code 표준','dbnaming,ddlparse,dataquality'],
  ['dataquality','🧪','c-green','데이터','데이터 품질진단 완전성 유효성 csv quality 진단','profiler,dbnaming,csvschema'],
  ['ddlparse','🗄️','c-amber','데이터','ddl 테이블정의서 erd create table parse 변환','dbnaming,commoncode,sqlformat',1],

  ['srs','📋','c-blue','감리·검증','요구사항 정의서 srs 기능 비기능 specification 요구','rtm,reqpriority,changereq'],
  ['reqpriority','🎚️','c-violet','감리·검증','요구사항 우선순위 moscow kano 가치 priority','srs,rtm,evm'],
  ['testmetrics','📉','c-rose','감리·검증','결함밀도 품질지표 dre mtbf 통과율 defect density','testcase,complexity,perfanalyze'],
  ['complexity','🌿','c-green','개발자','코드 복잡도 순환복잡도 cyclomatic complexity 정적분석','ast,seccode,testmetrics',1],
  ['ifspec','🔌','c-cyan','감리·검증','인터페이스 정의서 연계 if interface 명세 eai api','archcheck,rtm,ddlparse'],
  ['kwcag','♿','c-blue','감리·검증','웹접근성 kwcag 자가점검 접근성 accessibility 전자정부','a11ycheck,contrast,deliverable'],
  ['a11ycheck','🔎','c-green','개발자','웹접근성 자동 점검 axe 마크업 accessibility 진단','kwcag,contrast,sanitize',1],
  ['ipplan','🧮','c-violet','개발자','ip 주소계획 서브넷 분할 vlsm subnet 네트워크','subnet,bandwidth,fwpolicy'],
  ['fwpolicy','🧱','c-rose','개발자','방화벽 정책 포트 firewall policy 보안 네트워크','subnet,ipplan,secheaders'],
  ['perfanalyze','📈','c-blue','감리·검증','성능시험 결과 분석 응답시간 p95 tps performance 백분위','capacity,sla,testmetrics']
);
REG.push(
  ['querysql','🔎','c-amber','데이터','csv json sql 쿼리 실행 alasql 집계 조회 데이터분석','sqlplay,sqlformat,dataquality',1],
  ['jshint','🩺','c-green','개발자','javascript 린트 정적분석 코드점검 jshint lint 품질','complexity,prettier,seccode',1],
  ['htmlhint','🔬','c-blue','개발자','html 마크업 품질 점검 htmlhint lint 표준 검증','a11ycheck,prettier,sanitize',1],
  ['csslint','🎨','c-violet','개발자','css 코드 점검 csslint lint 스타일 품질 검증','prettier,boxshadow,htmlhint',1],
  ['checksum','🔏','c-rose','보안·진단','파일 무결성 체크섬 해시 sha256 sha3 blake crc 검증 hash file','hash,sha3,certparse',1],
  ['csrgen','✒️','c-green','보안·진단','csr 인증서 서명요청 생성 rsa 키 ssl 발급 신청','rsakey,certparse,asn1',1],
  ['asn1','🧬','c-violet','보안·진단','asn1 der 디코더 분석 pem pki 인증서 구조 decode','certparse,csrgen,pkcs12',1],
  ['pkcs12','🧳','c-amber','보안·진단','pkcs12 p12 pfx 인증서 번들 분석 키 비밀번호 certificate','certparse,csrgen,rsakey',1]
);
REG.push(
  ['chancedata','🎲','c-amber','데이터','테스트 더미데이터 생성 가짜 chance 시드 fake test data 목업','mockdata,querysql,dataquality',1],
  ['combos','🔀','c-violet','감리·검증','조합 테스트 케이스 곱집합 cartesian combination 조합생성','pairwise,testcase,decisiontable'],
  ['pairwise','🧮','c-blue','감리·검증','페어와이즈 all-pairs 조합 최소 테스트 케이스 설계','combos,testcase,boundary'],
  ['junitview','📋','c-green','감리·검증','junit xunit 테스트 결과 xml 리포트 통과 실패 ci','testcase,testmetrics,lcovview'],
  ['lcovview','📈','c-cyan','감리·검증','lcov 커버리지 리포트 라인 브랜치 coverage 테스트','testmetrics,junitview,complexity'],
  ['decisiontable','🗂️','c-violet','감리·검증','결정표 decision table 조건 규칙 테스트 설계','boundary,combos,testcase'],
  ['boundary','📏','c-rose','감리·검증','경계값 분석 동등분할 bva ep 테스트 입력 범위','decisiontable,pairwise,testcase']
);
REG.push(
  ['jsbench','🏎️','c-blue','개발자','자바스크립트 코드 벤치마크 성능 ops 속도 비교 benchmark perf','complexity,jshint,latencystats',1],
  ['latencystats','📊','c-cyan','감리·검증','응답시간 분포 백분위 p95 p99 히스토그램 apdex 통계 지연 latency','perfanalyze,apdex,capacity',1],
  ['littlelaw','⚖️','c-violet','감리·검증','리틀의 법칙 little law 동시처리 처리율 응답시간 큐 성능','vusizing,capacity,apdex'],
  ['apdex','🙂','c-green','감리·검증','apdex 성능지수 사용자 체감 만족 허용 kpi 응답시간','latencystats,perfanalyze,sla'],
  ['vusizing','🚦','c-amber','감리·검증','부하시험 가상사용자 vu 산정 동시접속 tps think time 부하 load','littlelaw,k6gen,capacity'],
  ['k6gen','🧾','c-rose','감리·검증','k6 jmeter 부하 스크립트 생성 load test 성능시험 가상사용자','vusizing,perfanalyze,capacity']
);

const CATS = {
  '감리·검증': ['감리·검증','Audit','审计验证','監理検証'],
  '보안·진단': ['보안·진단','Security','安全诊断','セキュリティ'],
};

// [key, ko_t, ko_d, en_t, en_d, zh_t, zh_d, ja_t, ja_d]
const I18N = [
  ['rtm','요구사항 추적표(RTM)','요구사항-설계-구현-시험 추적성 매트릭스 작성·CSV.','Requirements Traceability (RTM)','Requirement-design-code-test traceability matrix.','需求追踪矩阵(RTM)','编制需求-设计-实现-测试追踪矩阵。','要件トレーサビリティ(RTM)','要件-設計-実装-試験の追跡表を作成。'],
  ['riskreg','위험·이슈 관리대장','위험·이슈를 식별·평가하고 대응 상태를 관리.','Risk & Issue Register','Identify risks/issues, track impact & response.','风险·问题登记册','识别风险问题并管理影响与对应。','リスク·課題管理表','リスク·課題の影響と対応を管理。'],
  ['raci','RACI 책임배분 매트릭스','작업별 R·A·C·I 책임을 배분.','RACI Matrix','Assign R/A/C/I responsibilities per task.','RACI 职责矩阵','按任务分配R/A/C/I职责。','RACI 責任分担表','タスク別にR/A/C/Iを割当。'],
  ['stakeholder','이해관계자 등록부','관심도·영향력별 이해관계자 관리.','Stakeholder Register','Manage stakeholders by interest and influence.','干系人登记册','按关注度·影响力管理干系人。','ステークホルダー登録簿','関心度·影響力で管理。'],
  ['changereq','변경요청(CR) 관리대장','변경요청 접수·영향분석·승인 이력 관리.','Change Request Log','Track change requests, impact and approvals.','变更请求(CR)登记册','管理变更请求与审批历史。','変更要求(CR)管理表','変更要求·影響·承認を管理。'],
  ['testcase','테스트케이스·결함 관리대장','테스트케이스·결함 기록, 통과율 집계.','Test Case & Defect Log','Record cases/defects with pass-rate summary.','测试用例·缺陷登记','记录用例缺陷并统计通过率。','テストケース·欠陥管理','ケース·欠陥を記録し合格率集計。'],
  ['deliverable','단계별 산출물 점검 체크리스트','분석~시험 단계 산출물 충족률 점검.','Deliverable Checklist','Check deliverables per phase with coverage.','阶段产出物检查清单','按阶段检查产出物达成率。','成果物チェックリスト','工程別の成果物を点検。'],
  ['archcheck','아키텍처 점검 체크리스트','가용성·확장성·보안 등 구조 적정성 점검.','Architecture Checklist','Review availability, scalability and security.','架构检查清单','检查可用性·扩展性·安全。','アーキテクチャ点検','可用性·拡張性·セキュリティを点検。'],
  ['evm','획득가치(EVM) 계산기','SPI·CPI·EAC 등 일정·원가 성과 분석.','Earned Value (EVM) Calculator','SPI/CPI/EAC schedule & cost performance.','挣值(EVM)计算器','计算SPI·CPI·EAC等绩效。','アーンドバリュー(EVM)計算','SPI·CPI·EAC等を算出。'],
  ['fp','기능점수(FP) 간이 산정','기능 개수로 미보정 기능점수 추정.','Function Point Estimator','Estimate unadjusted function points.','功能点(FP)估算','按功能数估算未调整功能点。','ファンクションポイント概算','未調整FPを推定。'],
  ['swcost','SW 사업대가·투입공수 계산','FP 기반 개발원가·투입 MM 추정.','SW Cost & Effort Estimator','FP-based cost and man-month estimate.','软件费用·工时估算','基于FP估算费用与人月。','SW費用·工数計算','FP基準で費用·人月を推定。'],
  ['roi','정보화 ROI·TCO 계산기','ROI·순효과·회수기간·TCO 산출.','ROI & TCO Calculator','Compute ROI, payback and TCO.','信息化ROI·TCO计算','计算ROI·回收期·TCO。','情報化ROI·TCO計算','ROI·回収期間·TCOを算出。'],
  ['sla','가용성(SLA) 다운타임 계산기','목표 가용성별 허용 다운타임 계산.','Availability (SLA) Calculator','Allowed downtime per target uptime.','可用性(SLA)计算器','按目标可用性计算停机时间。','可用性(SLA)計算','目標稼働率の許容停止時間。'],
  ['capacity','시스템 용량 산정 계산기','필요 TPS·스토리지 용량 추정.','Capacity Planner','Estimate required TPS and storage.','系统容量估算','估算所需TPS与存储。','システム容量算定','必要TPS·ストレージを推定。'],
  ['bandwidth','대역폭·전송시간 계산기','전송시간·필요 회선 대역폭 계산.','Bandwidth & Transfer Calculator','Transfer time and required bandwidth.','带宽·传输时间计算','计算传输时间与所需带宽。','帯域·転送時間計算','転送時間·必要帯域を算出。'],

  ['swweakness','SW 보안약점 자가점검','행안부 SW 개발보안 7개 유형 보안약점 점검.','SW Weakness Self-check','Self-check SW security weaknesses by category.','软件安全弱点自查','按类型自查软件安全弱点。','SW脆弱点セルフ点検','種別ごとにSW脆弱点を点検。'],
  ['cvss','CVSS 3.1 점수 계산기','취약점 기본 메트릭으로 CVSS 점수·심각도 산출.','CVSS 3.1 Calculator','Compute CVSS base score and severity.','CVSS 3.1 计算器','计算CVSS基础分与严重度。','CVSS 3.1 計算機','CVSS基本スコアと深刻度を算出。'],
  ['seccode','시큐어코딩 패턴 스캐너','소스에서 보안약점 의심 패턴을 찾아 표시.','Secure Coding Scanner','Find security-weakness patterns in source.','安全编码模式扫描','在源码中查找安全弱点模式。','セキュアコーディング走査','ソースの脆弱パターンを検出。'],
  ['secretscan','하드코딩 시크릿 탐지기','코드·설정의 API키·비밀번호 등 시크릿 탐지.','Secret/Key Scanner','Detect exposed API keys/secrets in code.','密钥泄露扫描','检测代码中泄露的密钥·密码。','シークレット検出','コードのAPIキー·秘密を検出。'],
  ['secheaders','보안 HTTP 헤더 점검·생성','응답 헤더의 보안 헤더 적용 여부 점검·권장.','Security Header Checker','Check & generate security HTTP headers.','安全HTTP头检查','检查并生成安全响应头。','セキュリティヘッダ点検','セキュリティHTTPヘッダを点検·生成。'],
  ['certparse','인증서(PEM) 분석기','X.509 인증서 발급자·유효기간·만료 분석.','Certificate (PEM) Inspector','Inspect X.509 issuer, validity and expiry.','证书(PEM)解析','解析X.509颁发者·有效期·到期。','証明書(PEM)解析','X.509の発行者·有効期限を解析。'],

  ['pia','개인정보 영향평가(PIA) 체크리스트','개인정보 처리 전반의 위험요소 영역별 점검.','Privacy Impact (PIA) Checklist','Self-check privacy risks across the lifecycle.','个人信息影响评估清单','按领域自查个人信息处理风险。','個人情報影響評価チェック','個人情報処理のリスクを点検。'],
  ['pdflow','개인정보 흐름표 생성기','수집~파기 단계별 항목·목적·근거 흐름표 작성.','Personal Data Flow Table','Map personal-data lifecycle: items, purpose, basis.','个人信息流向表','编制收集到销毁的流向表。','個人情報フロー表','収集～廃棄の流れを整理。'],
  ['pdcategory','개인정보 항목 분류 점검표','일반·고유식별·민감·금융 정보 분류 점검.','Personal Data Classifier','Classify data: general/identifier/sensitive/financial.','个人信息分类检查','分类一般·身份·敏感·金融信息。','個人情報分類点検','一般·識別·機微·金融に分類。'],
  ['retention','보유기간·파기일정 계산기','수집일·보유기간으로 파기 예정일 계산.','Retention & Disposal Calculator','Compute disposal date from collection & period.','保留期·销毁日计算','按收集日与期限计算销毁日。','保存期間·廃棄日計算','収集日と期間から廃棄日を算出。'],

  ['dbnaming','DB 명명규칙 검사기','테이블·컬럼명 표준 명명규칙 위반 점검.','DB Naming Checker','Check table/column names against naming rules.','数据库命名检查','检查表·列名命名规范。','DB命名規則チェック','テーブル·列名の規則違反を点検。'],
  ['commoncode','공통코드 정의서','코드그룹·코드값 정의·중복 점검.','Common Code Dictionary','Define common codes and detect duplicates.','公共代码定义书','定义公共代码并检测重复。','共通コード定義書','共通コードを定義し重複点検。'],
  ['dataquality','데이터 품질진단(CSV)','CSV 열별 완전성·유효성·유일성 진단.','Data Quality Profiler','Profile CSV completeness/validity/uniqueness.','数据质量诊断(CSV)','诊断CSV完整性·有效性·唯一性。','データ品質診断(CSV)','CSV列の完全性·有効性·一意性を診断。'],
  ['ddlparse','DDL → 테이블정의서 변환','CREATE TABLE을 테이블정의서 표로 변환.','DDL → Table Spec','Convert CREATE TABLE into a column spec table.','DDL → 表定义书','将CREATE TABLE转为字段定义表。','DDL → テーブル定義書','CREATE TABLEを定義表に変換。'],

  ['srs','요구사항 정의서(SRS)','기능·비기능 요구사항을 표준 항목으로 정의.','Requirements Spec (SRS)','Define functional/non-functional requirements.','需求规格说明书(SRS)','定义功能·非功能需求。','要件定義書(SRS)','機能·非機能要件を定義。'],
  ['reqpriority','요구사항 우선순위(MoSCoW)','가치·비용·위험으로 우선순위·MoSCoW 분류.','Requirement Prioritization','Prioritize by value/cost/risk with MoSCoW.','需求优先级(MoSCoW)','按价值·成本·风险排定优先级。','要件優先順位(MoSCoW)','価値·コスト·リスクで優先順位。'],
  ['testmetrics','결함밀도·품질지표 계산기','결함밀도·통과율·DRE·MTBF 등 품질지표.','Quality Metrics Calculator','Defect density, pass rate, DRE, MTBF.','缺陷密度·质量指标','缺陷密度·通过率·DRE·MTBF。','欠陥密度·品質指標','欠陥密度·合格率·DRE·MTBF。'],
  ['complexity','코드 복잡도(순환복잡도) 분석','JavaScript 함수별 순환복잡도 계산.','Cyclomatic Complexity','Compute per-function cyclomatic complexity (JS).','圈复杂度分析','计算JS函数的圈复杂度。','循環的複雑度分析','JS関数ごとの循環的複雑度を算出。'],
  ['ifspec','인터페이스(I/F) 정의서','연계 인터페이스 송수신·방식·주기 명세.','Interface (I/F) Spec','Specify system interfaces, method and cycle.','接口(I/F)定义书','规定系统接口、方式与周期。','インターフェース定義書','連携I/Fの方式·周期を明記。'],
  ['kwcag','웹 접근성(KWCAG 2.2) 자가점검','4대 원칙별 웹 접근성 검사항목 점검.','Web Accessibility (KWCAG) Check','Self-check accessibility by the 4 principles.','网页无障碍(KWCAG)自查','按四大原则自查无障碍。','ウェブアクセシビリティ点検','4原則ごとに点検。'],
  ['a11ycheck','웹 접근성 자동 점검(axe)','HTML 접근성 위반을 axe 엔진으로 자동 진단.','Accessibility Auto-check (axe)','Auto-detect accessibility issues with axe.','无障碍自动检测(axe)','用axe自动检测无障碍问题。','アクセシビリティ自動点検','axeで自動診断。'],
  ['ipplan','IP 주소계획·서브넷 분할','기준 네트워크를 N개 서브넷으로 분할·계획.','IP Plan / Subnetting','Split a network into N subnets with a plan.','IP规划·子网划分','将网络均分为N个子网。','IPアドレス計画·分割','ネットワークをN分割。'],
  ['fwpolicy','방화벽 정책 정의표','방화벽 정책 정리·중복/과도 허용 점검.','Firewall Policy Table','List firewall rules; flag overly-broad allows.','防火墙策略表','整理策略并检查过度放行。','ファイアウォール方針表','ルールを整理し過剰許可を点検。'],
  ['perfanalyze','성능시험 결과 분석기','응답시간 분포·p95/p99·추정 TPS 분석.','Performance Result Analyzer','Analyze latency percentiles (p95/p99) and TPS.','性能结果分析','分析延迟分位(p95/p99)与TPS。','性能結果分析','応答時間の分位とTPSを分析。'],
  ['querysql','CSV/JSON SQL 쿼리','CSV·JSON 데이터에 SQL을 실행해 집계·필터·정렬.','CSV/JSON SQL Query','Run SQL (joins, group-by) on CSV/JSON data.','CSV/JSON SQL查询','对CSV·JSON执行SQL聚合与筛选。','CSV/JSON SQLクエリ','CSV·JSONにSQLを実行し集計・抽出。'],
  ['jshint','JavaScript 코드 린트','JS 잠재 오류·미사용·위험 패턴을 정적 점검.','JavaScript Linter','Statically check JS for errors and risks.','JavaScript 代码检查','静态检查JS错误与风险。','JavaScript リント','JSの潜在エラーを静的検査。'],
  ['htmlhint','HTML 마크업 품질 점검','중복 id·필수 속성 등 마크업 규칙 점검.','HTML Markup Linter','Check HTML markup rules and quality.','HTML 标记检查','检查HTML标记规则与质量。','HTML マークアップ点検','HTMLの記法規則を点検。'],
  ['csslint','CSS 코드 점검','CSS 호환성·성능·오류를 점검.','CSS Linter','Lint CSS for errors, perf and compatibility.','CSS 代码检查','检查CSS错误·性能·兼容性。','CSS コード点検','CSSのエラー・性能を点検。'],
  ['checksum','파일 무결성 체크섬','파일·텍스트의 SHA-3 등 다중 해시 계산.','File Checksum (multi-hash)','Hash files/text with many algorithms.','文件校验和(多哈希)','计算文件·文本多种哈希。','ファイルチェックサム','ファイル・テキストを多種ハッシュ。'],
  ['csrgen','CSR 생성기','RSA 키쌍과 인증서 서명요청(CSR)을 생성.','CSR Generator','Generate an RSA key pair and CSR (PEM).','CSR 生成器','生成RSA密钥与证书签名请求(CSR)。','CSR ジェネレータ','RSA鍵とCSRを生成。'],
  ['asn1','ASN.1 / DER 디코더','PEM·16진수 ASN.1(DER) 구조를 해석.','ASN.1 / DER Decoder','Decode ASN.1 (PEM/hex) structure.','ASN.1 / DER 解码器','解析ASN.1(PEM/十六进制)结构。','ASN.1 / DER デコーダ','ASN.1構造を解析。'],
  ['pkcs12','PKCS#12(.p12) 분석기','.p12/.pfx 인증서·키를 비밀번호로 확인.','PKCS#12 (.p12) Inspector','Open .p12/.pfx bundles with a password.','PKCS#12(.p12) 解析','用密码查看.p12/.pfx证书。','PKCS#12(.p12) 解析','パスワードで.p12/.pfxを確認。'],
  ['chancedata','테스트 더미데이터 생성기','이름·이메일 등 가짜 테스트 데이터를 시드 재현으로 생성.','Test Data Generator','Generate reproducible fake test data (seeded).','测试数据生成器','生成可复现的假测试数据。','テストデータ生成','シード再現可能なダミーデータ生成。'],
  ['combos','조합 테스트 케이스 생성','파라미터 값의 전체 조합(곱집합)을 생성.','Combination Test Cases','Generate the full cartesian combinations.','组合测试用例','生成参数取值的全组合。','組み合わせテストケース','値の全組合せを生成。'],
  ['pairwise','페어와이즈 케이스 생성','모든 값 쌍을 덮는 최소 테스트 케이스 생성.','Pairwise (All-Pairs) Generator','Minimal cases covering all value pairs.','配对(全对)用例生成','覆盖所有取值对的最小用例。','ペアワイズ生成','全ペアを覆う最小ケース。'],
  ['junitview','JUnit/xUnit 결과 뷰어','테스트 결과 XML의 통과·실패·스킵 집계.','JUnit/xUnit Result Viewer','Summarize test XML: pass/fail/skip.','JUnit/xUnit 结果查看','汇总测试XML的通过/失败/跳过。','JUnit/xUnit 結果ビューア','テストXMLを集計。'],
  ['lcovview','LCOV 커버리지 뷰어','lcov.info의 라인·브랜치 커버리지 요약.','LCOV Coverage Viewer','Summarize lcov line/branch coverage.','LCOV 覆盖率查看','汇总lcov行/分支覆盖率。','LCOV カバレッジビューア','lcovの行・分岐を集計。'],
  ['decisiontable','결정표 생성기','조건의 모든 참/거짓 조합 규칙표 생성.','Decision Table Generator','All true/false rule combinations.','决策表生成器','条件的所有真假组合规则。','デシジョンテーブル生成','条件の全T/F規則。'],
  ['boundary','경계값·동등분할 도우미','입력 범위로 경계값(BVA)·동등분할(EP) 산출.','Boundary & Equivalence Helper','BVA/EP test values from a range.','边界值·等价类助手','由范围生成BVA/EP测试值。','境界値・同値分割ヘルパ','範囲からBVA/EP値を算出。'],

  ['jsbench','JavaScript 코드 벤치마크','두 코드의 실행속도(ops/sec)를 통계 비교.','JavaScript Benchmark','Compare code speed (ops/sec) statistically.','JavaScript 基准测试','统计比较两段代码的执行速度。','JavaScript ベンチマーク','2つのコードの速度を統計比較。'],
  ['latencystats','응답시간 분포·통계','백분위·표준편차·Apdex·히스토그램 분석.','Latency Distribution Stats','Percentiles, stddev, Apdex and histogram.','响应时间分布统计','分位·标准差·Apdex·直方图分析。','応答時間分布·統計','分位·標準偏差·Apdex·ヒストグラム。'],
  ['littlelaw',"Little's Law 계산기",'L=λ×W로 동시처리·처리율·응답시간 계산.',"Little's Law Calculator",'Solve L=λ×W for concurrency/throughput/time.',"Little 法则计算器",'用L=λ×W计算并发·吞吐·响应时间。',"リトルの法則計算",'L=λ×Wで並列数·応答時間を計算。'],
  ['apdex','Apdex 성능지수 계산기','만족·허용·불만 건수로 Apdex·등급 산출.','Apdex Score Calculator','Apdex score & rating from sample counts.','Apdex 性能指数计算','由满足·容忍·不满数算Apdex与等级。','Apdex スコア計算','満足·許容·不満件数からApdexを算出。'],
  ['vusizing','부하시험 VU 산정기','목표 처리량·응답시간으로 필요 VU 계산.','Load Test VU Sizing','Required virtual users from target throughput.','负载VU估算','由目标吞吐量计算所需虚拟用户。','負荷VU算定','目標スループットから必要VUを算出。'],
  ['k6gen','k6/JMeter 스크립트 생성기','부하시험용 k6(JS)·JMeter(.jmx) 스크립트 생성.','k6/JMeter Script Generator','Generate k6(JS) & JMeter(.jmx) load scripts.','k6/JMeter 脚本生成','生成k6(JS)·JMeter(.jmx)负载脚本。','k6/JMeter スクリプト生成','k6(JS)·JMeter(.jmx)負荷スクリプトを生成。'],
];

// ---- tools.js ----
let t = fs.readFileSync('tools.js','utf8');
const newRows = REG.filter(r=>t.indexOf("key:'"+r[0]+"'")<0);
if(newRows.length){
  const lines = newRows.map(r=>"  { key:'"+r[0]+"',"+(r[6]?" oss:1,":"")+"h:'"+r[0]+".html',ic:'"+r[1]+"', chip:'"+r[2]+"', cat:'"+r[3]+"', k:'"+q(r[4])+"', related:["+String(r[5]).split(',').map(x=>"'"+x.trim()+"'").join(',')+"] },");
  t = t.replace(/\n\];\s*$/, '\n'+lines.join('\n')+'\n];\n');
  fs.writeFileSync('tools.js', t);
}
console.log('tools.js: +'+newRows.length+'개');

// ---- i18n.js ----
let s = fs.readFileSync('i18n.js','utf8');
const LANGS=[0,1,2,3];
function insertEachLang(anchor, perLang){
  const parts = s.split(anchor);
  if(parts.length!==5){ console.log('⚠️ anchor 개수 이상('+anchor+'): '+(parts.length-1)); return false; }
  let res = parts[0];
  for(let i=0;i<4;i++) res += perLang[i] + anchor + parts[i+1];
  s = res; return true;
}
const mcats = Object.keys(CATS).filter(k=> s.indexOf("'cat."+k+"'")<0);
if(mcats.length){ insertEachLang("'cat.개발자'", LANGS.map(li=> mcats.map(k=>"'cat."+k+"':'"+CATS[k][li]+"',").join(''))); }
console.log('i18n cat: +'+mcats.length);
const mtools = I18N.filter(r=> s.indexOf("'tool."+r[0]+".t'")<0);
if(mtools.length){ insertEachLang("'tool.csvjoin.t'", LANGS.map(li=> mtools.map(r=>{const ti=1+li*2,di=2+li*2; return "'tool."+r[0]+".t':'"+q(r[ti])+"','tool."+r[0]+".d':'"+q(r[di])+"',";}).join(''))); }
fs.writeFileSync('i18n.js', s);
console.log('i18n tool: +'+mtools.length);
console.log('완료');
