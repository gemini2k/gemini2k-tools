# 빛의여행(gemini2k) 도구 · gemini2k tools

설치·가입 없이 **브라우저에서 바로 쓰는 무료 온라인 도구 모음**입니다.
모든 계산·변환은 **사용자 브라우저 안에서만** 처리되어, 입력값이 기기 밖으로 나가지 않습니다(개인정보 안전).

> 🌐 라이브: **https://gemini2k.co.kr/**
> ✍️ 블로그: **https://gemini2k.kr** (빛의여행)

---

## ✨ 특징

- **개인정보 안전** — 100% client-side. 서버 전송·저장 없음.
- **다국어** — 한국어 / English / 中文 / 日本語 (브라우저 언어 자동 감지 + 선택 기억). 허브·전 도구 적용 완료.
- **외부 의존 없음(폐쇄망 친화)** — 글꼴·라이브러리를 모두 자체 호스팅(`fonts/`·`vendor/`). 외부 CDN 호출 0건(지도 타일 제외).
- **빠르고 가벼움** — 빌드 과정 없는 순수 HTML/CSS/JS 정적 사이트.
- **반응형** — 모바일·데스크톱 모두 대응.
- **확장 쉬움** — 데이터 기반 허브(`index.html`의 `TOOLS` 배열) + 카테고리 칩 + 실시간 검색.

## 🧰 도구 목록 (32종)

| 카테고리 | 도구 |
|----------|------|
| 📝 텍스트 | ✍️ 글자수 세기 · 🧹 텍스트 정리 |
| 🧮 계산기 | 📅 만나이·D-Day 계산기 |
| ⚙️ 생성기 | 🔳 QR코드 · 🔑 비밀번호 · 🎲 로또 번호 |
| 🔄 변환기 | 📐 단위 · 🎨 색상(HEX/RGB/HSL) · 🔤 Base64 · 🌙 양·음력 |
| 🖼️ 이미지 | 🖼️ 압축·리사이즈 · ⭐ 파비콘 생성(.ico/PNG) · 🔷 SVG 다이어그램 |
| 📄 PDF | 📎 합치기 · ✂️ 쪼개기(페이지 추출) · 🖼️ 이미지→PDF · 📦 압축 |
| 👩‍💻 개발자 | 🧩 JSON 포맷·검증 · 🔎 정규식 테스터 · 📝 마크다운 에디터 |
| ⏰ 시간 | 🌏 세계 시계(+회의 시각 변환) |
| 🛡️ 개인정보 | 🛡️ 개인정보 탐지·마스킹(체크섬 검증) · 🔐 재식별 위험성 평가(k-익명성·l-다양성·t-근접성) |
| 🗺️ GIS | 🗺️ 웹맵 뷰어(거리·면적·버퍼·히트맵·클러스터) · 🧭 좌표계 변환(경위도↔UTM-K·중부원점) · 🔺 WKT/WKB/GeoJSON 변환 · 📍 CSV 지도 시각화 · 🔄 Shapefile/KML/GPX 변환 · 🔏 위치정보 비식별화 · 🔧 공간 연산(버퍼·단순화·컨벡스헐) · 📌 국가지점번호 변환 · 📜 법정동 코드 검색 |

> 🛡️ 개인정보·🗺️ GIS 도구는 가명정보·공간정보 실무용 전문 도구입니다. 역시 **모든 처리가 브라우저 안에서만** 이뤄져 민감 데이터가 업로드되지 않습니다.

## 🗂️ 파일 구조

```
tools/
├─ index.html            허브(메인): TOOLS 배열 기반 카드 그리드 + 카테고리 칩 + 검색
├─ i18n.js               다국어 엔진 + 사전 (ko/en/zh/ja)
├─ style.css             공통 디자인 (Pretendard + 인디고 액센트)
├─ ga.js                 Google Analytics 4 (page load 이후 지연 로드)
├─ <도구>.html           각 도구 페이지 (char-counter, qr, map, pii, reid, coord …)
├─ fonts/                자체 호스팅 글꼴
│  ├─ pretendard.css        @font-face
│  └─ PretendardVariable.woff2
├─ vendor/               자체 호스팅 JS/CSS 라이브러리 (외부 CDN 대체)
│  ├─ ol-7.5.2/             OpenLayers (ol.js + ol.css)  — 지도
│  ├─ turf-7.1.0/           Turf.js                      — 버퍼/공간연산
│  ├─ proj4-2.15.0/         proj4                        — 좌표 변환
│  ├─ pdf-lib-1.17.1/       pdf-lib                      — PDF 합치기·쪼개기·이미지변환·압축
│  ├─ pdfjs-3.11.174/       pdf.js (+ pdf.worker)        — PDF 압축
│  ├─ marked-12.0.2/        marked                       — 마크다운 파싱
│  ├─ dompurify-3.1.6/      DOMPurify                    — 마크다운 XSS 정화
│  └─ qrcode-generator-1.4.4/ qrcode                     — QR 생성
├─ sitemap.xml / robots.txt / og.png / favicon.*  (deploy/seo_build.py 가 생성)
├─ LICENSE / NOTICE
└─ deploy/
   ├─ seo_build.py          canonical·OG·twitter 메타 주입 + sitemap/robots/og.png/favicon 생성
   └─ nginx-tools.conf       AWS nginx 설정
```

> 🔒 `vworld-key.js`(VWorld 지도 API 키)는 **`.gitignore` 처리**되어 공개 저장소에 포함되지 않습니다. 서버에는 배포(tar)로만 존재하며, 키가 없으면 지도는 OpenStreetMap만 표시합니다.

## 🌍 다국어(i18n)

`i18n.js`가 다음을 자동 치환합니다:
- `data-i18n="key"` → textContent / `data-i18n-html="key"` → innerHTML / `data-i18n-ph="key"` → placeholder
- JS 문구는 `t('key')`, 언어 전환은 `setLang('en')`. 동적 계산값은 `window.onI18n` 훅에서 재렌더.

번역은 `i18n.js`의 `window.I18N = { ko:{...}, en:{...}, zh:{...}, ja:{...} }`에 키로 추가합니다.

## ➕ 새 도구 추가하기

1. `새도구.html` 작성 (기존 도구의 헤더/푸터/디자인·`style.css`·`ga.js`·`i18n.js` 재사용). 외부 라이브러리가 필요하면 `vendor/`에 받아 **로컬 경로로** 참조합니다.
2. `index.html`의 `TOOLS` 배열에 한 줄 추가:
   ```js
   { key:'mytool', h:'mytool.html', ic:'🧩', chip:'c-blue', cat:'텍스트', k:'검색 키워드' }
   ```
3. `i18n.js` 사전에 `tool.mytool.t` / `tool.mytool.d`(4개 언어) 추가 → 카드·검색·카테고리에 자동 반영.

## 🚀 배포 (AWS nginx)

정적 파일을 서버 `/var/www/tools`에 두고 nginx로 서빙합니다.

```bash
# 1) SEO 메타·sitemap 갱신 (멱등)
python deploy/seo_build.py

# 2) 서버로 업로드 + 권한 설정 (tar over ssh)
tar czf - -C .. tools | ssh -i <key>.pem ubuntu@<server> \
  "sudo tar xzf - -C /var/www && sudo chown -R www-data:www-data /var/www/tools"
```

도메인·HTTPS는 가비아 DNS → Let's Encrypt(certbot) 적용 완료. nginx 설정은 `deploy/nginx-tools.conf` 참고.

## 🛠 기술

순수 HTML · CSS · JavaScript (프레임워크·빌드 없음). 글꼴·라이브러리는 모두 자체 호스팅:
[Pretendard](https://github.com/orioncactus/pretendard)(글꼴) · [OpenLayers](https://openlayers.org/) · [Turf.js](https://turfjs.org/) · [proj4js](https://github.com/proj4js/proj4js) · [pdf-lib](https://pdf-lib.js.org/) · [pdf.js](https://mozilla.github.io/pdf.js/) · [marked](https://marked.js.org/) · [DOMPurify](https://github.com/cure53/DOMPurify) · [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator). 지도 배경은 OpenStreetMap / VWorld 타일.

## 📄 라이선스

- 이 프로젝트 코드: **MIT License** — [`LICENSE`](LICENSE) (개인·상업 자유 이용, 저작권 표시 유지)
- 번들된 오픈소스 고지: [`NOTICE`](NOTICE) — Pretendard(OFL 1.1) · OpenLayers(BSD-2) · Turf/proj4/pdf-lib/marked/qrcode-generator(MIT) · DOMPurify(Apache-2.0 / MPL-2.0) · pdf.js(Apache-2.0)

© 2026 빛의여행(gemini2k)
