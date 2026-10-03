# dotrixai-web

Website for **DotrixAI**, an independent AI research lab developing efficient, licensable AI technologies. Served at `dotrixai.com`.

## Stack

Static HTML and CSS with one small script. A dependency‑free Node build (`tools/build.mjs`) wraps each page in the shared layout, navigation and footer, then writes `dist/`. There is nothing to `npm install`.

- Fonts: Instrument Sans, Source Serif 4 and IBM Plex Mono, loaded from Google Fonts
- Motion: hero word reveal, scroll reveal, a media band that expands as you scroll, and a dot‑field canvas. All of it respects `prefers-reduced-motion`.
- Node 20 or newer

## Commands

```bash
npm run dev            # dev server on http://localhost:5330, rebuilds on every page request
npm run build          # build dist/, then run the copy-rule and link checks
npm run check          # build + structural tests (test/site.test.mjs)
npm run check:browser  # headless Chrome: errors, overflow, copy rules at desktop/tablet/phone
                       # add --shots --full for full-page screenshots in work/shots/
npm run brand          # regenerate logos, favicons and og.png from work/brand-src (needs Python + Pillow)
```

## Structure

```
src/
  site.config.mjs     site origin, domain, contact email (empty = "coming soon" note)
  partials/           layout.html (head, meta, OG), nav.html, footer.html
  pages/              one file per route; the copy lives here
    index.html        /             home
    research.html     /research     scope, approach, technology stack, safety, long-term direction
    cir.html          /cir          the CIR research program
    philosophy.html   /philosophy   purpose, thesis, vision, mission, principles
    evidence.html     /evidence     publication approach and evidence standard
    contact.html      /contact
    404.html
public/
  css/site.css        the whole design system
  js/site.js          nav, reveals, band, dot field
  brand/              logo lockups and marks derived from the supplied assets
  favicon.ico, icon-*.png, apple-touch-icon.png, og.png, site.webmanifest
tools/                build, dev server, copy/link/browser checks
work/
  brand-src/          the original dotrixai_assets.zip images (untouched)
  make_brand.py       crops, scales and recolours them into public/
```

Each page starts with a `<!-- page { ... } -->` header holding its title, description and nav key.

## Copy rules

`npm run build` fails if visible copy contains a hyphen, en dash or em dash, or a sentence longer than 15 words. Keep claims factual. Nothing on the site should imply customers, partners, results or publications that don't exist.

## Deploying to Vercel

`vercel.json` sets the build command (`npm run build`), the output directory (`dist`), clean URLs (`/cir` serves `cir.html`) and security headers, including a CSP. Import the repo in Vercel with framework preset **Other**, or from the CLI:

```bash
npx vercel --prod
```

If you change the inline script in `src/partials/layout.html`, update its `sha256` in the CSP in `vercel.json`. `npm run check` catches a mismatch.

## Placeholders

- `contactEmail` in `src/site.config.mjs` is empty until a real inbox exists.
- The Publications list on `/evidence` reads "No public papers yet". Add entries there once something is published.
