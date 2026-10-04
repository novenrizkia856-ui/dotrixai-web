// CIR research state shown on /cir. This is the file to edit as CIR evolves.
//
// Every number here was taken from the CIR research files (D:/CIR) on the date in
// `asOf`, with its evidence or experiment ID kept in `src` so it can be traced.
// Rules when updating:
//   - Change a status before deleting a row. Superseded results stay visible.
//   - Label numbers: "measured" (read off an instrument), "estimated" (computed
//     from measurements), "projected" (extrapolated beyond what was run).
//   - Visible copy follows the house rules: no hyphens or dashes, no sentence
//     over 15 words. `npm run build` checks both.
// Each export below renders into a {{token}} used by src/pages/cir.html.

export const asOf = { iso: "2026-10-04", label: "4 October 2026" };

// ---------- small renderers ----------

const STATUS = {
  reproduced: "Reproduced",
  supported: "Supported",
  preliminary: "Preliminary",
  contested: "Contested",
  superseded: "Superseded",
  quarantined: "Quarantined",
  falsified: "Falsified",
  evaluating: "Under evaluation",
  passed: "Passed in tested regime",
  challenged: "Under challenge",
  "not-reached": "Not reached",
  running: "Running",
  queued: "Queued",
  conditional: "Conditional",
  better: "Better",
  parity: "Parity",
  worse: "Worse",
  mixed: "Mixed",
  untested: "Not yet tested",
  "fails-all": "Fails for all models",
  unreliable: "Instrument unreliable"
};
const LABEL = { measured: "Measured", estimated: "Estimated", projected: "Projected" };

export const tag = (key) => `<span class="tag is-${key}">${STATUS[key] ?? key}</span>`;
export const kind = (key) => `<span class="tag is-kind is-${key}" title="${LABEL[key]} number">${LABEL[key]}</span>`;
const tags = (keys) => keys.map(tag).join(" ");

const table = ({ label, cols, rows, className = "" }) => `<div class="dtable_wrap"><table class="dtable is-stack ${className}" aria-label="${label}">
<thead><tr>${cols.map((c) => `<th scope="col"${c.num ? ' class="num"' : ""}>${c.title}</th>`).join("")}</tr></thead>
<tbody>
${rows.map((r) => `<tr>${cols.map((c, i) => {
    const cell = r[c.key] ?? "";
    const tagName = i === 0 ? "th scope=\"row\"" : "td";
    const close = i === 0 ? "th" : "td";
    return `<${tagName} data-label="${c.title}"${c.num ? ' class="num"' : ""}>${i === 0 ? cell : `<div class="dcell">${cell}</div>`}</${close}>`;
  }).join("")}</tr>`).join("\n")}
</tbody></table></div>`;

// ---------- latest update ----------

export const latest = [
  {
    title: "A cheaper Transformer erased the BPB advantage",
    body: "A Transformer with a single global attention layer matched our previous baseline. It did so at about half the cost per token. Against it, our strongest candidate has no cost advantage in BPB."
  },
  {
    title: "A bias in our recall estimator was found and corrected",
    body: "The earlier recall cost figure of 0.36 to 0.69 favoured CIR. Corrected, the advantage against the cheapest Transformers is marginal: 0.74 to 1.0."
  },
  {
    title: "R81 interim: the cheaper hybrid keeps little of the margin",
    body: "At 750 updates, A025 keeps about 15% of A010's BPB margin over B1A. The BPB criterion will likely fail. The formal verdict is still pending."
  },
  {
    title: "The long context route narrowed further",
    body: "No softmax model at this scale copies text from beyond about 2,000 tokens. The recurrent state carries almost none either. Only exact n gram lookup copies at any distance."
  }
];

const renderLatest = () => `<ol class="updates" role="list">
${latest.map((u) => `<li class="update"><h3>${u.title}</h3><p>${u.body}</p></li>`).join("\n")}
</ol>`;

// ---------- gates ----------

export const gates = [
  {
    gate: "<code>≤ 0.75×</code>", meaning: "Signal",
    earlier: `${tag("passed")}<p>BPB, two seeds: 0.633 and 0.643 at final Q. ${kind("estimated")}</p>`,
    frontier: `${tag("not-reached")}<p>BPB 1.23 to 1.27×. Recall 0.74 to 1.0×, one seed. ${kind("estimated")}</p>`
  },
  {
    gate: "<code>≤ 0.50×</code>", meaning: "Interesting",
    earlier: `${tag("contested")}<p>0.50 once, one seed, candidate A019. It rises to 0.84 when the Transformer gets the same module. ${kind("estimated")}</p>`,
    frontier: `${tag("not-reached")}<p>No candidate is close.</p>`
  },
  { gate: "<code>≤ 0.20×</code>", meaning: "Industry level", earlier: tag("not-reached"), frontier: tag("not-reached") },
  { gate: "<code>≤ 0.10×</code>", meaning: "Breakthrough level", earlier: tag("not-reached"), frontier: tag("not-reached") }
];

const renderGates = () => table({
  label: "Impact gates and their current status",
  cols: [
    { key: "gate", title: "Gate" },
    { key: "meaning", title: "Meaning" },
    { key: "earlier", title: "Against earlier strong Transformers" },
    { key: "frontier", title: "Against the cheapest known Transformer" }
  ],
  rows: gates,
  className: "is-gates"
});

// ---------- evidence ----------
// status: one or more STATUS keys. src: ledger IDs, kept for traceability.

export const evidence = [
  {
    finding: "A010 beats a gated local global Transformer",
    status: ["reproduced", "contested"],
    evidence: `0.041 lower BPB at 1,500 updates. Cost to final Q 0.633 and 0.643. ${kind("estimated")}`,
    meaning: "A real advantage over that baseline, in two seeds.",
    limit: "That baseline is no longer the cheapest. Its learning rate was inherited, not screened.",
    src: "I211, R67"
  },
  {
    finding: "A010 beats a gated full attention Transformer",
    status: ["reproduced"],
    evidence: `0.034 lower BPB. Cost to final Q 0.59 to 0.63. ${kind("estimated")}`,
    meaning: "Holds against the strongest Transformer in quality we tested.",
    limit: "Full attention is an expensive baseline at this scale.",
    src: "I203, R62"
  },
  {
    finding: "A one attention Transformer (B1A) is the cheapest fair baseline found",
    status: ["supported"],
    evidence: `Matches the local global Transformer within 0.005 BPB. Costs 0.502× per token. ${kind("measured")}`,
    meaning: "Every earlier BPB cost ratio was measured against an inefficient baseline.",
    limit: "One seed. Found by our own baseline attack, not by literature.",
    src: "I242, R79"
  },
  {
    finding: "A010 against B1A on BPB",
    status: ["preliminary"],
    evidence: `Cost to matched BPB 1.23 to 1.27×. At equal compute, a 0.002 BPB tie. ${kind("estimated")}`,
    meaning: "No BPB cost advantage against the cheapest Transformer.",
    limit: "One seed per arm.",
    src: "I242, I244, I248"
  },
  {
    finding: "Associative recall cost against the cheapest Transformers",
    status: ["contested"],
    evidence: `0.74 to 1.0× after estimator correction. ${kind("estimated")}`,
    meaning: "Marginal. Large recall advantages exist only against expensive Transformers.",
    limit: "Depends on the quality level and seed chosen.",
    src: "I245"
  },
  {
    finding: "Recall cost of 0.36 to 0.69",
    status: ["superseded"],
    evidence: "Charged the baseline its full 1,500 updates although its recall had plateaued.",
    meaning: "The estimator was biased toward CIR.",
    limit: "Replaced by first crossing on monotone smoothed curves.",
    src: "I241, I245"
  },
  {
    finding: "Width 448 against the gated local global Transformer",
    status: ["preliminary"],
    evidence: `Cost 0.719, worse than 0.64 at width 320. ${kind("estimated")}`,
    meaning: "Signal gate still passed, but the advantage shrank with width.",
    limit: "Tokens were held fixed, so tokens per parameter fell. One seed.",
    src: "I221, R69"
  },
  {
    finding: "Engram helps the Transformer more than CIR",
    status: ["supported"],
    evidence: `BPB gain 0.118 for the Transformer versus 0.093 for A010, at 750 updates. ${kind("measured")}`,
    meaning: "This generic memory module closes about 63% of A010's margin.",
    limit: "Run to 750 updates only. The longer comparison was cancelled.",
    src: "I224, R64"
  },
  {
    finding: "Static n gram heads (candidate A019)",
    status: ["contested"],
    evidence: `0.50 against a standard Transformer. 0.84 when the Transformer also gets n gram heads. ${kind("estimated")}`,
    meaning: "The gain comes from a generic module, not from the recurrent layers.",
    limit: "One seed. The mechanism is prior art.",
    src: "I240, R72"
  },
  {
    finding: "A019 cost of 0.530 at intermediate Q",
    status: ["superseded"],
    evidence: "Measured at 750 updates, before final Q and symmetric baselines.",
    meaning: "Early speed from static lookup faded against a matched baseline.",
    limit: "Kept visible as an example of a misleading screen.",
    src: "I222, I228"
  },
  {
    finding: "Pure delta rule recurrence at 0.587",
    status: ["superseded"],
    evidence: "Held only when both models used AdamW. Under Muon, the Transformer won by 0.051 BPB.",
    meaning: "The advantage reflected slow Transformer learning, not a structural edge.",
    limit: "Retained in the ledger for history only.",
    src: "I158, I177"
  },
  {
    finding: "Verbatim copying from distant context",
    status: ["supported"],
    evidence: `At a gap of 2,560 tokens, A010 and B1A gain 0.04 bits per token. Exact n gram heads gain 2.9. ${kind("measured")}`,
    meaning: "Neither attention nor recurrent state copies far at this scale. Only exact lookup does.",
    limit: "One probe, 32 samples per gap.",
    src: "I250"
  },
  {
    finding: "Cost sessions with uncontrolled core placement",
    status: ["quarantined"],
    evidence: "Per token ratios varied by more than the effects being measured.",
    meaning: "Replaced by a canonical instrument with fixed cores and calibration.",
    limit: "Ratios are compared only within one valid session.",
    src: "I183, I186"
  },
  {
    finding: "Thin recurrent mixers on the cheapest Transformer (A025)",
    status: ["evaluating"],
    evidence: "At 750 updates it keeps about 15% of A010's BPB margin over B1A.",
    meaning: "The BPB cost criterion of 0.90 will likely fail.",
    limit: "Interim, one seed. No verdict yet.",
    src: "R81"
  }
];

const renderEvidence = () => table({
  label: "CIR evidence table",
  cols: [
    { key: "finding", title: "Finding" },
    { key: "statusHtml", title: "Status" },
    { key: "evidence", title: "Evidence" },
    { key: "meaning", title: "Interpretation" },
    { key: "limit", title: "Limitation" }
  ],
  rows: evidence.map((e) => ({ ...e, statusHtml: tags(e.status) })),
  className: "is-evidence"
});

// ---------- cost curve (one valid cost session, seed 11; I240) ----------

const curveX = [375, 500, 750, 1000, 1250, 1500];
export const curve = [
  { id: "a010-std", name: "A010 vs standard", long: "A010 against the gated local global Transformer", color: "a", dash: false,
    y: [0.80, 0.80, 0.74, 0.71, 0.68, 0.63] },
  { id: "a019-std", name: "A019 vs standard", long: "A019 against the gated local global Transformer", color: "b", dash: false,
    y: [0.38, 0.46, 0.51, 0.54, 0.54, 0.50] },
  { id: "a010-mod", name: "A010 vs TF with n gram heads", long: "A010 against a Transformer with the same n gram heads", color: "a", dash: true,
    y: [null, null, 1.14, 1.10, 1.07, 1.06] },
  { id: "a019-mod", name: "A019 vs TF with n gram heads", long: "A019 against a Transformer with the same n gram heads", color: "b", dash: true,
    y: [null, null, 0.79, 0.83, 0.85, 0.84] }
];

const fmt = (v) => v.toFixed(2);

function svgChart({ w, h, font, pad, compact }) {
  const yMin = 0.3, yMax = 1.2;
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const sx = (i) => x0 + (i / (curveX.length - 1)) * (x1 - x0);
  const sy = (v) => y1 - ((v - yMin) / (yMax - yMin)) * (y1 - y0);
  const ticks = [0.3, 0.5, 0.75, 1.0, 1.2];
  const refs = [
    { v: 1.0, label: "parity 1.0" },
    { v: 0.75, label: "signal 0.75" },
    { v: 0.5, label: "interesting 0.50" }
  ];
  const parts = [];
  for (const t of ticks) {
    parts.push(`<line class="chart_grid" x1="${x0}" x2="${x1}" y1="${sy(t)}" y2="${sy(t)}"/>`);
    parts.push(`<text class="chart_tick" x="${x0 - 8}" y="${sy(t)}" dy="0.32em" text-anchor="end" font-size="${font}">${t.toFixed(2)}</text>`);
  }
  for (const r of refs) {
    parts.push(`<line class="chart_ref" x1="${x0}" x2="${x1}" y1="${sy(r.v)}" y2="${sy(r.v)}"/>`);
    if (!compact) parts.push(`<text class="chart_ref_label" x="${x0 + 6}" y="${sy(r.v) - 6}" font-size="${font - 1}">${r.label}</text>`);
  }
  curveX.forEach((x, i) => {
    parts.push(`<text class="chart_tick" x="${sx(i)}" y="${y1 + font + 8}" text-anchor="middle" font-size="${font}">${compact && i % 2 ? "" : x}</text>`);
  });
  parts.push(`<line class="chart_axis" x1="${x0}" x2="${x1}" y1="${y1}" y2="${y1}"/>`);
  parts.push(`<text class="chart_axis_label" x="${(x0 + x1) / 2}" y="${h - 6}" text-anchor="middle" font-size="${font}">Q = baseline BPB after N updates</text>`);
  parts.push(`<text class="chart_axis_label" transform="translate(${font + 2} ${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle" font-size="${font}">cost ratio, lower favours CIR</text>`);
  for (const s of curve) {
    const pts = s.y.map((v, i) => (v == null ? null : [sx(i), sy(v)])).filter(Boolean);
    parts.push(`<polyline class="chart_line is-${s.color}${s.dash ? " is-dash" : ""}" points="${pts.map((p) => p.join(",")).join(" ")}"/>`);
    for (const [px, py] of pts) {
      parts.push(s.dash
        ? `<rect class="chart_dot is-${s.color} is-square" x="${px - 4.5}" y="${py - 4.5}" width="9" height="9" rx="1.5"/>`
        : `<circle class="chart_dot is-${s.color}" cx="${px}" cy="${py}" r="4.5"/>`);
    }
    if (!compact) {
      const last = pts[pts.length - 1];
      parts.push(`<text class="chart_direct" x="${last[0] + 10}" y="${last[1]}" dy="0.32em" font-size="${font - 1}">${fmt(s.y[s.y.length - 1])}</text>`);
    }
  }
  // hover and focus columns, one per Q level
  const colW = (x1 - x0) / (curveX.length - 1);
  curveX.forEach((x, i) => {
    const tip = [`Q = baseline at ${x} updates`, ...curve.map((s) => `${s.name}: ${s.y[i] == null ? "not measured" : fmt(s.y[i])}`)].join("|");
    parts.push(`<g class="chart_col" tabindex="0" data-tip="${tip}" role="img" aria-label="${tip.replace(/\|/g, ". ")}">` +
      `<rect class="chart_hit" x="${Math.max(x0 - 4, sx(i) - colW / 2)}" y="${y0}" width="${i === 0 || i === curveX.length - 1 ? colW / 2 + 4 : colW}" height="${y1 - y0}"/>` +
      `<line class="chart_cross" x1="${sx(i)}" x2="${sx(i)}" y1="${y0}" y2="${y1}"/></g>`);
  });
  return `<svg class="chart_svg${compact ? " is-compact" : " is-wide"}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="${compact ? "true" : "false"}" focusable="false">${parts.join("")}</svg>`;
}

const renderCurve = () => {
  const legend = curve.map((s) => `<li><span class="chart_key is-${s.color}${s.dash ? " is-dash" : ""}" aria-hidden="true"></span>${s.long}</li>`).join("");
  const rows = curveX.map((x, i) => ({
    q: `Baseline at ${x} updates`,
    ...Object.fromEntries(curve.map((s) => [s.id, s.y[i] == null ? "not measured" : fmt(s.y[i])]))
  }));
  return `<figure class="chart reveal" data-chart>
<ul class="chart_legend" role="list">${legend}</ul>
<div class="chart_plot">
${svgChart({ w: 720, h: 400, font: 13, pad: { l: 64, r: 52, t: 16, b: 58 }, compact: false })}
${svgChart({ w: 360, h: 340, font: 13, pad: { l: 52, r: 14, t: 12, b: 54 }, compact: true })}
<div class="chart_tip" role="status" aria-live="polite" hidden></div>
</div>
<figcaption>Cost for CIR to reach the baseline's BPB after N updates. Below 1.0 favours CIR. One valid cost session, seed 11. Dashed lines give the Transformer the same n gram heads. ${kind("estimated")}</figcaption>
</figure>
${table({
    label: "Cost ratio by matched quality level",
    cols: [
      { key: "q", title: "Q level" },
      ...curve.map((s) => ({ key: s.id, title: s.name, num: true }))
    ],
    rows,
    className: "is-curve"
  })}`;
};

// ---------- capability ----------

export const capabilities = [
  { cap: "Language prediction (BPB)", status: "worse", note: "Against the cheapest Transformer: 1.23 to 1.27× the cost. A tie at equal compute." },
  { cap: "Short range copying", status: "better", note: "A010 copies best at a distance of 256 tokens. Compared with Transformers without n gram heads." },
  { cap: "Long verbatim copying", status: "worse", note: "At 2,560 tokens A010 and B1A copy almost nothing. Exact n gram heads keep about 2.9 bits." },
  { cap: "Associative recall", status: "mixed", note: "Better than expensive Transformers. Marginal against the cheapest: 0.74 to 1.0× the cost." },
  { cap: "Bracket closing", status: "better", note: "About one bit per token better at distances of 17 to 128. Exploratory probe, small sample." },
  { cap: "Grammar", status: "unreliable", note: "All models score near chance at 4M parameters with our instrument." },
  { cap: "Relational binding", status: "unreliable", note: "Earlier instruments were too weak to separate models at this scale." },
  { cap: "Long range memory", status: "parity", note: "No CIR advantage found. Softmax models use little context beyond about 2,000 tokens here." },
  { cap: "State tracking (synthetic)", status: "untested", note: "Parity, modular counting and permutation tasks are queued as H032." },
  { cap: "Reasoning", status: "untested", note: "Not measurable at this scale with current instruments." },
  { cap: "Coherent generation", status: "fails-all", note: "Fails for every 4M model, CIR and Transformer alike." },
  { cap: "Robustness", status: "untested", note: "Not yet evaluated." }
];

const renderCapabilities = () => table({
  label: "Capability probes and their status",
  cols: [
    { key: "cap", title: "Capability" },
    { key: "statusHtml", title: "CIR status" },
    { key: "note", title: "Detail" }
  ],
  rows: capabilities.map((c) => ({ ...c, statusHtml: tag(c.status) })),
  className: "is-caps"
});

// ---------- active experiments ----------

export const experiments = [
  { id: "R81", question: "Can thin recurrent mixers added to B1A beat B1A on BPB or recall cost?", status: "running",
    note: "Frozen criteria: BPB cost ≤ 0.90 and recall cost ≤ 0.75. Interim curves suggest the BPB criterion will fail." },
  { id: "R82", question: "How much can an optimized implementation save, and how cheap is a windowed B1A?", status: "queued",
    note: "One canonical timing session after R81. It does not change the R81 verdict." },
  { id: "H032", question: "Can recurrence with negative eigenvalues track state where one attention layer cannot?", status: "queued",
    note: "Synthetic parity, modular counting and permutations. Prior art covers this idea, so any result is a narrow capability claim." },
  { id: "R74", question: "Can the dense projections of a mixing layer be removed without losing quality?", status: "queued",
    note: "Now also compared with B1A." },
  { id: "A026", question: "Does the negative eigenvalue variant keep language quality?", status: "conditional",
    note: "Runs only if H032 passes its synthetic tests." }
];

const renderExperiments = () => table({
  label: "Active and queued experiments",
  cols: [
    { key: "id", title: "Experiment" },
    { key: "question", title: "Question" },
    { key: "statusHtml", title: "Status" },
    { key: "note", title: "Notes" }
  ],
  rows: experiments.map((e) => ({ ...e, statusHtml: tag(e.status) })),
  className: "is-experiments"
});

// ---------- timeline ----------

export const timeline = [
  { date: "24 Sep", title: "Pure recurrence falsified as first framed", body: "A delta rule memory model lost to a strong Transformer at contexts up to 4,096." },
  { date: "26 Sep", title: "A narrow signal for pure recurrence", body: "At 4,096 tokens and batch 8, delta reached 0.587 and 0.594 over two seeds. Both arms used AdamW." },
  { date: "27 Sep", title: "Muon removed that signal", body: "With Muon on both sides, the Transformer won by 0.051 BPB. The claim was withdrawn." },
  { date: "27 Sep", title: "Mechanism found: final layer induction", body: "Muon makes Transformer induction heads form early. So the hybrid A010 kept one attention layer last." },
  { date: "30 Sep", title: "A010 replicated on a second seed", body: "0.034 lower BPB than the strongest gated Transformer across two seeds." },
  { date: "1 Oct", title: "A cheaper baseline narrowed the claim", body: "Gated local global attention cost 9% less per token. A010 held at 0.63 to 0.64." },
  { date: "2 Oct", title: "First scaling point", body: "At width 448 the ratio rose to 0.72, still inside the signal gate." },
  { date: "3 Oct", title: "Generic modules close the gap", body: "Engram and n gram heads helped Transformers as much or more. The delta specific edge fell to about zero." },
  { date: "3 Oct", title: "Cheapest Transformer found: B1A", body: "One global attention layer matched the old baseline at half the cost per token." },
  { date: "4 Oct", title: "Corrections and a new direction", body: "Equal compute gave a BPB tie. The recall estimator was corrected. An analytic bound redirected the search." },
  { date: "4 Oct", title: "Long copy probe", body: "Recurrent state carried almost no verbatim copies past an attention window. The long context route weakened further." }
];

const renderTimeline = () => `<ol class="timeline" role="list">
${timeline.map((t) => `<li class="timeline_item"><span class="timeline_date u-mono">${t.date}</span><div><h3>${t.title}</h3><p>${t.body}</p></div></li>`).join("\n")}
</ol>`;

// ---------- tokens for the build ----------

export const tokens = () => ({
  cirAsOf: asOf.label,
  cirAsOfIso: asOf.iso,
  cirLatest: renderLatest(),
  cirGates: renderGates(),
  cirEvidence: renderEvidence(),
  cirCurve: renderCurve(),
  cirCapabilities: renderCapabilities(),
  cirExperiments: renderExperiments(),
  cirTimeline: renderTimeline(),
  tagMeasured: kind("measured"),
  tagEstimated: kind("estimated"),
  tagProjected: kind("projected")
});
