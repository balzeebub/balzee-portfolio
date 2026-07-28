# Balzee brand assets

Original geometric identity. The monogram is constructed on a 72 × 106 unit
grid where every non-orthogonal edge is exactly 45° — that is what keeps it
crisp at any size and easy to reproduce.

**Concept.** A `B` whose two counters are right-pointing arrows: forward motion
sitting inside the letter rather than bolted onto it. The chamfered outer
corners and the 45° waist notch give it a precise, engineered feel that matches
the site's editorial tone.

## Files

| File | Use |
| --- | --- |
| `balzee-logo-vertical-*.svg` | **Primary logo.** Mark over wordmark and tagline. |
| `balzee-logo-vertical-compact-*.svg` | Primary without the tagline. |
| `balzee-logo-horizontal-*.svg` | Wide placements — email signatures, letterheads, decks. |
| `balzee-logo-horizontal-compact-*.svg` | Mark + wordmark only. Site navbar uses this arrangement. |
| `balzee-wordmark-*.svg` | Wordmark alone, where the mark already appears nearby. |
| `balzee-mark-*.svg` | Monogram alone — avatars, favicons, stamps. |
| `balzee-mark-accent.svg` | Arrows in `#22C55E`. Sparing use: social avatars, deck covers. Never the default. |
| `balzee-icon.svg` | Rounded-square app icon with a faint accent bloom. |
| `favicon.svg` | Favicon tile. Carries its own dark background so it reads on light and dark browser chrome. |
| `og-image.png` | 1200 × 630 social card. |
| `png/` | Raster fallbacks. `@2x` files are for retina placement in decks and documents. |

`-dark` = white artwork, for dark backgrounds.
`-light` = black artwork, for light backgrounds.
Every SVG and PNG has a transparent background except `favicon.svg`,
`balzee-icon.svg`, the icon PNGs and `og-image.png`.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#0F0F0F` | Primary background, light-version artwork |
| Paper | `#FFFFFF` | Dark-version artwork |
| Accent | `#22C55E` | Buttons, links, active states, small highlights |
| Muted (on dark) | `#A8A8A8` | Tagline on dark backgrounds |
| Muted (on light) | `#6B6B6B` | Tagline on light backgrounds |

The identity is black and white first. Green is an accent, never a fill for the
logo itself.

## Usage

- **Clear space:** keep free space equal to the width of the monogram's stem
  (⅓ of the mark's width) on every side.
- **Minimum sizes:** monogram 14 px tall; horizontal lockup 96 px wide;
  vertical lockup with tagline 150 px wide — below that, drop the tagline.
- Don't recolour, rotate, stretch, outline, add effects to, or reconstruct the
  mark. Scale the supplied files.
- On photography, use the `-dark` artwork over a sufficiently dark area, or
  place the logo on a solid panel.

## Typography

The wordmark is set in **Space Grotesk** (SIL OFL 1.1) at weight 500 with
0.26 em tracking, converted to outlines — so the logo files carry no font
dependency and can't reflow. The tagline uses weight 400 at 0.20 em.

## Regenerating

Assets are generated, not hand-drawn, from a single geometry definition. The
same source also emits `src/components/brand/Logo.tsx`, so the inline React
marks used in the navbar and footer can never drift from these files.
