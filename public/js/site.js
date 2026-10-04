// DotrixAI site behaviour: mobile navigation, hero word reveal,
// scroll reveal, the expanding media band and its dot field canvas.
// Everything degrades to a static, fully readable page without JS.
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- navigation ---------- */
  const nav = document.querySelector("[data-nav-root]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (nav && toggle) {
    const label = toggle.querySelector(".u-sr-only");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    window.matchMedia("(min-width: 861px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  /* ---------- hero word reveal ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
        const span = document.createElement("span");
        span.className = "animate-word";
        span.textContent = part;
        span.style.transitionDelay = Math.round(100 + Math.random() * 350) + "ms";
        frag.append(span);
      });
      node.replaceWith(frag);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-words-in")));
  });

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- media band: grows to full width as it enters ---------- */
  const bands = [...document.querySelectorAll("[data-band]")];
  if (bands.length && !reduceMotion.matches) {
    const resolveMargin = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;width:var(--site-margin)";
      document.body.append(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return w;
    };
    let margin = resolveMargin();
    const run = () => {
      const vh = window.innerHeight;
      const vw = root.clientWidth;
      bands.forEach((band) => {
        const rect = band.parentElement.getBoundingClientRect();
        // 0 while the band sits low in the viewport, 1 once its top reaches the top edge
        const p = Math.min(1, Math.max(0, 1 - rect.top / (vh * 0.75)));
        const e = p * p * (3 - 2 * p);
        band.style.setProperty("--band-inset", (margin * (1 - e)).toFixed(2) + "px");
        band.style.setProperty("--band-radius", (24 * (1 - e)).toFixed(2) + "px");
        const siteW = Math.min(vw, 89.5 * 16);
        band.style.setProperty("--band-width", (siteW + (vw - siteW) * e).toFixed(2) + "px");
      });
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; run(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { margin = resolveMargin(); onScroll(); });
    run();
  }

  /* ---------- dot field ---------- */
  document.querySelectorAll("[data-dotfield]").forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false, last = 0;
    const gap = 16;
    const buckets = 7;
    const t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(performance.now());
    };

    // A slow, smooth scalar field: interference of a few low frequency waves.
    const field = (x, y, t) => {
      const nx = x / w, ny = y / h;
      const a = Math.sin(nx * 5.1 + t * 0.21) * Math.cos(ny * 4.3 - t * 0.17);
      const b = Math.sin((nx + ny) * 3.7 - t * 0.13);
      const c = Math.cos(Math.hypot(nx - 0.5, (ny - 0.5) * 0.7) * 9 - t * 0.35);
      return (a * 0.45 + b * 0.25 + c * 0.3 + 1) / 2;
    };

    function draw(now) {
      if (!w || !h) return;
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const paths = Array.from({ length: buckets }, () => new Path2D());
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      const ox = (w - (cols - 1) * gap) / 2;
      const oy = (h - (rows - 1) * gap) / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = ox + i * gap, y = oy + j * gap;
          const v = field(x, y, t);
          const k = Math.max(0, Math.min(buckets - 1, Math.floor(v * v * buckets)));
          const r = 0.6 + v * v * 1.9;
          paths[k].moveTo(x + r, y);
          paths[k].arc(x, y, r, 0, Math.PI * 2);
        }
      }
      for (let k = 0; k < buckets; k++) {
        ctx.fillStyle = `rgba(250, 249, 245, ${(0.05 + (k / (buckets - 1)) * 0.5).toFixed(3)})`;
        ctx.fill(paths[k]);
      }
    }

    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      if (now - last > 40) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduceMotion.matches) raf = requestAnimationFrame(loop); };

    new ResizeObserver(resize).observe(canvas);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => { visible = !document.hidden && visible; if (!document.hidden) start(); });
    resize();
  });

  /* ---------- chart tooltips (values are also in the table below each chart) ---------- */
  document.querySelectorAll("[data-chart]").forEach((chart) => {
    const plot = chart.querySelector(".chart_plot");
    const tip = chart.querySelector(".chart_tip");
    if (!plot || !tip) return;
    const show = (col) => {
      const [title, ...rows] = col.dataset.tip.split("|");
      tip.replaceChildren();
      const head = document.createElement("div");
      head.className = "chart_tip_title";
      head.textContent = title;
      tip.append(head);
      rows.forEach((r) => {
        const i = r.lastIndexOf(": ");
        const row = document.createElement("div");
        row.className = "chart_tip_row";
        const name = document.createElement("span");
        name.textContent = r.slice(0, i);
        const value = document.createElement("b");
        value.textContent = r.slice(i + 2);
        row.append(name, value);
        tip.append(row);
      });
      tip.hidden = false;
      const box = plot.getBoundingClientRect();
      const c = col.querySelector(".chart_cross").getBoundingClientRect();
      const x = c.left - box.left;
      const left = x + 16 + tip.offsetWidth > box.width ? x - 16 - tip.offsetWidth : x + 16;
      tip.style.left = Math.max(0, left) + "px";
      tip.style.top = "8px";
    };
    const hide = () => { tip.hidden = true; };
    chart.querySelectorAll(".chart_col").forEach((col) => {
      col.addEventListener("pointerenter", () => show(col));
      col.addEventListener("focus", () => show(col));
      col.addEventListener("pointerleave", hide);
      col.addEventListener("blur", hide);
    });
  });
})();
