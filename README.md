# dotrixai-web

Website for **DotrixAI**, an independent AI research and technology institution. Current public host: **https://dotrixai-web.vercel.app**. Content reviewed on 6 November 2026.

## Current research and disclosure

Heartwood is the main research focus. The Antiphon Standard is an early research and design effort. CIR is idle; its earlier public evidence retains its original dates. Lab coordinated Efficiency Claims Check work is paused.

The public Heartwood and Antiphon pages are purpose-written program overviews: research questions, broad scope, status and validation limits. They do not release experimental results, recipes, private code or specifications. Future updates need their own disclosure review. Do not copy internal research records into this repository.

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
npm run check:browser  # headless Chrome: errors, overflow, copy rules at desktop/compact/tablet/phone
                       # add --shots --full for full-page screenshots in work/shots/
npm run brand          # regenerate logos, favicons and og.png from work/brand-src (needs Python + Pillow)
```

## Structure

```
src/
  site.config.mjs     site origin, domain, contact email (empty = "coming soon" note)
  data/cir.mjs        CIR research state for /cir: latest update, gates, evidence, cost curve,
                      capabilities, experiments, timeline. Edit here as CIR evolves, then build.
  partials/           layout.html (head, meta, OG), nav.html, footer.html
  pages/              one file per route; the copy lives here
    index.html        /             home
    research.html     /research     scope, approach, technology stack, safety, long-term direction
    heartwood.html    /heartwood    continual learning program overview and limitations
    antiphon.html     /antiphon     proposed standard overview and limitations
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

## Updating the CIR page

The historical evidence on `/cir` lives in `src/data/cir.mjs` and renders into `{{cir*}}` tokens. Use only material cleared for public release. Preserve the original evidence dates and limitations; updating current program status does not make old measurements new. The narrative sections are in `src/pages/cir.html`.

## Copy rules

`npm run build` fails if visible copy contains a hyphen, en dash or em dash, or a sentence longer than 15 words. Keep claims factual. Nothing on the site should imply customers, partners, results or publications that don't exist.

## Deploying to Vercel

`vercel.json` sets the build command (`npm run build`), the output directory (`dist`), clean URLs (`/cir` serves `cir.html`) and security headers, including a CSP. Import the repo in Vercel with framework preset **Other**, or from the CLI:

```bash
npx vercel --prod
```

If you change the inline script in `src/partials/layout.html`, update its `sha256` in the CSP in `vercel.json`. `npm run check` catches a mismatch.

## Domains

`https://dotrixai-web.vercel.app` is the current canonical host while the custom domain is unavailable. Canonical tags, Open Graph URLs, `sitemap.xml` and `robots.txt` all use `origin` in `src/site.config.mjs`.

If the custom domain is restored, verify DNS and TLS before switching `origin`. Apex and www redirects belong in **Vercel → Project → Settings → Domains**, not in `vercel.json`:

- `dotrixai.com`: connected to the production branch, no redirect
- `www.dotrixai.com`: redirect to `dotrixai.com`, 308 permanent

Don't also add a host redirect to `vercel.json`. If the dashboard and the config disagree, requests loop between the two hosts. `npm run check` fails if one appears.

Vercel preview hosts send `X-Robots-Tag: noindex`. The active production alias is excluded from that rule. The host checks follow the configured origin.

## Placeholders

- The X profile is `xUrl` in `src/site.config.mjs` (footer icon, contact page, JSON-LD `sameAs`).
- The contact address is `contactEmail` in `src/site.config.mjs` (currently the founder's email).
- `/evidence` separates program overviews from historical public research and formal papers. Add papers only once they are public.
