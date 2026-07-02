# 색인 요청 체크리스트 (Google Search Console — URL 검사)

> gemini2k.co.kr 다국어(`/en /zh /ja`) 페이지 색인 가속용. 작성 2026-06-30.

## 사용법
1. **search.google.com/search-console** → 속성 **gemini2k.co.kr** 선택
2. 맨 위 **검색창(URL 검사)** 에 아래 URL 하나를 붙여넣고 Enter
3. 분석 후 **"색인 생성 요청"** 클릭 → 1~2분 테스트 → 대기열 등록
4. 완료한 항목은 `[ ]` → `[x]` 로 체크

## 주의
- **하루 한도 약 10~12개**(속성당). 그래서 **Day 별로 나눠** 진행하세요.
- **한국어(루트) 페이지는 이미 색인됨 → 요청 불필요.** 새로 생긴 `/en /zh /ja` 만 대상.
- 나머지 ~900개 도구 페이지는 **sitemap.xml(1520 URL, hreflang 포함)** 이 자동 크롤하므로 수동 요청 불필요. 이 목록은 **트래픽 높은 핵심 페이지만** 우선 밀어넣는 용도.
- 색인은 요청해도 며칠~몇 주 소요(요청=우선 크롤 유도, 보장 아님).
- 네이버 서치어드바이저에도 같은 sitemap 제출 권장.

---

## Day 1 — 언어 홈 + 최상위 도구 (9개)
- [ ] https://gemini2k.co.kr/en/
- [ ] https://gemini2k.co.kr/zh/
- [ ] https://gemini2k.co.kr/ja/
- [ ] https://gemini2k.co.kr/en/diagram.html
- [ ] https://gemini2k.co.kr/zh/diagram.html
- [ ] https://gemini2k.co.kr/ja/diagram.html
- [ ] https://gemini2k.co.kr/en/worldclock.html
- [ ] https://gemini2k.co.kr/zh/worldclock.html
- [ ] https://gemini2k.co.kr/ja/worldclock.html

## Day 2 — 만나이/글자수/GIS지도 (9개)
- [ ] https://gemini2k.co.kr/en/date-calc.html
- [ ] https://gemini2k.co.kr/zh/date-calc.html
- [ ] https://gemini2k.co.kr/ja/date-calc.html
- [ ] https://gemini2k.co.kr/en/char-counter.html
- [ ] https://gemini2k.co.kr/zh/char-counter.html
- [ ] https://gemini2k.co.kr/ja/char-counter.html
- [ ] https://gemini2k.co.kr/en/map.html
- [ ] https://gemini2k.co.kr/zh/map.html
- [ ] https://gemini2k.co.kr/ja/map.html

## Day 3 — QR/JSON/로또 (9개)
- [ ] https://gemini2k.co.kr/en/qr.html
- [ ] https://gemini2k.co.kr/zh/qr.html
- [ ] https://gemini2k.co.kr/ja/qr.html
- [ ] https://gemini2k.co.kr/en/json.html
- [ ] https://gemini2k.co.kr/zh/json.html
- [ ] https://gemini2k.co.kr/ja/json.html
- [ ] https://gemini2k.co.kr/en/lotto.html
- [ ] https://gemini2k.co.kr/zh/lotto.html
- [ ] https://gemini2k.co.kr/ja/lotto.html

## Day 4 — 퍼센트/단위변환/색상 (9개)
- [ ] https://gemini2k.co.kr/en/percent.html
- [ ] https://gemini2k.co.kr/zh/percent.html
- [ ] https://gemini2k.co.kr/ja/percent.html
- [ ] https://gemini2k.co.kr/en/unit.html
- [ ] https://gemini2k.co.kr/zh/unit.html
- [ ] https://gemini2k.co.kr/ja/unit.html
- [ ] https://gemini2k.co.kr/en/color.html
- [ ] https://gemini2k.co.kr/zh/color.html
- [ ] https://gemini2k.co.kr/ja/color.html

## Day 5 — 이미지/BMI/비밀번호 (9개)
- [ ] https://gemini2k.co.kr/en/image.html
- [ ] https://gemini2k.co.kr/zh/image.html
- [ ] https://gemini2k.co.kr/ja/image.html
- [ ] https://gemini2k.co.kr/en/bmi.html
- [ ] https://gemini2k.co.kr/zh/bmi.html
- [ ] https://gemini2k.co.kr/ja/bmi.html
- [ ] https://gemini2k.co.kr/en/password.html
- [ ] https://gemini2k.co.kr/zh/password.html
- [ ] https://gemini2k.co.kr/ja/password.html

## Day 6 — Base64/마크다운/PDF합치기 (9개)
- [ ] https://gemini2k.co.kr/en/base64.html
- [ ] https://gemini2k.co.kr/zh/base64.html
- [ ] https://gemini2k.co.kr/ja/base64.html
- [ ] https://gemini2k.co.kr/en/markdown.html
- [ ] https://gemini2k.co.kr/zh/markdown.html
- [ ] https://gemini2k.co.kr/ja/markdown.html
- [ ] https://gemini2k.co.kr/en/merge.html
- [ ] https://gemini2k.co.kr/zh/merge.html
- [ ] https://gemini2k.co.kr/ja/merge.html

## Day 7 — 좌표변환/연봉/대출 (9개)
- [ ] https://gemini2k.co.kr/en/coord.html
- [ ] https://gemini2k.co.kr/zh/coord.html
- [ ] https://gemini2k.co.kr/ja/coord.html
- [ ] https://gemini2k.co.kr/en/salary.html
- [ ] https://gemini2k.co.kr/zh/salary.html
- [ ] https://gemini2k.co.kr/ja/salary.html
- [ ] https://gemini2k.co.kr/en/loan.html
- [ ] https://gemini2k.co.kr/zh/loan.html
- [ ] https://gemini2k.co.kr/ja/loan.html

---

## 그 외 (sitemap 자동 크롤에 맡김 — 수동 요청 불필요)
위 21개 도구 외 나머지 ~300개 도구의 en/zh/ja 페이지는 `sitemap.xml` 로 발견·색인됩니다.
특정 도구를 추가로 밀어넣고 싶으면 같은 형식으로:
`https://gemini2k.co.kr/<en|zh|ja>/<파일명>.html`
(파일명은 한국어 페이지 URL과 동일. 예: 타이머=timer.html, 해시=hash.html, 사주=saju.html)

## 진행 메모
- 시작일: ____________
- 서치콘솔 sitemap 제출: [ ] 완료
- 네이버 sitemap 제출: [ ] 완료
