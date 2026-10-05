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

export const asOf = { iso: "2026-10-05", label: "5 October 2026" };

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
    title: "The cheapest hybrid only breaks even",
    body: "A025 adds thin recurrent mixers to B1A. It reached B1A's BPB at 0.985× the cost, 0.949× optimized. Both frozen criteria failed, so this hybrid family is closed here."
  },
  {
    title: "One real asymmetry: state tracking",
    body: "Recurrence that allows negative eigenvalues learned parity and extrapolated it. Small Transformers, including B1A, never learned it. The mechanism is prior art."
  },
  {
    title: "Inside a language model it is unreliable",
    body: "Trained on text with 6% parity examples, A025n learned parity in one of three runs. B1A never did. This is a narrow capability result, not a cost result."
  },
  {
    title: "Next: a stronger signal and formal languages",
    body: "R88 raises the parity share to 15%. R89 tests whether a short formal language warm up saves tokens. It also asks for which organization."
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
    frontier: `${tag("not-reached")}<p>Best is A025 at 0.949 to 0.985×, break even. A010 costs 1.23 to 1.27×. ${kind("estimated")}</p>`
  },
  {
    gate: "<code>≤ 0.50×</code>", meaning: "Interesting",
    earlier: `${tag("contested")}<p>0.50 once, one seed, candidate A019. It rises to 0.84 when the Transformer gets the same module. ${kind("estimated")}</p>`,
    frontier: `${tag("not-reached")}<p>Out of reach for mixer substitution at this context length, by an analytic bound.</p>`
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
    status: ["falsified"],
    evidence: `Cost to B1A's BPB 0.985, or 0.949 optimized. Recall never reached B1A's level. ${kind("estimated")}`,
    meaning: "The hybrid family breaks even with the cheapest Transformer. It is closed at this context length.",
    limit: "One seed. Holds for this regime only.",
    src: "I251, I252"
  },
  {
    finding: "A windowed B1A is only slightly cheaper",
    status: ["supported"],
    evidence: `A 512 token window saves 8.6% per update, with up to 0.010 BPB loss. ${kind("measured")}`,
    meaning: "Not cheaper to matched quality. B1A stays the frontier baseline.",
    limit: "One timing session. An earlier estimate of 10 to 30% is superseded.",
    src: "I247, I252"
  },
  {
    finding: "Parity: negative eigenvalue recurrence vs small Transformers",
    status: ["supported"],
    evidence: `Tiny models trained at length 64 and tested at 256. Recurrence scored 0.96 to 0.98, Transformers about 0.50. ${kind("measured")}`,
    meaning: "A real but narrow expressivity asymmetry.",
    limit: "Synthetic and prior art. Transformers also failed in distribution here.",
    src: "I253"
  },
  {
    finding: "Parity inside the language model",
    status: ["preliminary"],
    evidence: `A025n learned it in one of three runs. B1A never did, through 1,500 updates. ${kind("measured")}`,
    meaning: "The mechanism is available, but it does not emerge reliably at this signal.",
    limit: "About 6% sparse synthetic data. A chosen benchmark.",
    src: "I254, I256, I257"
  },
  {
    finding: "A025n vs B1A on text mixed with parity data",
    status: ["preliminary"],
    evidence: `Cost to B1A's BPB 0.939. BPB 0.017 to 0.026 lower at 750 updates, two seeds. ${kind("estimated")}`,
    meaning: "The gap appears whether or not parity was learned.",
    limit: "Below the frozen 0.90 criterion. Mixed data only.",
    src: "I255, I256"
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
  { cap: "State tracking (synthetic)", status: "better", note: "Parity extrapolates in tiny recurrent models with negative eigenvalues. Modular counting is not solved." },
  { cap: "State tracking in a language model", status: "mixed", note: "Learned in one of three runs. B1A never learned it. Not reliable yet." },
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
  { id: "R88", question: "With 15% parity examples, does A025n learn parity on the seed that failed?", status: "running",
    note: "If it fails, the capability path closes at this scale." },
  { id: "R89", question: "Does a short warm up on a formal language save total tokens to matched quality?", status: "queued",
    note: "Tests B1A and A025 against clean controls. Criterion: total cost ≤ 0.90." },
  { id: "H033", question: "Does that saving depend on organization, favoring recurrence with negative eigenvalues?", status: "queued",
    note: "Draft hypothesis, low credence. R89 gives the first evidence." }
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
  { date: "4 Oct", title: "Long copy probe", body: "Recurrent state carried almost no verbatim copies past an attention window. The long context route weakened further." },
  { date: "4 Oct", title: "The cheapest hybrid breaks even", body: "A025 reached 0.985× B1A. The delta hybrid family was closed for BPB at this context length." },
  { date: "4 Oct", title: "Parity separates the organizations", body: "Recurrence with negative eigenvalues learned parity. Small Transformers did not." },
  { date: "5 Oct", title: "Unreliable inside the language model", body: "Parity emerged in one of three language model runs. The capability claim was narrowed." },
  { date: "5 Oct", title: "Formal language warm up", body: "Training briefly on a formal language before text is under test. It is compared across organizations." }
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
