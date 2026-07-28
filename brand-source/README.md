# Brand asset source

These scripts generate everything in `public/branding` *and*
`src/components/brand/Logo.tsx` from one geometry definition, so the files and
the React components can never drift apart.

```bash
pip install fonttools brotli
python3 build.py      # SVGs + Logo.tsx
node raster.mjs       # PNGs, favicons, app icons  (needs playwright)
node og.mjs           # 1200x630 Open Graph card
python3 sheet.py      # brand sheet HTML
```

`build.py` holds the monogram path and every lockup's spacing. Change the
tagline, tracking or proportions there and re-run — nothing is hand-drawn.

`wordmark.py` converts BALZEE to outlines from the Space Grotesk variable font
in `src/app/fonts/`. It measures true ink bounds rather than advance widths;
using advance widths clips the final glyph.
