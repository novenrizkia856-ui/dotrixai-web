// Local dev server. Rebuilds dist/ before every page request, then serves it
// the way Vercel does with cleanUrls (/cir -> cir.html, unknown -> 404.html).
// Usage: node tools/serve.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.argv[2] || process.env.PORT || 5330);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain",
  ".webmanifest": "application/manifest+json", ".woff2": "font/woff2" };

export function resolve(base, url) {
  let path = decodeURIComponent(new URL(url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  if (!extname(path) && existsSync(join(base, path + ".html"))) path += ".html";
  const file = normalize(join(base, path));
  if (file.startsWith(base) && existsSync(file) && statSync(file).isFile()) return { file, status: 200 };
  return { file: join(base, "404.html"), status: 404 };
}

let building = null;
await build();
createServer(async (req, res) => {
  try {
    const wantsPage = !extname(new URL(req.url, "http://x").pathname) || req.url.endsWith(".html");
    if (wantsPage) { building ??= build({ quiet: true }).finally(() => (building = null)); await building; }
    const { file, status } = resolve(root, req.url);
    res.writeHead(status, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(String(err.stack || err));
  }
}).listen(port, "127.0.0.1", () => console.log(`DotrixAI dev server on http://localhost:${port}`));
