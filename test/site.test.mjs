// Structural checks on the built site. Run after `npm run build`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const pages = readdirSync(dist).filter((f) => f.endsWith(".html"));
const read = (f) => readFileSync(join(dist, f), "utf8");

test("every expected page is built", () => {
  for (const p of ["index", "research", "cir", "philosophy", "evidence", "contact", "404"]) assert.ok(pages.includes(p + ".html"), p);
});

test("each page has one h1, a title, a description and a canonical url", () => {
  for (const f of pages) {
    const html = read(f);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, f + " h1 count");
    assert.match(html, /<title>[^<]+<\/title>/, f);
    assert.match(html, /<meta name="description" content="[^"]+">/, f);
    assert.match(html, /<link rel="canonical" href="https:\/\/dotrixai\.com\/[^"]*">/, f);
  }
});

test("headings never skip a level", () => {
  for (const f of pages) {
    const levels = [...read(f).matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    levels.reduce((prev, lvl) => { assert.ok(lvl <= prev + 1, `${f}: h${prev} then h${lvl}`); return lvl; }, 1);
  }
});

test("images carry alt text and dimensions", () => {
  for (const f of pages) for (const m of read(f).matchAll(/<img\b[^>]*>/g)) {
    assert.match(m[0], /\salt="[^"]+"/, f + " " + m[0]);
    assert.match(m[0], /\swidth="\d+" height="\d+"/, f + " " + m[0]);
  }
});

test("the inline script matches the CSP hash in vercel.json", () => {
  const vercel = readFileSync(join(root, "vercel.json"), "utf8");
  for (const f of pages) for (const m of read(f).matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = createHash("sha256").update(m[1]).digest("base64");
    assert.ok(vercel.includes(`'sha256-${hash}'`), `${f}: inline script hash ${hash} missing from CSP`);
  }
});

test("no inline style attributes, which the CSP would block", () => {
  for (const f of pages) assert.doesNotMatch(read(f), /\sstyle="/, f);
});

test("the current page is marked in the navigation", () => {
  for (const [f, key] of [["cir.html", "cir"], ["research.html", "research"], ["contact.html", "contact"]]) {
    assert.match(read(f), new RegExp(`data-nav="${key}" aria-current="page"`), f);
  }
});

test("the contact address matches site.config.mjs", async () => {
  const site = (await import(new URL("../src/site.config.mjs", import.meta.url))).default;
  const contact = read("contact.html");
  if (!site.contactEmail) {
    assert.doesNotMatch(contact, /mailto:/);
    assert.match(contact, /contact_pending/);
  } else {
    assert.match(contact, new RegExp(`mailto:${site.contactEmail}`));
  }
});

test("dotrixai.com (no www) is the only host in canonical, og, sitemap and robots", () => {
  for (const f of pages) {
    const html = read(f);
    assert.doesNotMatch(html, /https?:\/\/www\.dotrixai\.com/, f);
    for (const m of html.matchAll(/(?:rel="canonical" href|property="og:url" content|property="og:image" content|name="twitter:image" content)="([^"]+)"/g)) {
      assert.match(m[1], /^https:\/\/dotrixai\.com\//, `${f}: ${m[1]}`);
    }
  }
  for (const loc of readFileSync(join(dist, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    assert.match(loc[1], /^https:\/\/dotrixai\.com\//, loc[1]);
  }
  assert.match(readFileSync(join(dist, "robots.txt"), "utf8"), /Sitemap: https:\/\/dotrixai\.com\/sitemap\.xml/);
});

test("vercel.json never redirects between apex and www", () => {
  // The www <-> apex redirect belongs to Vercel's domain settings. A second one
  // here would loop against it (see README, Domains).
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  for (const r of [...(vercel.redirects || []), ...(vercel.rewrites || [])]) {
    assert.doesNotMatch(JSON.stringify(r), /dotrixai\.com/, JSON.stringify(r));
  }
});

test("preview hosts are noindex, production hosts are not", () => {
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  const rule = vercel.headers.find((h) => h.headers.some((x) => x.key === "X-Robots-Tag"));
  assert.ok(rule, "X-Robots-Tag rule missing");
  const host = new RegExp("^" + rule.has.find((c) => c.type === "host").value + "$");
  assert.ok(host.test("dotrixai-web.vercel.app"));
  assert.ok(host.test("dotrixai-web-git-main-someone.vercel.app"));
  for (const prod of ["dotrixai.com", "www.dotrixai.com"]) assert.ok(!host.test(prod), prod);
});
