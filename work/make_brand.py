"""Derive web brand files from the supplied DotrixAI assets (work/brand-src).
Only crops, scales and recolours. Logo geometry is never redrawn.
  asset_2  black lockup on transparent  -> nav logo, white footer logo
  asset_5  black mark on transparent    -> mark, favicons
  asset_3  white mark on transparent    -> mark for dark surfaces
Usage: python work/make_brand.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "work" / "brand-src"
OUT = ROOT / "public" / "brand"
PUB = ROOT / "public"
OUT.mkdir(parents=True, exist_ok=True)
IVORY = (240, 238, 230, 255)
SLATE = (20, 20, 19, 255)

def trim(im, pad=0):
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(box)
    if pad:
        c = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
        c.paste(im, (pad, pad)); im = c
    return im

def tint(im, rgb):
    a = im.getchannel("A")
    solid = Image.new("RGBA", im.size, rgb + (255,))
    solid.putalpha(a)
    return solid

def height(im, h):
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)

lockup = trim(Image.open(SRC / "asset_2.png").convert("RGBA"))
mark = trim(Image.open(SRC / "asset_5.png").convert("RGBA"))
mark_light = trim(Image.open(SRC / "asset_3.png").convert("RGBA"))

height(tint(lockup, SLATE[:3]), 120).save(OUT / "dotrixai-logo.png", optimize=True)
height(tint(lockup, IVORY[:3]), 120).save(OUT / "dotrixai-logo-light.png", optimize=True)
height(tint(mark, SLATE[:3]), 256).save(OUT / "dotrixai-mark.png", optimize=True)
height(tint(mark_light, IVORY[:3]), 256).save(OUT / "dotrixai-mark-light.png", optimize=True)

def icon(size, bg=IVORY, radius=0.22, scale=0.66):
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle((0, 0, size - 1, size - 1), radius=round(size * radius), fill=bg)
    m = tint(mark, SLATE[:3])
    m = m.resize((round(m.width * size * scale / m.height), round(size * scale)), Image.LANCZOS)
    c.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return c

icon(32, scale=0.72).save(PUB / "favicon-32.png", optimize=True)
icon(180, radius=0).save(PUB / "apple-touch-icon.png", optimize=True)
icon(192).save(PUB / "icon-192.png", optimize=True)
icon(512).save(PUB / "icon-512.png", optimize=True)
icon(64, scale=0.72).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

# Open Graph card: ivory field, lockup, one line of positioning.
og = Image.new("RGBA", (1200, 630), IVORY)
lg = height(tint(lockup, SLATE[:3]), 132)
og.alpha_composite(lg, (96, 200))
try:
    font = ImageFont.truetype("georgia.ttf", 40)
except OSError:
    font = ImageFont.load_default()
ImageDraw.Draw(og).text((100, 392), "Independent AI research lab", font=font, fill=(61, 61, 58, 255))
ImageDraw.Draw(og).text((100, 448), "dotrixai.com", font=font, fill=(135, 134, 127, 255))
og.convert("RGB").save(PUB / "og.png", optimize=True)
for p in sorted(OUT.iterdir()):
    print(p.name, Image.open(p).size)
