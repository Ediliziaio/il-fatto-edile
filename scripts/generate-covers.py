#!/usr/bin/env python3
"""Genera le cover editoriali 1200x675 per i 30 articoli de Il Fatto Edile."""
import re
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/Users/agenteai/Documents/kimi/workspace/il-fatto-edile')
OUT = ROOT / 'public' / 'images' / 'covers'
OUT.mkdir(parents=True, exist_ok=True)

THEMES = {
    'brick':     ((124, 45, 18), (67, 20, 7)),
    'crane':     ((180, 83, 9), (69, 26, 3)),
    'blueprint': ((29, 78, 216), (23, 37, 84)),
    'concrete':  ((82, 82, 91), (24, 24, 27)),
    'green':     ((21, 128, 61), (5, 46, 22)),
    'steel':     ((3, 105, 161), (8, 47, 73)),
}
BADGE = {'top5': 'TOP 5', 'top10': 'TOP 10', 'news': 'NEWS'}

FONT_BOLD_CANDIDATES = [
    '/System/Library/Fonts/Supplemental/Georgia Bold.ttf',
    '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
]
FONT_REG_CANDIDATES = [
    '/System/Library/Fonts/Supplemental/Georgia.ttf',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
]

def pick(cands):
    for c in cands:
        if Path(c).exists():
            return c
    return None

FB, FR = pick(FONT_BOLD_CANDIDATES), pick(FONT_REG_CANDIDATES)
if not FB:
    raise SystemExit('Nessun font trovato')

def gradient(w, h, c1, c2):
    img = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(img)
    for x in range(w):
        for_frac = x / w
        r = int(c1[0] + (c2[0] - c1[0]) * for_frac)
        g = int(c1[1] + (c2[1] - c1[1]) * for_frac)
        b = int(c1[2] + (c2[2] - c1[2]) * for_frac)
        d.line([(x, 0), (x, h)], fill=(r, g, b))
    return img

def draw_grid(d, w, h, step=60):
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=(255, 255, 255, 14), width=1)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, 14), width=1)

def parse_articles():
    arts = []
    for f in ['articles-batch1.ts', 'articles-batch2.ts', 'articles-batch3.ts']:
        src = (ROOT / 'src' / 'data' / f).read_text()
        # un chunk per articolo: gli elementi array iniziano con "  {" a due spazi
        for chunk in src.split('\n  {\n')[1:]:
            slug = re.search(r"slug: '([^']+)',\s*\n\s*title:", chunk)
            title = re.search(r"title: '([^']+)'", chunk)
            fmt = re.search(r"format: '(\w+)'", chunk)
            theme = re.search(r"coverTheme: '(\w+)'", chunk)
            if not (slug and title and fmt and theme):
                continue
            t = title.group(1).replace('\\u2019', '\u2019')
            arts.append((slug.group(1), t, fmt.group(1), theme.group(1)))
    return arts

def make_cover(slug, title, fmt, theme):
    W, H = 1200, 675
    c1, c2 = THEMES.get(theme, THEMES['concrete'])
    img = gradient(W, H, c1, c2)
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    draw_grid(od, W, H)
    od.rectangle([0, H - 150, W, H], fill=(0, 0, 0, 110))
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    d = ImageDraw.Draw(img)

    # badge formato
    badge_font = ImageFont.truetype(FB, 26)
    badge = BADGE.get(fmt, fmt.upper())
    bw = d.textlength(badge, font=badge_font)
    d.rectangle([56, 52, 56 + bw + 36, 96], fill=(255, 255, 255))
    d.text((56 + 18, 60), badge, font=badge_font, fill=(20, 20, 20))

    # titolo
    size = 62
    while size > 34:
        f = ImageFont.truetype(FB, size)
        lines = textwrap.wrap(title, width=max(18, int(1050 / (size * 0.52))))
        if len(lines) <= 4:
            break
        size -= 2
    f = ImageFont.truetype(FB, size)
    y = H - 130 - len(lines) * (size + 12)
    for ln in lines:
        d.text((56, y), ln, font=f, fill=(255, 255, 255))
        y += size + 12

    # riga brand
    d.rectangle([56, H - 96, 66, H - 46], fill=(185, 28, 28))
    brand_font = ImageFont.truetype(FB, 34)
    d.text((84, H - 88), 'IL FATTO EDILE', font=brand_font, fill=(255, 255, 255))
    if FR:
        sub = ImageFont.truetype(FR, 22)
        d.text((84, H - 48), 'ilfattoedile.it', font=sub, fill=(220, 220, 220))

    img.convert('RGB').save(OUT / f'{slug}.jpg', 'JPEG', quality=82)

arts = parse_articles()
for a in arts:
    make_cover(*a)
print(f'Cover generate: {len(arts)} in {OUT}')
