# 언어별 OG 소셜 카드 생성: og.png(ko) + og-en/zh/ja.png. (Pillow)
# 로고(그라데이션 사각+별)는 공통, 브랜드/표제/부제만 언어별. CJK 폰트 사용.
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = "C:/gemini2k/tools"
W, H = 1200, 630
FONTS = "C:/Windows/Fonts/"

LANGS = {
    "":   {"bd": "malgunbd.ttf", "rg": "malgun.ttf",  "brand": "빛의여행(gemini2k) 도구",
           "l1": "필요한 도구,", "l2": "바로 여기",
           "sub": "글자수 · QR · 단위 · 이미지 · PDF · 개발자 · 개인정보 · GIS", "out": "og.png"},
    "en": {"bd": "malgunbd.ttf", "rg": "malgun.ttf",  "brand": "gemini2k Tools",
           "l1": "The tools you need,", "l2": "right here",
           "sub": "Text · QR · Units · Image · PDF · Developer · Privacy · GIS", "out": "og-en.png"},
    "zh": {"bd": "msyhbd.ttc",   "rg": "msyh.ttc",     "brand": "gemini2k 工具",
           "l1": "你需要的工具，", "l2": "就在这里",
           "sub": "字数 · 二维码 · 单位 · 图片 · PDF · 开发 · 隐私 · GIS", "out": "og-zh.png"},
    "ja": {"bd": "YuGothB.ttc",  "rg": "YuGothM.ttc",  "brand": "gemini2k ツール",
           "l1": "必要なツールが、", "l2": "ここに",
           "sub": "文字数 · QR · 単位 · 画像 · PDF · 開発 · プライバシー · GIS", "out": "og-ja.png"},
}

def font(name, size):
    try: return ImageFont.truetype(FONTS + name, size)
    except Exception:
        try: return ImageFont.truetype(FONTS + "malgunbd.ttf", size)
        except Exception: return ImageFont.load_default()

def fit(d, text, fpath, size, maxw):
    while size > 20:
        f = font(fpath, size)
        if d.textlength(text, font=f) <= maxw: return f
        size -= 4
    return font(fpath, size)

def draw_logo(img, d):
    sq, gx, gy = 60, 80, 74
    c1, c2 = (21, 195, 154), (61, 123, 240)
    grad = Image.new("RGB", (sq, sq))
    for y in range(sq):
        for x in range(sq):
            tt = (x + y) / (2 * sq)
            grad.putpixel((x, y), tuple(int(c1[i] + (c2[i] - c1[i]) * tt) for i in range(3)))
    mask = Image.new("L", (sq, sq), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sq - 1, sq - 1], radius=15, fill=255)
    img.paste(grad, (gx, gy), mask)
    fct = sq / 32.0
    spark = [(25.5,3.6),(26.5,6.5),(29.4,7.5),(26.5,8.5),(25.5,11.4),(24.5,8.5),(21.6,7.5),(24.5,6.5)]
    d.polygon([(gx + x*fct, gy + y*fct) for (x, y) in spark], fill="#FFFFFF")
    d.text((gx + 15.5*fct, gy + 18*fct), "G2K", font=font("malgunbd.ttf", 26), fill="#FFFFFF", anchor="mm")
    return gx + sq + 20

def build(cfg):
    img = Image.new("RGB", (W, H), "#FFFFFF")
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 12], fill="#1AA3E0")
    bx = draw_logo(img, d)
    d.text((bx, 82), cfg["brand"], font=fit(d, cfg["brand"], cfg["bd"], 40, W - bx - 60), fill="#16181F")
    d.text((80, 200), cfg["l1"], font=fit(d, cfg["l1"], cfg["bd"], 92, W - 160), fill="#16181F")
    d.text((80, 310), cfg["l2"], font=fit(d, cfg["l2"], cfg["bd"], 92, W - 160), fill="#1AA3E0")
    d.text((80, 450), cfg["sub"], font=fit(d, cfg["sub"], cfg["rg"], 40, W - 160), fill="#6B7280")
    d.text((80, 540), "gemini2k.co.kr", font=font("malgunbd.ttf", 36), fill="#1AA3E0")
    img.save(os.path.join(ROOT, cfg["out"]))
    return cfg["out"]

if __name__ == "__main__":
    made = [build(LANGS[k]) for k in LANGS]
    print("OG 생성:", ", ".join(made))
