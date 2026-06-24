/* Google Analytics 4 — 빛의여행(gemini2k) 도구
   page load 이후 지연 로드: 제한·저속망에서 GA 호스트(googletagmanager/google-analytics)가
   느리거나 막혀도 탭이 '로딩 중' 상태로 남지 않게 하여 로딩 커서·지연을 방지 */
(function () {
  function loadGA() {
    var id = "G-27WKS2225C";
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  }
  if (document.readyState === "complete") loadGA();
  else window.addEventListener("load", loadGA);
})();
