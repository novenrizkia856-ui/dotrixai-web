// House copy rules, checked on every built page in dist/:
//   1. No hyphen, en dash or em dash in visible copy.
//   2. No sentence longer than 15 words.
// Covers body text, titles, meta descriptions, alt, aria labels and titles.
// Code samples (<code>) and the mono formula are skipped.
// Usage: node tools/check-copy.mjs   (after node tools/build.mjs)
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const MAX_WORDS = 15;
const DASHES = /[\u002D\u2010-\u2015\u2212]/;
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&rarr;/g, "→").replace(/&copy;/g, "©")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const strings = [];
const add = (source, text) => {
  const clean = decode(String(text)).replace(/\s+/g, " ").trim();
  if (clean) strings.push({ source, text: clean });
};

for (const file of readdirSync(dist).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(join(dist, file), "utf8").replace(/<!--[\s\S]*?-->/g, "");
  for (const m of html.matchAll(/<meta[^>]+(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description|og:image:alt)"[^>]*content="([^"]*)"/g)) add(`${file} meta`, m[1]);
  for (const m of html.matchAll(/<title>([\s\S]*?)<\/title>/g)) add(`${file} title`, m[1]);
  for (const m of html.matchAll(/\s(?:aria-label|alt|title|placeholder)="([^"]*)"/g)) add(`${file} attribute`, m[1]);
  const body = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<code[\s\S]*?<\/code>/g, "");
  const text = body.replace(/<(\/?)(p|h[1-6]|li|a|button|div|section|header|footer|nav|main|t[dhr]|figcaption|caption|span class="(?:u-mono|section_eyebrow|statement_label|row_tag|stack_note|chain_step|tag)[^"]*")\b[^>]*>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, " ");
  for (const line of text.split("\n")) add(`${file} text`, line);
}

const problems = [];
for (const { source, text } of strings) {
  if (DASHES.test(text)) problems.push(`[dash] ${source}: "${text}"`);
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const words = sentence.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
    if (words.length > MAX_WORDS) problems.push(`[long ${words.length} words] ${source}: "${sentence}"`);
  }
}
console.log(`Checked ${strings.length} visible strings.`);
if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  process.exit(1);
}
console.log("Copy rules pass: no dashes, no sentence over 15 words.");
