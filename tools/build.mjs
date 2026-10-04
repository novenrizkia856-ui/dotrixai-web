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
  const ghIcon = `<svg class="icon_x" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;
  const githubLink = site.githubUrl
    ? `<a class="footer_social" href="${site.githubUrl}" target="_blank" rel="noopener noreferrer me" aria-label="DotrixAI on GitHub">${ghIcon}</a>`
    : "";
  const githubButton = site.githubUrl
    ? `<a class="btn is-secondary" href="${site.githubUrl}" target="_blank" rel="noopener noreferrer me">${ghIcon}<span>DotrixAI on GitHub</span></a>`
    : "";
  const sameAs = JSON.stringify([site.xUrl, site.githubUrl].filter(Boolean));
  // Research state rendered into {{cir*}} tokens; edit src/data/cir.mjs to update /cir.
  const cir = (await import(pathToFileURL(join(src, "data", "cir.mjs")).href + "?t=" + Date.now())).tokens();

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
      githubLink,
      githubButton,
      sameAs,
      ...cir
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
