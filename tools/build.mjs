// Static build. Wraps every page in src/pages/ with the shared layout,
// navigation and footer, copies public/ and writes dist/.
// No dependencies. Usage: node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const out = join(root, "dist");

export async function build({ quiet = false } = {}) {
  const site = (await import(pathToFileURL(join(src, "site.config.mjs")).href + "?t=" + Date.now())).default;
  const read = (p) => readFileSync(join(src, p), "utf8");
  const layout = read("partials/layout.html");
  const nav = read("partials/nav.html");
  const footer = read("partials/footer.html");

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(root, "public"), out, { recursive: true });

  const contactBlock = site.contactEmail
    ? `<a class="btn" href="mailto:${site.contactEmail}"><span>${site.contactEmail}</span><span class="btn_icon" aria-hidden="true">&rarr;</span></a>`
    : `<p class="contact_pending u-detail">A public contact address will be listed here soon.</p>`;

  const xIcon = `<svg class="icon_x" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  const xLink = site.xUrl
    ? `<a class="footer_social" href="${site.xUrl}" target="_blank" rel="noopener noreferrer me" aria-label="DotrixAI on X">${xIcon}</a>`
    : "";
  const xButton = site.xUrl
    ? `<a class="btn is-secondary" href="${site.xUrl}" target="_blank" rel="noopener noreferrer me">${xIcon}<span>Follow @dotrixai on X</span></a>`
    : "";
  const sameAs = JSON.stringify([site.xUrl].filter(Boolean));

  const pages = readdirSync(join(src, "pages")).filter((f) => f.endsWith(".html"));
  const urls = [];
  for (const file of pages) {
    const raw = read("pages/" + file);
    const head = raw.match(/^<!--\s*page\s*(\{[\s\S]*?\})\s*-->/);
    if (!head) throw new Error(`${file}: missing <!-- page {...} --> header`);
    const meta = JSON.parse(head[1]);
    const body = raw.slice(head[0].length).trim();
    const path = meta.path ?? "/" + file.replace(/\.html$/, "");
    const canonical = site.origin + (path === "/" ? "/" : path);
    if (!meta.noindex) urls.push(canonical);

    const markNav = (html) => html.replace(/<a([^>]*?)data-nav="([^"]+)"/g, (m, attrs, key) =>
      key === meta.nav ? `<a${attrs}data-nav="${key}" aria-current="page"` : m);

    const vars = {
      title: meta.title,
      description: meta.description,
      canonical,
      origin: site.origin,
      domain: site.domain,
      year: String(site.year),
      robots: meta.noindex ? "noindex" : "index, follow",
      bodyClass: meta.bodyClass ?? "",
      nav: markNav(nav),
      footer,
      content: body,
      contactBlock,
      xLink,
      xButton,
      sameAs
    };
    const fill = (s) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
    // two passes: partials and page content may hold their own {{tokens}}
    const html = fill(fill(layout));
    const left = html.match(/\{\{\w+\}\}/g);
    if (left) throw new Error(`${file}: unfilled ${[...new Set(left)].join(", ")}`);
    writeFileSync(join(out, file), html);
  }

  writeFileSync(join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") + `\n</urlset>\n`);
  writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
  if (!quiet) console.log(`Built ${pages.length} pages into dist/.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await build();
