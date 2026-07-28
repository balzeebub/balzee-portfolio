"""Balzee brand asset generator.

Emits every logo variant as clean, hand-computed SVG into public/branding.
The monogram is defined once, in tight-box coordinates (72 x 106), and every
lockup positions that same geometry — so nothing can drift out of sync.
"""

import json
import pathlib
import re

from wordmark import text_path

OUT = pathlib.Path("/home/claude/balzee/public/branding")
OUT.mkdir(parents=True, exist_ok=True)

# ── The monogram ─────────────────────────────────────────────────────────────
# Origin at the glyph's top-left. Every diagonal is exactly 45 degrees.
MARK_W, MARK_H = 72, 106

MARK_OUTER = "M0,0 H46 L64,18 V37 L48,53 L72,77 V88 L54,106 H0 Z"
MARK_COUNTERS = "M24,18 L50,31 L24,44 Z M24,62 L56,75 L24,88 Z"
MARK_D = f"{MARK_OUTER} {MARK_COUNTERS}"

INK = "#0F0F0F"
PAPER = "#FFFFFF"
ACCENT = "#22C55E"
MUTED_ON_DARK = "#A8A8A8"
MUTED_ON_LIGHT = "#6B6B6B"

TAGLINE = "CREATIVE SYSTEMS. REAL RESULTS."


def num(v: float) -> str:
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return s if s else "0"


def svg_open(w: float, h: float, title: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(w)} {num(h)}" '
        f'width="{num(w)}" height="{num(h)}" role="img" aria-label="{title}">'
        f"<title>{title}</title>"
    )


def mark_group(fill: str, x=0.0, y=0.0, scale=1.0) -> str:
    tf = ""
    if (x, y) != (0, 0) or scale != 1:
        tf = f' transform="translate({num(x)} {num(y)}) scale({num(scale)})"'
    return f'<path{tf} fill="{fill}" fill-rule="evenodd" d="{MARK_D}"/>'


def shift(d: str, dx: float, dy: float) -> str:
    """Wrap a path in a translate rather than rewriting coordinates."""
    return f'transform="translate({num(dx)} {num(dy)})"' if (dx or dy) else ""


# ── Cached text outlines ─────────────────────────────────────────────────────
WORD_CAP = 100.0
WORD_D, WORD_W, _ = text_path("BALZEE", 500, WORD_CAP, 0.26)
TAG_CAP = 100.0
TAG_D, TAG_W, _ = text_path(TAGLINE, 400, TAG_CAP, 0.20)


def word_group(fill: str, cap: float, x: float, baseline: float) -> str:
    s = cap / WORD_CAP
    return (
        f'<g transform="translate({num(x)} {num(baseline)}) scale({num(s)})">'
        f'<path fill="{fill}" d="{WORD_D}"/></g>'
    )


def tag_group(fill: str, cap: float, x: float, baseline: float) -> str:
    s = cap / TAG_CAP
    return (
        f'<g transform="translate({num(x)} {num(baseline)}) scale({num(s)})">'
        f'<path fill="{fill}" d="{TAG_D}"/></g>'
    )


def word_width(cap: float) -> float:
    return WORD_W * cap / WORD_CAP


def tag_width(cap: float) -> float:
    return TAG_W * cap / TAG_CAP


# ── Lockups ──────────────────────────────────────────────────────────────────
def build_mark(fill: str, pad: float = 0.0) -> str:
    w, h = MARK_W + pad * 2, MARK_H + pad * 2
    return svg_open(w, h, "Balzee") + mark_group(fill, pad, pad) + "</svg>"


def build_wordmark(fill: str) -> str:
    cap = 100.0
    w, h = word_width(cap), cap
    return svg_open(w, h, "Balzee") + word_group(fill, cap, 0, cap) + "</svg>"


def build_horizontal(fill: str, muted: str, tagline: bool) -> str:
    """Mark, hairline rule, then the wordmark (optionally over the tagline)."""
    mark_h = MARK_H
    word_cap = 44.0
    tag_cap = 9.0
    gap_a = 30.0          # mark → rule
    gap_b = 30.0          # rule → text
    rule_w = 1.5
    lead = 17.0           # wordmark baseline → tagline cap top

    ww = word_width(word_cap)
    tw = tag_width(tag_cap) if tagline else 0.0
    text_w = max(ww, tw)

    text_h = word_cap + (lead + tag_cap if tagline else 0)
    h = mark_h
    text_top = (h - text_h) / 2

    x_rule = MARK_W + gap_a
    x_text = x_rule + rule_w + gap_b
    w = x_text + text_w

    parts = [svg_open(w, h, "Balzee — Marketing Virtual Assistant")]
    parts.append(mark_group(fill))
    rule_h = mark_h * 0.72
    parts.append(
        f'<rect x="{num(x_rule)}" y="{num((h - rule_h) / 2)}" '
        f'width="{num(rule_w)}" height="{num(rule_h)}" fill="{muted}" opacity="0.45"/>'
    )
    parts.append(word_group(fill, word_cap, x_text, text_top + word_cap))
    if tagline:
        parts.append(
            tag_group(muted, tag_cap, x_text, text_top + word_cap + lead + tag_cap)
        )
    parts.append("</svg>")
    return "".join(parts)


def build_horizontal_compact(fill: str) -> str:
    """Mark plus wordmark, optically centred — the workhorse for navbars."""
    word_cap = 40.0
    gap = 26.0
    ww = word_width(word_cap)
    h = MARK_H
    w = MARK_W + gap + ww
    # Nudge the wordmark up a hair: caps read low against a full-height mark.
    baseline = (h + word_cap) / 2 - 1
    return (
        svg_open(w, h, "Balzee")
        + mark_group(fill)
        + word_group(fill, word_cap, MARK_W + gap, baseline)
        + "</svg>"
    )


def build_vertical(fill: str, muted: str, tagline: bool) -> str:
    word_cap = 46.0
    tag_cap = 9.1
    gap = 34.0            # mark → wordmark
    lead = 16.0

    ww = word_width(word_cap)
    tw = tag_width(tag_cap) if tagline else 0.0
    w = max(MARK_W, ww, tw)

    h = MARK_H + gap + word_cap + ((lead + tag_cap) if tagline else 0)

    parts = [svg_open(w, h, "Balzee — Marketing Virtual Assistant")]
    parts.append(mark_group(fill, (w - MARK_W) / 2, 0))
    base = MARK_H + gap + word_cap
    parts.append(word_group(fill, word_cap, (w - ww) / 2, base))
    if tagline:
        parts.append(tag_group(muted, tag_cap, (w - tw) / 2, base + lead + tag_cap))
    parts.append("</svg>")
    return "".join(parts)


def build_icon(size: float = 128, radius: float = 28, bg: str = INK,
               fg: str = PAPER, glow: bool = True) -> str:
    """Rounded-square app icon / favicon. The mark is inset to ~62% so it keeps
    a proper keyline at small sizes."""
    target_h = size * 0.60
    s = target_h / MARK_H
    mw, mh = MARK_W * s, MARK_H * s
    x, y = (size - mw) / 2, (size - mh) / 2

    parts = [svg_open(size, size, "Balzee")]
    if glow:
        parts.append(
            f'<defs><radialGradient id="g" cx="50%" cy="4%" r="74%">'
            f'<stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.15"/>'
            f'<stop offset="70%" stop-color="{ACCENT}" stop-opacity="0"/>'
            f"</radialGradient></defs>"
        )
    parts.append(
        f'<rect width="{num(size)}" height="{num(size)}" rx="{num(radius)}" fill="{bg}"/>'
    )
    if glow:
        parts.append(
            f'<rect width="{num(size)}" height="{num(size)}" rx="{num(radius)}" fill="url(#g)"/>'
        )
    parts.append(mark_group(fg, x, y, s))
    parts.append("</svg>")
    return "".join(parts)


def build_favicon_adaptive() -> str:
    """Favicon tile. Carries its own dark background so the mark stays legible
    against both light and dark browser chrome."""
    size, radius = 128, 26
    target_h = size * 0.62
    s = target_h / MARK_H
    mw, mh = MARK_W * s, MARK_H * s
    x, y = (size - mw) / 2, (size - mh) / 2
    return (
        svg_open(size, size, "Balzee")
        # A solid tile rather than a theme-adaptive one: the mark then reads
        # identically on light and dark browser chrome, which is the whole job
        # of a favicon.
        + f'<rect width="{size}" height="{size}" rx="{radius}" fill="{INK}"/>'
        f'<path fill="{PAPER}" transform="translate({num(x)} {num(y)}) scale({num(s)})" '
        f'fill-rule="evenodd" d="{MARK_D}"/>'
        "</svg>"
    )


def build_mark_accent() -> str:
    """Accent treatment: the two forward arrows carry the green. Used sparingly
    — social avatars, deck covers — never as the default mark."""
    return (
        svg_open(MARK_W, MARK_H, "Balzee")
        + f'<path fill="{ACCENT}" d="{MARK_COUNTERS}"/>'
        + f'<path fill="{PAPER}" fill-rule="evenodd" d="{MARK_D}"/>'
        + "</svg>"
    )


# ── Emit ─────────────────────────────────────────────────────────────────────
FILES: dict[str, str] = {
    # monogram
    "balzee-mark-dark.svg": build_mark(PAPER),
    "balzee-mark-light.svg": build_mark(INK),
    "balzee-mark-accent.svg": build_mark_accent(),
    # wordmark
    "balzee-wordmark-dark.svg": build_wordmark(PAPER),
    "balzee-wordmark-light.svg": build_wordmark(INK),
    # horizontal
    "balzee-logo-horizontal-dark.svg": build_horizontal(PAPER, MUTED_ON_DARK, True),
    "balzee-logo-horizontal-light.svg": build_horizontal(INK, MUTED_ON_LIGHT, True),
    "balzee-logo-horizontal-compact-dark.svg": build_horizontal_compact(PAPER),
    "balzee-logo-horizontal-compact-light.svg": build_horizontal_compact(INK),
    # vertical (primary)
    "balzee-logo-vertical-dark.svg": build_vertical(PAPER, MUTED_ON_DARK, True),
    "balzee-logo-vertical-light.svg": build_vertical(INK, MUTED_ON_LIGHT, True),
    "balzee-logo-vertical-compact-dark.svg": build_vertical(PAPER, MUTED_ON_DARK, False),
    "balzee-logo-vertical-compact-light.svg": build_vertical(INK, MUTED_ON_LIGHT, False),
    # icons
    "balzee-icon.svg": build_icon(),
    "favicon.svg": build_favicon_adaptive(),
}


def minify(s: str) -> str:
    s = re.sub(r">\s+<", "><", s.strip())
    return re.sub(r"\s{2,}", " ", s)


if __name__ == "__main__":
    for name, body in FILES.items():
        (OUT / name).write_text(minify(body) + "\n")

    manifest = {
        "mark": {"path": MARK_D, "width": MARK_W, "height": MARK_H},
        "wordmark": {"path": WORD_D, "width": round(WORD_W, 3), "cap": WORD_CAP},
        "tagline": {"path": TAG_D, "width": round(TAG_W, 3), "cap": TAG_CAP,
                    "text": TAGLINE},
    }
    pathlib.Path("/home/claude/brand/manifest.json").write_text(
        json.dumps(manifest, indent=1)
    )

    for name in FILES:
        print(f"{(OUT / name).stat().st_size:>7,}  {name}")


# ── React components ─────────────────────────────────────────────────────────
# Generated from the same geometry as the SVG files so the two can never drift.
COMPONENT = '''/**
 * Balzee brand marks.
 *
 * GENERATED — do not hand-edit. The geometry is the single source shared with
 * the files in `public/branding`. Both marks paint with `currentColor`, so they
 * pick up whatever text colour their container sets.
 */

const MARK_D =
  "%MARK%";

const WORDMARK_D =
  "%WORD%";

/** The B monogram. 72 x 106 units. */
export function BalzeeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 106"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} />
    </svg>
  );
}

/** BALZEE set in outlines — no font dependency, so it never reflows. */
export function BalzeeWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 %WW% 100"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g transform="translate(0 100)">
        <path d={WORDMARK_D} />
      </g>
    </svg>
  );
}

/**
 * Horizontal lockup used in the navbar and footer. The mark and wordmark are
 * separate elements so each can be sized against the layout independently.
 */
export function BalzeeLogo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={className}>
      <BalzeeMark className={markClassName} />
      <BalzeeWordmark className={wordmarkClassName} />
      <span className="sr-only">Balzee</span>
    </span>
  );
}
'''

comp = (
    COMPONENT.replace("%MARK%", MARK_D)
    .replace("%WORD%", WORD_D)
    .replace("%WW%", num(WORD_W))
)
dest = pathlib.Path("/home/claude/balzee/src/components/brand/Logo.tsx")
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(comp)
print("\nwrote", dest)
