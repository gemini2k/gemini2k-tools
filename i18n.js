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
    'tool.text.t':'텍스트 정리 도구','tool.text.d':'대소문자, 공백·빈 줄·중복 정리, 줄 정렬 등.',
    'tool.base64.t':'Base64 인코더·디코더','tool.base64.d':'텍스트 ↔ Base64 인코딩/디코딩 (UTF-8).',
    'tool.lotto.t':'로또 번호 생성기','tool.lotto.d':'로또 6/45 번호를 5게임 무작위 생성.',
    'back':'← 전체 도구','foot.more':'다른 도구 보기 →','foot.tail':'· 모든 처리는 브라우저에서',
    'toast.copied':'복사됐습니다','toast.nocopy':'복사할 내용이 없습니다',
    'char.sub':'공백 포함/제외, 단어·줄·원고지 매수를 실시간으로 보여줍니다.','char.label':'텍스트 입력','char.ph':'여기에 글을 붙여넣거나 입력하세요…',
    'char.copy':'📋 텍스트 복사','char.clear':'지우기','char.hint':'입력한 내용은 서버로 전송되지 않고 브라우저에서만 계산됩니다.',
    'char.s.all':'글자수 (공백 포함)','char.s.nospace':'글자수 (공백 제외)','char.s.word':'단어 수','char.s.line':'줄 수','char.s.manu':'원고지 (200자)','char.s.byte':'바이트 (UTF-8)',
    'btn.clear':'지우기',
    'b64.sub':'텍스트를 Base64로 인코딩하거나, Base64를 원래 텍스트로 디코딩합니다. (한글 UTF-8 지원)','b64.in':'입력','b64.inph':'텍스트 또는 Base64 문자열을 입력하세요…','b64.enc':'인코딩 →','b64.dec':'← 디코딩','b64.out':'결과','b64.outph':'결과가 여기에 표시됩니다.','b64.copy':'📋 결과 복사','b64.hint':'모든 처리는 브라우저에서만 이루어집니다.','b64.noinput':'입력을 넣어주세요','b64.badb64':'올바른 Base64가 아닙니다','b64.failed':'변환 실패',
    'lot.sub':'1~45 중 6개를 무작위로 뽑아 5게임을 생성합니다.','lot.gen':'🎲 번호 생성','lot.copy':'📋 복사','lot.hint':'재미로 즐기세요. 당첨을 보장하지 않으며, 암호학적 난수로 공정하게 추첨합니다.','lot.nogen':'먼저 번호를 생성하세요'
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
    'tool.text.t':'Text Cleaner','tool.text.d':'Case, spaces, blank/duplicate lines, sorting.',
    'tool.base64.t':'Base64 Encoder/Decoder','tool.base64.d':'Encode/decode text ↔ Base64 (UTF-8).',
    'tool.lotto.t':'Lotto Number Generator','tool.lotto.d':'Random 6/45 lotto numbers, 5 games.',
    'back':'← All tools','foot.more':'More tools →','foot.tail':'· All processing in your browser',
    'toast.copied':'Copied','toast.nocopy':'Nothing to copy',
    'char.sub':'Counts characters (with/without spaces), words, lines and manuscript pages in real time.','char.label':'Text input','char.ph':'Paste or type your text here…',
    'char.copy':'📋 Copy text','char.clear':'Clear','char.hint':'Your text is never sent to a server — everything is computed in your browser.',
    'char.s.all':'Characters (with spaces)','char.s.nospace':'Characters (no spaces)','char.s.word':'Words','char.s.line':'Lines','char.s.manu':'Manuscript (200 chars)','char.s.byte':'Bytes (UTF-8)',
    'btn.clear':'Clear',
    'b64.sub':'Encode text to Base64, or decode Base64 back to text. (UTF-8 safe)','b64.in':'Input','b64.inph':'Enter text or a Base64 string…','b64.enc':'Encode →','b64.dec':'← Decode','b64.out':'Result','b64.outph':'The result appears here.','b64.copy':'📋 Copy result','b64.hint':'All processing happens in your browser only.','b64.noinput':'Enter some input','b64.badb64':'Not valid Base64','b64.failed':'Conversion failed',
    'lot.sub':'Picks 6 of 1–45 at random and generates 5 games.','lot.gen':'🎲 Generate','lot.copy':'📋 Copy','lot.hint':'Just for fun — winning is not guaranteed. Drawn fairly with a cryptographic RNG.','lot.nogen':'Generate numbers first'
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
    'tool.text.t':'文本整理','tool.text.d':'大小写、空格、空行/重复行、排序。',
    'tool.base64.t':'Base64 编解码','tool.base64.d':'文本 ↔ Base64 编码/解码（UTF-8）。',
    'tool.lotto.t':'乐透号码生成器','tool.lotto.d':'随机生成 6/45 乐透号码，共 5 组。',
    'back':'← 全部工具','foot.more':'更多工具 →','foot.tail':'· 全部在浏览器中处理',
    'toast.copied':'已复制','toast.nocopy':'没有可复制的内容',
    'char.sub':'实时统计含/不含空格的字数、单词、行数与稿纸张数。','char.label':'输入文本','char.ph':'在此粘贴或输入文本…',
    'char.copy':'📋 复制文本','char.clear':'清除','char.hint':'输入内容不会发送到服务器，全部在浏览器中计算。',
    'char.s.all':'字数（含空格）','char.s.nospace':'字数（不含空格）','char.s.word':'单词数','char.s.line':'行数','char.s.manu':'稿纸（200字）','char.s.byte':'字节 (UTF-8)',
    'btn.clear':'清除',
    'b64.sub':'将文本编码为 Base64，或将 Base64 解码为原文。（支持中文 UTF-8）','b64.in':'输入','b64.inph':'输入文本或 Base64 字符串…','b64.enc':'编码 →','b64.dec':'← 解码','b64.out':'结果','b64.outph':'结果将显示在此处。','b64.copy':'📋 复制结果','b64.hint':'所有处理仅在浏览器中进行。','b64.noinput':'请输入内容','b64.badb64':'不是有效的 Base64','b64.failed':'转换失败',
    'lot.sub':'从 1~45 中随机抽取 6 个，生成 5 组号码。','lot.gen':'🎲 生成号码','lot.copy':'📋 复制','lot.hint':'仅供娱乐，不保证中奖。使用密码学随机数公平抽取。','lot.nogen':'请先生成号码'
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
    'tool.text.t':'テキスト整理','tool.text.d':'大文字小文字・空白・重複・並べ替え。',
    'tool.base64.t':'Base64 エンコード/デコード','tool.base64.d':'テキスト ↔ Base64 変換（UTF-8）。',
    'tool.lotto.t':'ロト番号ジェネレーター','tool.lotto.d':'ロト6/45 を5ゲーム自動生成。',
    'back':'← すべてのツール','foot.more':'他のツール →','foot.tail':'· すべてブラウザ内で処理',
    'toast.copied':'コピーしました','toast.nocopy':'コピーする内容がありません',
    'char.sub':'空白あり/なしの文字数・単語・行・原稿用紙の枚数をリアルタイム表示。','char.label':'テキスト入力','char.ph':'ここに貼り付けるか入力してください…',
    'char.copy':'📋 テキストをコピー','char.clear':'クリア','char.hint':'入力内容はサーバーに送信されず、ブラウザ内だけで計算されます。',
    'char.s.all':'文字数（空白含む）','char.s.nospace':'文字数（空白除く）','char.s.word':'単語数','char.s.line':'行数','char.s.manu':'原稿用紙（200字）','char.s.byte':'バイト (UTF-8)',
    'btn.clear':'クリア',
    'b64.sub':'テキストを Base64 にエンコード、または Base64 を元のテキストにデコードします。（日本語 UTF-8 対応）','b64.in':'入力','b64.inph':'テキストまたは Base64 文字列を入力…','b64.enc':'エンコード →','b64.dec':'← デコード','b64.out':'結果','b64.outph':'ここに結果が表示されます。','b64.copy':'📋 結果をコピー','b64.hint':'すべての処理はブラウザ内のみで行われます。','b64.noinput':'入力してください','b64.badb64':'正しい Base64 ではありません','b64.failed':'変換に失敗しました',
    'lot.sub':'1〜45 から6個をランダムに選び、5ゲーム生成します。','lot.gen':'🎲 番号生成','lot.copy':'📋 コピー','lot.hint':'お楽しみ用です。当選は保証されません。暗号学的乱数で公正に抽選します。','lot.nogen':'先に番号を生成してください'
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
    var sel = document.getElementById('langsel');
    if(sel){ sel.value = lang; if(!sel._bound){ sel._bound = 1; sel.addEventListener('change', function(){ setLang(sel.value); }); } }
    if(typeof window.onI18n === 'function') window.onI18n(lang);
  }
  window.setLang = function(l){ if(SUP.indexOf(l)<0) return; lang=l; try{localStorage.setItem('lang',l);}catch(e){} apply(); };
  if(document.readyState!=='loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
