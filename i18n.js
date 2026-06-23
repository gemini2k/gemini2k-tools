/* 다국어(i18n) 엔진 — 한국어/English/中文/日本語.
   사용: [data-i18n]=텍스트, [data-i18n-ph]=placeholder, [data-i18n-html]=innerHTML.
   JS 문구는 t('key'). 언어 전환 시 window.onI18n(lang) 호출(동적 렌더용). */
window.I18N = {
  ko: {
    'nav.tools':'전체 도구', 'nav.blog':'블로그',
    'hero.ey':'무료 도구', 'hero.h1':'필요한 도구,<br/>바로 여기',
    'hero.p':'설치 없이 브라우저에서 바로 쓰는 무료 도구 모음.<br/>입력값은 기기 밖으로 나가지 않습니다.',
    'search.ph':'도구 검색… (예: 글자수, 날짜, QR)',
    'cat.전체':'전체','cat.텍스트':'텍스트','cat.계산기':'계산기','cat.생성기':'생성기','cat.변환기':'변환기','cat.이미지':'이미지',
    'empty':'검색 결과가 없습니다.',
    'foot.privacy':'모든 처리는 브라우저에서 (입력값 전송 없음)', 'foot.blog':'빛의여행 블로그 →',
    'tool.char.t':'글자수 세기','tool.char.d':'공백 포함/제외, 단어·줄·원고지 매수를 실시간으로.',
    'tool.date.t':'만나이·D-Day 계산기','tool.date.d':'만 나이, 디데이, 두 날짜 사이 일수를 한 번에.',
    'tool.qr.t':'QR코드 생성기','tool.qr.d':'URL·텍스트를 QR코드로 만들고 이미지로 저장.',
    'tool.pw.t':'비밀번호 생성기','tool.pw.d':'안전한 무작위 비밀번호를 원하는 조건으로 생성.',
    'tool.unit.t':'단위 변환기','tool.unit.d':'길이·무게·넓이·온도를 즉시 변환. 평↔㎡, kg↔lb 등.',
    'tool.color.t':'색상 변환기','tool.color.d':'HEX·RGB·HSL을 서로 변환하고 색을 미리보기.',
    'tool.image.t':'이미지 압축·리사이즈','tool.image.d':'용량 줄이기·크기 조절·포맷 변환. 업로드 없이.',
    'tool.text.t':'텍스트 정리 도구','tool.text.d':'대소문자, 공백·빈 줄·중복 정리, 줄 정렬 등.'
  },
  en: {
    'nav.tools':'All tools', 'nav.blog':'Blog',
    'hero.ey':'FREE TOOLS', 'hero.h1':'The tools you need,<br/>right here',
    'hero.p':'Free tools that run right in your browser — no install.<br/>Your input never leaves your device.',
    'search.ph':'Search tools… (e.g. count, date, QR)',
    'cat.전체':'All','cat.텍스트':'Text','cat.계산기':'Calculator','cat.생성기':'Generator','cat.변환기':'Converter','cat.이미지':'Image',
    'empty':'No results.',
    'foot.privacy':'All processing in your browser (nothing sent)', 'foot.blog':'Visit the blog →',
    'tool.char.t':'Character Counter','tool.char.d':'Live count: with/without spaces, words, lines.',
    'tool.date.t':'Age & D-Day Calculator','tool.date.d':'Korean age, D-Day, and days between dates.',
    'tool.qr.t':'QR Code Generator','tool.qr.d':'Turn a URL or text into a QR image.',
    'tool.pw.t':'Password Generator','tool.pw.d':'Strong random passwords, your way.',
    'tool.unit.t':'Unit Converter','tool.unit.d':'Convert length, weight, area, temperature.',
    'tool.color.t':'Color Converter','tool.color.d':'Convert between HEX, RGB and HSL with preview.',
    'tool.image.t':'Image Compressor','tool.image.d':'Shrink, resize and convert — no upload.',
    'tool.text.t':'Text Cleaner','tool.text.d':'Case, spaces, blank/duplicate lines, sorting.'
  },
  zh: {
    'nav.tools':'全部工具', 'nav.blog':'博客',
    'hero.ey':'免费工具', 'hero.h1':'你需要的工具，<br/>就在这里',
    'hero.p':'无需安装，直接在浏览器中使用的免费工具。<br/>你的输入不会离开本机。',
    'search.ph':'搜索工具…（如 字数、日期、二维码）',
    'cat.전체':'全部','cat.텍스트':'文本','cat.계산기':'计算器','cat.생성기':'生成器','cat.변환기':'转换器','cat.이미지':'图片',
    'empty':'没有搜索结果。',
    'foot.privacy':'全部在浏览器中处理（不发送数据）', 'foot.blog':'前往博客 →',
    'tool.char.t':'字数统计','tool.char.d':'实时统计：含/不含空格、单词、行数。',
    'tool.date.t':'年龄·倒数日计算','tool.date.d':'周岁年龄、倒数日、两日期间隔。',
    'tool.qr.t':'二维码生成器','tool.qr.d':'将网址或文本生成二维码并保存为图片。',
    'tool.pw.t':'密码生成器','tool.pw.d':'按需生成安全的随机密码。',
    'tool.unit.t':'单位换算','tool.unit.d':'长度·重量·面积·温度即时换算。',
    'tool.color.t':'颜色转换器','tool.color.d':'HEX·RGB·HSL 互转并预览。',
    'tool.image.t':'图片压缩·缩放','tool.image.d':'压缩·缩放·转格式，无需上传。',
    'tool.text.t':'文本整理','tool.text.d':'大小写、空格、空行/重复行、排序。'
  },
  ja: {
    'nav.tools':'すべてのツール', 'nav.blog':'ブログ',
    'hero.ey':'無料ツール', 'hero.h1':'必要なツールが<br/>ここに',
    'hero.p':'インストール不要、ブラウザですぐ使える無料ツール。<br/>入力内容は端末の外に出ません。',
    'search.ph':'ツールを検索…（例: 文字数、日付、QR）',
    'cat.전체':'すべて','cat.텍스트':'テキスト','cat.계산기':'計算','cat.생성기':'生成','cat.변환기':'変換','cat.이미지':'画像',
    'empty':'検索結果がありません。',
    'foot.privacy':'すべてブラウザ内で処理（送信なし）', 'foot.blog':'ブログへ →',
    'tool.char.t':'文字数カウント','tool.char.d':'空白あり/なし・単語・行を即時カウント。',
    'tool.date.t':'年齢・カウントダウン計算','tool.date.d':'満年齢・D-Day・日数差をまとめて。',
    'tool.qr.t':'QRコード作成','tool.qr.d':'URL・テキストをQRにして画像で保存。',
    'tool.pw.t':'パスワード生成','tool.pw.d':'条件に合った強力なパスワードを生成。',
    'tool.unit.t':'単位変換','tool.unit.d':'長さ・重さ・面積・温度を即変換。',
    'tool.color.t':'カラー変換','tool.color.d':'HEX・RGB・HSLを相互変換しプレビュー。',
    'tool.image.t':'画像圧縮・リサイズ','tool.image.d':'圧縮・リサイズ・変換、アップロード不要。',
    'tool.text.t':'テキスト整理','tool.text.d':'大文字小文字・空白・重複・並べ替え。'
  }
};
(function(){
  var SUP = ['ko','en','zh','ja'];
  function detect(){
    try{ var s = localStorage.getItem('lang'); if(s && SUP.indexOf(s)>=0) return s; }catch(e){}
    var n = (navigator.language || 'ko').slice(0,2).toLowerCase();
    return SUP.indexOf(n)>=0 ? n : 'ko';
  }
  var lang = detect();
  function dict(){ return window.I18N[lang] || window.I18N.ko; }
  window.t = function(k){ var d = dict(); return (d[k]!=null) ? d[k] : k; };
  window.curLang = function(){ return lang; };
  function apply(){
    var d = dict();
    document.documentElement.lang = (lang==='zh'?'zh-CN':lang==='ja'?'ja':lang);
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var v=d[el.getAttribute('data-i18n')]; if(v!=null) el.textContent=v; });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){ var v=d[el.getAttribute('data-i18n-html')]; if(v!=null) el.innerHTML=v; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ var v=d[el.getAttribute('data-i18n-ph')]; if(v!=null) el.placeholder=v; });
    var sel = document.getElementById('langsel'); if(sel) sel.value = lang;
    if(typeof window.onI18n === 'function') window.onI18n(lang);
  }
  window.setLang = function(l){ if(SUP.indexOf(l)<0) return; lang=l; try{localStorage.setItem('lang',l);}catch(e){} apply(); };
  if(document.readyState!=='loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
