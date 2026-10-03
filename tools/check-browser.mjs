// Browser smoke test. Serves dist/ (run `npm run build` first) on a throwaway
// port the way Vercel does, drives headless Chrome over the DevTools protocol
// and reports console errors, uncaught exceptions, failed requests, horizontal
// overflow and copy rule breaks for every page at desktop, tablet and phone
// widths. Screenshots land in work/shots/ (git ignored).
//
// Usage: node tools/check-browser.mjs [page ...] [--shots] [--full] [--wait ms]
//          [--wheel 800,2400] scroll by wheel delta, screenshot after each
//          [--menu]           phone only: open the mobile menu and screenshot
//          [--eval "expr"]    extra expression, result printed per page
//          [--pre "js"]       script injected before any page script
//          [--only desktop|tablet|phone]
// Needs Chrome or Edge installed; set CHROME=path to override.
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const VALUED = new Set(["--eval", "--wait", "--wheel", "--pre", "--only", "--root"]);
const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = opt("--root") ? normalize(opt("--root")) : join(repo, "dist");
const shots = args.includes("--shots");
const full = args.includes("--full"); // whole page, for normally scrolling pages
const extraEval = opt("--eval");
const settle = opt("--wait") ? Number(opt("--wait")) : 2500;
const menu = args.includes("--menu");
const wheelStops = opt("--wheel") ? opt("--wheel").split(",").map(Number) : [];
const preScript = opt("--pre");
const pages = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
const PAGES = pages.length ? pages : ["", "research", "cir", "philosophy", "evidence", "contact", "missing-page"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "tablet", width: 834, height: 1112, mobile: true },
  { name: "phone", width: 390, height: 844, mobile: true }
].filter((v) => !opt("--only") || v.name === opt("--only"));

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".buf": "application/octet-stream",
  ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".txt": "text/plain" };

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  if (!extname(path) && existsSync(join(root, path + ".html"))) path += ".html"; // vercel.json cleanUrls
  const file = normalize(join(root, path));
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/html" }); res.end(await readFile(join(root, "404.html"))); return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(await readFile(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const chromePath = process.env.CHROME || ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
if (!chromePath) { console.error("No Chrome found. Set CHROME."); process.exit(2); }
const profile = join(tmpdir(), "dotrixai-check-" + Date.now());
const chrome = spawn(chromePath, ["--headless=new", "--remote-debugging-port=0", "--no-first-run", "--no-default-browser-check", `--user-data-dir=${profile}`,
  "--hide-scrollbars", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const wsUrl = await new Promise((resolve, reject) => {
  let buf = "";
  chrome.stderr.on("data", (d) => { buf += d; const mm = buf.match(/ws:\/\/[^\s]+/); if (mm) resolve(mm[0]); });
  setTimeout(() => reject(new Error("Chrome did not start")), 15000);
});

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r));
let seq = 0;
const pending = new Map();
const handlers = new Set();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); }
  else handlers.forEach((h) => h(msg));
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs inside the page: overflow plus the house copy rules on the rendered text.
function pageInfo() {
  const d = document.documentElement;
  const over = Math.max(d.scrollWidth, document.body.scrollWidth) - d.clientWidth;
  const text = document.body.innerText;
  const dash = (text.match(/.{0,30}[-‐-―−].{0,30}/) || [null])[0];
  const long = text.split(/[\n\t]/).flatMap((l) => l.split(/(?<=[.!?])\s+/))
    .find((x) => x.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length > 15) || null;
  return { title: document.title, overflowX: over, dash, long };
}

let failures = 0;
const shotDir = join(repo, "work", "shots");
if (shots || menu || wheelStops.length) await mkdir(shotDir, { recursive: true });
const shotName = (vp, page, suffix = "") => join(shotDir, `${vp.name}-${page.replace(/[^a-z0-9]+/gi, "_") || "landing"}${suffix}.png`);
async function shoot(sessionId, file, whole) {
  let o = { format: "png" };
  if (whole) {
    const m = await send("Page.getLayoutMetrics", {}, sessionId);
    o = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: m.cssContentSize.width, height: Math.min(m.cssContentSize.height, 12000), scale: 1 } };
  }
  const s = await send("Page.captureScreenshot", o, sessionId);
  await writeFile(file, Buffer.from(s.data, "base64"));
}

for (const vp of VIEWPORTS) {
  for (const page of PAGES) {
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const problems = [];
    const onMsg = (msg) => {
      if (msg.sessionId !== sessionId) return;
      if (msg.method === "Runtime.exceptionThrown") problems.push("exception: " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text).split("\n")[0]);
      if (msg.method === "Runtime.consoleAPICalled" && ["error", "assert"].includes(msg.params.type)) problems.push("console: " + msg.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 200));
      if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error" && !/favicon|\/missing-page$/.test(msg.params.entry.url || "")) problems.push("log: " + msg.params.entry.text.slice(0, 160) + " " + (msg.params.entry.url || ""));
      if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400 && msg.params.response.url.startsWith(base) && !msg.params.response.url.endsWith("/missing-page")) problems.push("http " + msg.params.response.status + ": " + msg.params.response.url.replace(base, ""));
      if (msg.method === "Network.loadingFailed" && !msg.params.canceled) problems.push("request failed: " + msg.params.errorText);
    };
    handlers.add(onMsg);
    await send("Runtime.enable", {}, sessionId);
    await send("Log.enable", {}, sessionId);
    await send("Network.enable", {}, sessionId);
    await send("Page.enable", {}, sessionId);
    await send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile }, sessionId);
    if (vp.mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 }, sessionId);
    await send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"], origin: base.replace(/\/$/, "") }).catch(() => {});
    if (preScript) await send("Page.addScriptToEvaluateOnNewDocument", { source: preScript }, sessionId);
    await send("Page.navigate", { url: base + page }, sessionId);
    await sleep(settle);
    const evalExpr = `(async () => {
      const info = (${pageInfo.toString()})();
      ${extraEval ? "info.extra = await (" + extraEval + ");" : ""}
      return JSON.stringify(info);
    })()`;
    const r = await send("Runtime.evaluate", { expression: evalExpr, returnByValue: true, awaitPromise: true }, sessionId);
    if (r.exceptionDetails) problems.push("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).split("\n")[0]);
    const info = JSON.parse((r.result && r.result.value) || "{}");
    if (info.overflowX > 1) problems.push("horizontal overflow " + info.overflowX + "px");
    if (info.dash) problems.push("dash in visible text: " + JSON.stringify(info.dash));
    if (info.long) problems.push("sentence over 15 words: " + JSON.stringify(info.long));
    if (shots) {
      if (full) { await send("Runtime.evaluate", { expression: "document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))" }, sessionId); await sleep(1200); }
      await shoot(sessionId, shotName(vp, page), full);
    }
    if (menu && vp.name === "phone") {
      await send("Runtime.evaluate", { expression: "document.querySelector('[data-nav-toggle]').click()" }, sessionId);
      await sleep(700);
      await shoot(sessionId, shotName(vp, page, "-menu"));
    }
    let wheelAt = 0;
    for (const target of wheelStops) {
      while (wheelAt < target) {
        const step = Math.min(240, target - wheelAt);
        await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: vp.width / 2, y: vp.height / 2, deltaX: 0, deltaY: step }, sessionId);
        wheelAt += step;
        await sleep(40);
      }
      await sleep(2500);
      await shoot(sessionId, shotName(vp, page, "-wheel" + target));
    }
    handlers.delete(onMsg);
    await send("Target.closeTarget", { targetId });
    const status = problems.length ? "FAIL" : "ok  ";
    if (problems.length) failures++;
    console.log(`${status} ${vp.name.padEnd(7)} ${page.padEnd(28)} ${info.title || ""}${info.extra !== undefined ? " | " + JSON.stringify(info.extra) : ""}`);
    [...new Set(problems)].forEach((p) => console.log("       " + p));
  }
}

ws.close();
chrome.kill();
server.close();
process.exit(failures ? 1 : 0);
