// Verifies every internal link, anchor and asset reference in dist/ resolves,
// the way Vercel serves the site with cleanUrls. External URLs are listed only.
// Usage: node tools/check-links.mjs   (after node tools/build.mjs)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const pages = readdirSync(dist).filter((f) => f.endsWith(".html"));
const html = Object.fromEntries(pages.map((f) => [f, readFileSync(join(dist, f), "utf8")]));
const ids = (src) => new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const pageFor = (path) => {
  if (path === "/" || path === "") return "index.html";
  const p = path.replace(/^\//, "");
  if (html[p]) return p;
  if (html[p + ".html"]) return p + ".html";
  return null;
};

const problems = [];
const external = new Set();
let count = 0;
for (const [file, src] of Object.entries(html)) {
  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    count++;
    if (/^(https?:)?\/\//.test(ref)) { external.add(ref.replace(/\?.*/, "")); continue; }
    if (/^(mailto|tel):/.test(ref)) continue;
    if (/^[A-Za-z]:/.test(ref) || ref.includes(String.fromCharCode(92))) { problems.push(`${file}: local machine path ${ref}`); continue; }
    const [path, hash] = ref.split("#");
    if (!path) { if (hash && !ids(src).has(hash)) problems.push(`${file}: missing anchor #${hash}`); continue; }
    if (!path.startsWith("/")) { problems.push(`${file}: relative reference ${ref} (use root relative paths)`); continue; }
    if (/\.\w+$/.test(path) && !path.endsWith(".html")) {
      if (!existsSync(join(dist, path))) problems.push(`${file}: missing asset ${path}`);
      continue;
    }
    if (path.endsWith(".html")) { problems.push(`${file}: link with .html extension ${ref} (cleanUrls)`); continue; }
    const target = pageFor(path);
    if (!target) { problems.push(`${file}: broken link ${ref}`); continue; }
    if (hash && !ids(html[target]).has(hash)) problems.push(`${file}: missing anchor ${ref}`);
  }
}
for (const asset of ["/og.png", "/favicon.ico", "/icon-512.png", "/robots.txt", "/sitemap.xml", "/site.webmanifest"]) {
  if (!existsSync(join(dist, asset))) problems.push(`missing ${asset}`);
}
console.log(`Checked ${count} references in ${pages.length} pages. External hosts: ${[...new Set([...external].map((u) => new URL(u, "https://x").host))].join(", ")}`);
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("All internal links, anchors and assets resolve.");
