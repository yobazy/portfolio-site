"""Build the site icon set from one geometry.

The mark is a lowercase "b": the stem is a text caret, precise and
off-white; the bowl is a single amber pen stroke that loops out and
overshoots past the caret at the baseline. Software and hand, one letter.
Care in craft.

Everything lives on a 64-unit grid. The caret's edges sit on multiples of 4
so it lands on whole pixels at 16px and 32px.

Writes public/favicon.svg and rasterises the PNG/ICO sizes with Pillow
(supersampled, no browser needed). Needs Python 3 with Pillow
(`pip install pillow`). Run with `npm run icons`.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

PUBLIC = Path(__file__).resolve().parents[2] / "public"

BG = "#080808"
INK = "#F0F0ED"
ACCENT = "#E8A400"

# Geometry, in grid units.
CARET = (16, 8, 24, 56)         # x0, y0, x1, y1
CARET_RADIUS = 1
# The pen stroke: a start point, then cubic segments (c1, c2, end).
STROKE_START = (24, 30)
STROKE = [
    ((34, 22), (49, 26), (49, 40)),
    ((49, 53), (36, 57), (26, 53)),
    ((21, 51), (16, 52), (12, 55)),
]
STROKE_WIDTH = 7
GLOW = 2.2                      # blur std deviation
GLOW_OPACITY = 0.55
TILE_RADIUS = 14


def _pt(p):
    return f"{p[0]} {p[1]}"


def svg():
    x0, y0, x1, y1 = CARET
    d = f"M{_pt(STROKE_START)}" + "".join(f"C{_pt(a)} {_pt(b)} {_pt(c)}" for a, b, c in STROKE)
    stroke = f'd="{d}" fill="none" stroke="{ACCENT}" stroke-width="{STROKE_WIDTH}" stroke-linecap="round"'
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        "<title>Bazil K.</title>"
        "<defs>"
        f'<clipPath id="tile"><rect width="64" height="64" rx="{TILE_RADIUS}"/></clipPath>'
        '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">'
        f'<feGaussianBlur stdDeviation="{GLOW}"/></filter>'
        "</defs>"
        '<g clip-path="url(#tile)">'
        f'<rect width="64" height="64" fill="{BG}"/>'
        f'<path {stroke} filter="url(#glow)" opacity="{GLOW_OPACITY}"/>'
        f"<path {stroke}/>"
        f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="{CARET_RADIUS}" fill="{INK}"/>'
        "</g></svg>\n"
    )


def _stroke_points(steps=64):
    points = [STROKE_START]
    p0 = STROKE_START
    for c1, c2, p3 in STROKE:
        for i in range(1, steps + 1):
            t = i / steps
            u = 1 - t
            points.append(tuple(
                u**3 * p0[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t**3 * p3[k]
                for k in (0, 1)
            ))
        p0 = p3
    return points


def raster(size, rounded=True, scale=1.0, ss=16):
    px = size * ss
    unit = px / 64

    def at(p):
        return tuple((32 + (v - 32) * scale) * unit for v in p)

    def mask(draw_fn):
        m = Image.new("L", (px, px), 0)
        draw_fn(ImageDraw.Draw(m))
        return m

    # A polyline with a disc at every vertex gives round joins and caps.
    def draw_stroke(d):
        pts = [at(p) for p in _stroke_points()]
        r = STROKE_WIDTH / 2 * scale * unit
        d.line(pts, fill=255, width=round(2 * r))
        for x, y in pts:
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)

    stroke = mask(draw_stroke)
    glow = stroke.filter(ImageFilter.GaussianBlur(GLOW * scale * unit))
    glow = glow.point(lambda v: round(v * GLOW_OPACITY))

    # Pillow's shape bounds are inclusive; stop one supersample short.
    x0, y0 = at(CARET[:2])
    x1, y1 = at(CARET[2:])
    caret = mask(lambda d: d.rounded_rectangle(
        [x0, y0, x1 - 1, y1 - 1], radius=CARET_RADIUS * scale * unit, fill=255))

    tile = mask(
        (lambda d: d.rounded_rectangle([0, 0, px - 1, px - 1], radius=TILE_RADIUS * unit, fill=255))
        if rounded
        else (lambda d: d.rectangle([0, 0, px - 1, px - 1], fill=255))
    )
    img = Image.new("RGBA", (px, px), BG)
    img.paste(ACCENT, mask=glow)
    img.paste(ACCENT, mask=stroke)
    img.paste(INK, mask=caret)
    img.putalpha(tile)
    # Area average: LANCZOS rings on hard edges and tints the ink.
    img = img.resize((size, size), Image.BOX)
    return img if rounded else img.convert("RGB")


def main():
    (PUBLIC / "favicon.svg").write_text(svg())
    # Tabs and bookmarks: the rounded tile, transparent corners.
    ico = [raster(s) for s in (16, 32, 48)]
    ico[-1].save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:-1])
    # Install prompts and shortcuts ("any"): the tile as-is.
    raster(192).save(PUBLIC / "logo192.png", optimize=True)
    raster(512).save(PUBLIC / "logo512.png", optimize=True)
    # iOS rounds its own corners; Android masks to its own shape.
    raster(180, rounded=False, scale=0.86).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    raster(512, rounded=False, scale=0.72).save(PUBLIC / "logo-maskable-512.png", optimize=True)


if __name__ == "__main__":
    main()
