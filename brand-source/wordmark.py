"""Convert BALZEE (and the tagline) to outline paths.

Uses Space Grotesk — SIL OFL 1.1, which permits derivative works including
logotypes. Outlining removes any runtime font dependency from the logo.
"""

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

FONT = "/home/claude/balzee/src/app/fonts/SpaceGrotesk-Variable.woff2"


def load(weight: float) -> TTFont:
    f = TTFont(FONT)
    return instantiateVariableFont(f, {"wght": weight}, inplace=False)


def text_path(text: str, weight: float, cap_height: float, tracking_em: float):
    """Return (path_d, ink_width, cap_height).

    Baseline sits at y=0 and the *ink* (not the sidebearing) starts at x=0.
    Logotypes are aligned on their ink, and measuring the advance width instead
    is what clips the final glyph.
    """
    font = load(weight)
    upem = font["head"].unitsPerEm
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    # Scale so the cap height (not the em) matches the requested size — that is
    # what makes the wordmark align optically with the monogram.
    os2 = font["OS/2"]
    caps = getattr(os2, "sCapHeight", None) or int(upem * 0.7)
    scale = cap_height / caps
    track = tracking_em * upem

    placed = []          # (glyph_name, pen_x)
    x = 0.0
    for i, ch in enumerate(text):
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit(f"missing glyph for {ch!r}")
        if ch != " ":
            placed.append((name, x))
        x += hmtx[name][0] + (track if i < len(text) - 1 else 0)

    # True ink bounds across the whole run.
    bounds = BoundsPen(glyph_set)
    for name, px in placed:
        glyph_set[name].draw(TransformPen(bounds, Transform(1, 0, 0, 1, px, 0)))
    if bounds.bounds is None:
        raise SystemExit("no ink")
    xmin, _, xmax, _ = bounds.bounds

    parts = []
    for name, px in placed:
        pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.2f}")
        # shift so ink starts at 0, flip Y, then scale to the target cap height
        tp = TransformPen(pen, Transform(scale, 0, 0, -scale, (px - xmin) * scale, 0))
        glyph_set[name].draw(tp)
        d = pen.getCommands()
        if d:
            parts.append(d)

    return " ".join(parts), (xmax - xmin) * scale, cap_height


if __name__ == "__main__":
    d, w, h = text_path("BALZEE", 500, 100, 0.26)
    print("wordmark width", round(w, 1), "for cap height", h)
    print("path chars", len(d))
    t, tw, th = text_path("CREATIVE SYSTEMS. REAL RESULTS.", 400, 100, 0.20)
    print("tagline width", round(tw, 1))
