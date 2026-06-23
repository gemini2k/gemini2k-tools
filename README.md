# 빛의여행(gemini2k) 도구 · gemini2k tools

설치·가입 없이 **브라우저에서 바로 쓰는 무료 온라인 도구 모음**입니다.
모든 계산·변환은 **사용자 브라우저 안에서만** 처리되어, 입력값이 기기 밖으로 나가지 않습니다(개인정보 안전).

> 🌐 라이브: **http://54.180.32.78/** (커스텀 도메인 `gemini2k.co.kr` 연결 예정)
> ✍️ 블로그: **https://gemini2k.kr** (빛의여행)

---

## ✨ 특징

- **개인정보 안전** — 100% client-side. 서버 전송·저장 없음.
- **다국어** — 한국어 / English / 中文 / 日本語 (브라우저 언어 자동 감지 + 선택 기억)
- **빠르고 가벼움** — 빌드 과정 없는 순수 HTML/CSS/JS 정적 사이트
- **반응형** — 모바일·데스크톱 모두 대응
- **확장 쉬움** — 데이터 기반 허브 + 카테고리 칩 + 실시간 검색

## 🧰 도구 목록

| 도구 | 설명 | 카테고리 |
|------|------|----------|
| ✍️ 글자수 세기 | 공백 포함/제외, 단어·줄·원고지 매수, 바이트 실시간 | 텍스트 |
| 🧹 텍스트 정리 | 대소문자, 공백·빈 줄·중복 정리, 줄 정렬 | 텍스트 |
| 📅 만나이·D-Day 계산기 | 만 나이, 디데이, 두 날짜 사이 일수 | 계산기 |
| 📐 단위 변환기 | 길이·무게·넓이·온도 (평↔㎡, kg↔lb 등) | 변환기 |
| 🎨 색상 변환기 | HEX·RGB·HSL 상호 변환 + 미리보기 | 변환기 |
| 🔳 QR코드 생성기 | URL·텍스트 → QR → PNG 저장 (충분한 여백) | 생성기 |
| 🔑 비밀번호 생성기 | 암호학적 난수 + 강도 표시 | 생성기 |
| 🖼️ 이미지 압축·리사이즈 | 용량 축소·크기 조절·포맷 변환 (업로드 없음) | 이미지 |

## 🗂️ 파일 구조

```
tools/
├─ index.html        허브(메인): 도구 카드 그리드 + 카테고리 칩 + 검색
├─ i18n.js           다국어 엔진 + 사전 (ko/en/zh/ja)
├─ style.css         공통 디자인 (Pretendard + 인디고 액센트)
├─ char-counter.html 글자수 세기
├─ text-tools.html   텍스트 정리
├─ date-calc.html    만나이·D-Day
├─ unit.html         단위 변환
├─ color.html        색상 변환
├─ qr.html           QR코드 생성
├─ password.html     비밀번호 생성
├─ image.html        이미지 압축·리사이즈
└─ deploy/
   ├─ nginx-tools.conf   AWS nginx 설정
   └─ ghpages-root-index.html  (참고용)
```

## 🌍 다국어(i18n) 사용법

`i18n.js`가 다음을 자동 치환합니다:
- `data-i18n="key"` → textContent
- `data-i18n-html="key"` → innerHTML
- `data-i18n-ph="key"` → placeholder
- JS 문구는 `t('key')`, 언어 전환은 `setLang('en')`

번역은 `i18n.js`의 `window.I18N = { ko:{...}, en:{...}, zh:{...}, ja:{...} }`에 키로 추가합니다.
> 현재 **허브(index)는 4개 언어 완료**, 개별 도구 페이지는 순차 적용 예정.

## ➕ 새 도구 추가하기

1. `새도구.html` 작성 (기존 도구 페이지의 헤더/푸터/디자인 재사용)
2. `index.html`의 `TOOLS` 배열에 한 줄 추가:
   ```js
   { key:'mytool', h:'mytool.html', ic:'🧩', chip:'c-blue', cat:'텍스트', k:'검색 키워드' }
   ```
3. `i18n.js` 사전에 `tool.mytool.t` / `tool.mytool.d` 추가 → 카드·검색·카테고리에 자동 반영

## 🚀 배포 (AWS nginx)

정적 파일을 서버 `/var/www/tools`에 두고 nginx로 서빙합니다.

```bash
# 로컬에서 서버로 업로드 + 권한 설정
tar czf - -C .. tools | ssh -i <key>.pem ubuntu@<server> \
  "sudo rm -rf /var/www/tools && sudo tar xzf - -C /var/www && \
   sudo chown -R www-data:www-data /var/www/tools"
```
nginx 설정은 `deploy/nginx-tools.conf` 참고.

## 🛠 기술

순수 HTML · CSS · JavaScript (프레임워크·빌드 없음) · [Pretendard](https://github.com/orioncactus/pretendard) 글꼴 · QR 생성 [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator).

## 📄 라이선스

- 이 프로젝트 코드: **MIT License** — [`LICENSE`](LICENSE) 참고 (개인·상업 자유 이용, 저작권 표시 유지)
- 사용한 오픈소스 고지: [`NOTICE`](NOTICE) — Pretendard(OFL 1.1), qrcode-generator(MIT)

© 2026 빛의여행(gemini2k)
