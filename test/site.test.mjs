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

test("no invented contact address is published while none is configured", async () => {
  const site = (await import(new URL("../src/site.config.mjs", import.meta.url))).default;
  const contact = read("contact.html");
  if (!site.contactEmail) {
    assert.doesNotMatch(contact, /mailto:/);
    assert.match(contact, /contact_pending/);
  } else {
    assert.match(contact, new RegExp(`mailto:${site.contactEmail}`));
  }
});
