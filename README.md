# Balzee — Marketing Virtual Assistant

Portfolio site for **Jhen Mer "Bal" Balderama**. Next.js 16 (App Router) ·
TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

Dark-first, black-and-white interface with `#22C55E` reserved for buttons,
links, icons, hover states, active navigation and small highlights.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # ESLint
```

Requires Node 20.9+.

---

## Where to edit things

Everything you'll realistically want to change lives in two folders. You should
rarely need to touch the components.

| What | File |
| --- | --- |
| Name, email, phone, Calendly, Instagram, domain, nav links | `src/lib/site.ts` |
| Service cards | `src/content/services.ts` |
| Portfolio projects + categories | `src/content/portfolio.ts` |
| Stats and highlight bullets | `src/content/results.ts` |
| Industries | `src/content/industries.ts` |
| Tools + "trusted by" client list | `src/content/tools.ts` |
| Testimonials | `src/content/testimonials.ts` |
| Colours, fonts, spacing tokens | `src/app/globals.css` (`@theme` block) |

**Before deploying**, set `site.url` in `src/lib/site.ts` to your real domain —
it drives canonical URLs, `sitemap.xml`, `robots.txt` and Open Graph tags.

### Adding real project images

Drop images into `public/` and add an `image` path to any project:

```ts
{
  title: "Luxury Listing Walkthroughs",
  image: "/work/luxury-listing.jpg",   // ← add this
  // …
}
```

Projects without an `image` render generated abstract artwork
(`src/components/ui/ProjectPlaceholder.tsx`) so the grid never looks unfinished.

### Trusted By logos

**All four client logos are currently text placeholders. The official artwork
still needs to be supplied.** The strip is already wired to render real files —
adding one is a two-step change, no component edits.

1. Save the official asset into `public/logos/`.
2. Add a `logo` entry for that client in `src/content/tools.ts`:

```ts
export const clients: Client[] = [
  {
    name: "eXp Realty",
    logo: { src: "/logos/exp-realty.svg", width: 512, height: 128 },
  },
  { name: "Pacific Realty Group" },   // ← still a placeholder
  // …
];
```

`width`/`height` are the file's intrinsic dimensions. They're only used to
preserve the aspect ratio and reserve space — the component pins every logo to
the same display height (24 / 28 / 32px across mobile, tablet, desktop), so
wordmarks and square marks line up regardless of proportion. Use the optional
`scale` field if one mark still reads optically large or small.

Until a `logo` is set, that client falls back to a clean text wordmark. In
`npm run dev` the placeholders carry a dashed outline so they're easy to spot;
in production they render as plain type.

#### Why these weren't auto-sourced

| Client | Status | What's needed |
| --- | --- | --- |
| eXp Realty | Assets exist but are gated | Official SVG/PNG from the [eXp brand portal](https://join.exprealty.com/brand/) (logos are served through Google Drive folders behind their brand guidelines). |
| Pacific Realty Group | **Ambiguous name** | Several unrelated firms use this name (e.g. [Pacific Realty Group LLC, Honolulu](https://www.prghawaii.com/)). Confirm which one is the client, then request their logo. |
| Realty of America | No public asset link | They publish a brand guide via the [ROA Marketing Hub](https://marketing.realtyofamerica.com/) but no direct logo download. Request the file from ROA marketing. |
| Everyday Order | **Ambiguous name** | At least two businesses share it — [everydayorder.com](https://www.everydayorder.com/) (Orange County, CA) and an [everydayorder.org](https://www.everydayorder.org/) / Montclair, NJ listing. Confirm which, then request a transparent PNG or SVG. |

Prefer SVG. If only raster is available, use a high-resolution PNG with a
transparent background (~96px tall minimum). Use a brand's own monochrome-white
version if they publish one; otherwise use the official colour version. Don't
redraw or recolour the artwork.

Get written permission before displaying a client's logo — most brand
guidelines require it, and "trusted by" placement implies endorsement.

---

## Brand identity

All logo assets live in `public/branding/` — see
[`public/branding/README.md`](public/branding/README.md) for the full file list,
clear-space rules and minimum sizes.

The monogram is an original geometric construction: a `B` whose two counters are
right-pointing arrows, built on a 72 × 106 grid where every non-orthogonal edge
is exactly 45°.

In the app, the navbar and footer use **inline SVG** components from
`src/components/brand/Logo.tsx` rather than an `<img>`. That means no extra
network request, no flash before the logo paints, and the marks inherit
`currentColor`. Those components are generated from the same geometry as the
files in `public/branding`, so the two cannot drift apart.

Wired up in `src/app/layout.tsx`:

| Slot | Asset |
| --- | --- |
| Favicon | `/branding/favicon.svg` + 32 / 64 px PNG fallbacks |
| Apple touch icon | `/branding/apple-touch-icon.png` (180 px) |
| Open Graph + Twitter card | `/branding/og-image.png` (1200 × 630) |
| Web app manifest | `src/app/manifest.ts` → `/branding/icon-192.png`, `icon-512.png` |
| JSON-LD `logo` / `image` | `/branding/balzee-mark-dark.png`, `/branding/og-image.png` |

The tagline in the lockups is *Creative systems. Real results.* — swap or drop
it by regenerating the assets, or just use the `-compact` files, which omit it.

## Contact form

The form posts to `POST /api/contact` (`src/app/api/contact/route.ts`), which
validates the payload and filters bots with a honeypot field.

**To actually receive submissions**, set one environment variable:

```bash
# .env.local
CONTACT_WEBHOOK_URL=https://formspree.io/f/your-id
```

Any endpoint that accepts a JSON `POST` works — Formspree, Zapier, Make, n8n, a
Google Apps Script, or your own handler. Without it, submissions are only logged
to the server console and the visitor still sees the success state.

The success screen and the section's secondary CTA both link straight to your
email and Calendly, so there's always a working path even if the webhook fails.

---

## Fonts

- **Body — Inter** and **fallback display — Space Grotesk** are vendored as
  variable woff2 in `src/app/fonts/` and loaded through `next/font/local`. That
  matters for more than convenience: `next/font` preloads the files *and*
  generates a metric-matched fallback face, which is what keeps the swap from
  fallback to real font from reflowing the page. Measured CLS is 0.
- **Headings — Clash Display**, loaded from Fontshare via a `<link>` in
  `src/app/layout.tsx`. Space Grotesk sits behind it in the stack, so headings
  still look right if that request is slow or blocked.

To self-host Clash Display too (the last remaining third-party request):
download the woff2 files from
[fontshare.com](https://www.fontshare.com/fonts/clash-display), drop them in
`src/app/fonts/`, remove the Fontshare `<link>` tags from `layout.tsx`, and add
a third `localFont()` call alongside the existing two.

---

## Project structure

```
src/
├─ app/
│  ├─ api/contact/route.ts   Form endpoint
│  ├─ globals.css            Design tokens, base styles, keyframes
│  ├─ icon.svg               Favicon
│  ├─ layout.tsx             Metadata, JSON-LD, fonts, shell
│  ├─ page.tsx               Section composition
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/
│  ├─ brand/                 Logo.tsx — generated inline mark + wordmark
│  ├─ layout/                Navbar (scroll-spy + mobile menu), Footer
│  ├─ sections/              The ten page sections
│  └─ ui/                    Button, Container, Section, SectionHeading,
│                            Reveal/Stagger, Counter, ProjectPlaceholder, icons
├─ content/                  All editable page content
└─ lib/                      site.ts (identity/config), utils.ts
```

---

## Accessibility & performance notes

- Semantic landmarks throughout, one `<h1>`, skip-to-content link, visible focus
  rings, `aria-*` on the nav, portfolio tabs and form fields.
- Body and label text sit at 8.1:1 and 4.6:1 against the background — both
  above the WCAG AA floor for normal text.
- Every animation is gated behind `prefers-reduced-motion`; card lifts and
  scales opt out individually via `motion-reduce:`.
- Measured cumulative layout shift of **0**, and no horizontal overflow from
  320px through 1440px.
- Only the Navbar, Hero, Portfolio, card grids and contact form ship client JS;
  every other section is a Server Component.
- The cursor spotlight on card grids runs one rAF-throttled listener per grid
  (not per card) and ignores non-mouse pointers entirely.

### A Tailwind v4 gotcha worth knowing

`scale-*`, `translate-*` and `rotate-*` compile to the standalone CSS `scale`,
`translate` and `rotate` properties — **not** to `transform`. An explicit
`transition-transform` or `transition-[...,transform]` therefore silently fails
to animate them, and the hover snaps instead of easing. Anywhere this project
transitions a lift or a scale it lists `translate` and `scale` by name.

---

## Deploying

Works as-is on Vercel, Netlify, or any Node host.

1. Push to a Git repo and import it.
2. Set `CONTACT_WEBHOOK_URL` in the host's environment variables.
3. Point your domain at it, then update `site.url`.
