"""도구 사이트 SEO 빌드 (로컬 1회 실행).
- 각 *.html <head> 에 canonical + OG + Twitter 메타 주입(멱등)
- sitemap.xml / robots.txt 생성
- og.png (소셜 공유 카드) 생성 (Pillow + 맑은 고딕)
실행: python deploy/seo_build.py  (tools 디렉터리에서)
"""
import re, glob, os, io

BASE = "https://gemini2k.co.kr"
SITE = "빛의여행(gemini2k) 도구"
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # tools/
PAGES = [f for f in sorted(glob.glob(os.path.join(HERE, "*.html")))]

def canon(fname):
    return BASE + "/" if fname == "index.html" else BASE + "/" + fname

def inject(path):
    html = open(path, encoding="utf-8").read()
    fname = os.path.basename(path)
    if 'rel="canonical"' in html:
        return False  # 이미 적용됨
    m_t = re.search(r"<title>(.*?)</title>", html, re.S)
    m_d = re.search(r'<meta name="description" content="(.*?)"\s*/?>', html, re.S)
    title = (m_t.group(1).strip() if m_t else SITE)
    desc = (m_d.group(1).strip() if m_d else "")
    url = canon(fname)
    block = (
        f'\n<link rel="canonical" href="{url}"/>'
        f'\n<meta property="og:type" content="website"/>'
        f'\n<meta property="og:site_name" content="{SITE}"/>'
        f'\n<meta property="og:title" content="{title}"/>'
        f'\n<meta property="og:description" content="{desc}"/>'
        f'\n<meta property="og:url" content="{url}"/>'
        f'\n<meta property="og:image" content="{BASE}/og.png"/>'
        f'\n<meta name="twitter:card" content="summary_large_image"/>'
        f'\n<meta name="twitter:title" content="{title}"/>'
        f'\n<meta name="twitter:description" content="{desc}"/>'
        f'\n<meta name="twitter:image" content="{BASE}/og.png"/>'
    )
    # description 메타 뒤에 삽입 (없으면 </title> 뒤)
    if m_d:
        html = html[:m_d.end()] + block + html[m_d.end():]
    elif m_t:
        html = html[:m_t.end()] + block + html[m_t.end():]
    open(path, "w", encoding="utf-8").write(html)
    return True

def build_sitemap():
    locs = [canon(os.path.basename(p)) for p in PAGES]
    body = "\n".join("<url><loc>%s</loc></url>" % u for u in locs)
    sm = ('<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          + body + "\n</urlset>\n")
    open(os.path.join(HERE, "sitemap.xml"), "w", encoding="utf-8").write(sm)
    open(os.path.join(HERE, "robots.txt"), "w", encoding="utf-8").write(
        "User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % BASE)

def build_og():
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#FFFFFF")
    d = ImageDraw.Draw(img)
    # 상단 인디고 바
    d.rectangle([0, 0, W, 12], fill="#1AA3E0")
    def font(path, size):
        try: return ImageFont.truetype(path, size)
        except Exception: return ImageFont.load_default()
    bd = "C:/Windows/Fonts/malgunbd.ttf"; rg = "C:/Windows/Fonts/malgun.ttf"
    f_brand = font(bd, 40); f_title = font(bd, 92); f_sub = font(rg, 40); f_url = font(bd, 36)
    # 빛(별) 마크 — 녹색→파랑 그라데이션 사각 + 흰 별 + 브랜드 텍스트
    sq, gx, gy = 60, 80, 74
    c1, c2 = (21, 195, 154), (61, 123, 240)   # green → blue
    grad = Image.new("RGB", (sq, sq))
    for y in range(sq):
        for x in range(sq):
            tt = (x + y) / (2 * sq)
            grad.putpixel((x, y), tuple(int(c1[i] + (c2[i] - c1[i]) * tt) for i in range(3)))
    mask = Image.new("L", (sq, sq), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sq - 1, sq - 1], radius=15, fill=255)
    img.paste(grad, (gx, gy), mask)
    f = sq / 32.0
    star_vb = [(16,3.5),(18,13.5),(28.5,16),(18,18.5),(16,28.5),(14,18.5),(3.5,16),(14,13.5)]
    d.polygon([(gx + x*f, gy + y*f) for (x, y) in star_vb], fill="#FFFFFF")
    r = 1.7*f; cxx, cyy = gx+23.5*f, gy+9*f
    d.ellipse([cxx-r, cyy-r, cxx+r, cyy+r], fill="#FFFFFF")
    d.text((gx + sq + 20, 82), SITE, font=f_brand, fill="#16181F")
    d.text((80, 200), "필요한 도구,", font=f_title, fill="#16181F")
    d.text((80, 310), "바로 여기", font=f_title, fill="#1AA3E0")
    d.text((80, 450), "글자수 · 날짜 · QR · 비밀번호 · 단위 · 색상 · 이미지 · 텍스트", font=f_sub, fill="#6B7280")
    d.text((80, 540), "gemini2k.co.kr", font=f_url, fill="#1AA3E0")
    img.save(os.path.join(HERE, "og.png"))

if __name__ == "__main__":
    n = sum(1 for p in PAGES if inject(p))
    build_sitemap()
    build_og()
    print(f"메타 주입: {n}개 페이지 / sitemap·robots·og.png 생성 완료")
    print("페이지:", [os.path.basename(p) for p in PAGES])
