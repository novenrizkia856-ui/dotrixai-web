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

export const asOf = { iso: "2026-10-10", label: "10 October 2026" };

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
  partial: "Partly passed",
  latest: "Latest",
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

// ---------- research updates (newest first) ----------
// Each snapshot is kept as it was written. Add a new entry at the top; never edit
// an old one except to fix a typo. `restored` marks text first published on the site.

export const updates = [
  {
    iso: "2026-10-10", date: "10 October 2026", time: "07:47 UTC",
    items: [
      {
        title: "The advantage differs sharply by language",
        body: "The 0.06× average is carried mostly by Indonesian. There the counted organization reaches 0.032×. In English the best result is 0.149×. A039 does not reach the target there at all."
      },
      {
        title: "In English the gain fades as data repeats",
        body: "Against B1A at equal budget, English moves from 0.053× to 0.121×, then out of reach. The small English corpus is seen up to 12.7 times."
      },
      {
        title: "A causal test is running",
        body: "R161 shrinks the Indonesian corpus to the English size. If the Indonesian advantage collapses, repetition is the cause, not language."
      },
      {
        title: "Every claim is now reported per language",
        body: "The program rule changed after this correction. Averages across languages can no longer stand alone."
      }
    ]
  },
  {
    iso: "2026-10-09", date: "9 October 2026", time: "daily summary",
    items: [
      {
        title: "Inference cost measured",
        body: "A cheaper inference variant trains at 0.065× the cost of TF LGN. It prefills text at 0.48×, on two seeds. Token by token decoding is not measured yet."
      },
      {
        title: "The ratio holds across four budgets",
        body: "Against B1A on the same budget, the ratio stays between 0.048 and 0.067. That holds from 0.5× to 4×. Above 4× nothing is claimed."
      },
      {
        title: "It survives text it never saw",
        body: "On Indonesian Wikipedia, absent from training, the ratio is 0.053 to 0.055× on two seeds."
      },
      {
        title: "A weak spot found through a tip on X",
        body: "Chunk starts were 0.13 bits worse than the rest. Overlapping chunks by 128 tokens removed the gap and gave 0.062× training cost."
      }
    ]
  },
  {
    iso: "2026-10-08", date: "8 October 2026", time: "daily summary",
    items: [
      {
        title: "A trained gate reaches the 0.10 gate",
        body: "A tiny trained gate mixes the network with counted statistics. The ratio fell to about 0.10× TF LGN, on two seeds."
      },
      {
        title: "A smaller network is cheaper still",
        body: "With 0.82M parameters and training on 1,024 token chunks, A039 reaches 0.0625 and 0.0634×. This is the cheapest configuration measured."
      },
      {
        title: "We corrected our own cost accounting",
        body: "The baseline cost used a bridged estimate. Measuring it directly made every ratio 4 to 5.5% less favourable. All figures now use the correction."
      },
      {
        title: "This is not a CIR architecture result",
        body: "The organization is a small Transformer plus classic counting. Close prior art exists, including modded nanogpt PR 380."
      }
    ]
  },
  {
    iso: "2026-10-07", date: "7 October 2026", time: "daily summary",
    items: [
      {
        title: "Counted statistics pass the 0.20 gate",
        body: "A small Transformer with counted n gram tables and a cache reached TF LGN quality. It cost 0.172 to 0.189× of TF LGN's training, two seeds, corrected."
      },
      {
        title: "Capability checks narrowed the claim",
        body: "At this stage long copying was weaker than TF LGN, and recall was fragile. The claim was limited to predictive quality."
      },
      {
        title: "Recurrence gains no edge from counting",
        body: "A context cache helped a pure recurrent model six times more than an attention model. Its higher cost per token still erased the gain."
      }
    ]
  },
  {
    iso: "2026-10-06", date: "6 October 2026", time: "daily summary",
    items: [
      {
        title: "Harder state tracking, then a cheaper rival",
        body: "Recurrence with two update steps per token solved permutation tasks. Small six layer Transformers failed them. A one layer Transformer with written steps reached the target more cheaply."
      },
      {
        title: "The state tracking cost claim fails",
        body: "The capability is real in tiny models. Its cost advantage is not, so the claim was withdrawn."
      },
      {
        title: "Counting enters the program",
        body: "N gram statistics counted from exactly the same training tokens improved every architecture. That makes them a generic lever, measured under D1."
      },
      {
        title: "A stricter quality metric",
        body: "Bits are now scored only where the 12 token context never appears in training. This removes credit for duplicated text."
      }
    ]
  },
  {
    iso: "2026-10-05b", date: "5 October 2026", time: "evening UTC",
    items: [
      {
        title: "A stronger signal makes parity emerge",
        body: "With 15% parity examples, A025n learned parity on the seed that failed before. B1A again did not."
      },
      {
        title: "Formal language warm up hurts at this size",
        body: "A short warm up before text raised BPB for both organizations at 750 updates. It hurt the CIR hybrid twice as much."
      }
    ]
  },
  {
    iso: "2026-10-05", date: "5 October 2026", time: "15:05 UTC", restored: true,
    items: [
      { title: "The cheapest hybrid only breaks even", body: "A025 adds thin recurrent mixers to B1A. It reached B1A's BPB at 0.985× the cost, 0.949× optimized. Both frozen criteria failed, so this hybrid family is closed here." },
      { title: "One real asymmetry: state tracking", body: "Recurrence that allows negative eigenvalues learned parity and extrapolated it. Small Transformers, including B1A, never learned it. The mechanism is prior art." },
      { title: "Inside a language model it is unreliable", body: "Trained on text with 6% parity examples, A025n learned parity in one of three runs. B1A never did. This is a narrow capability result, not a cost result." },
      { title: "Next: a stronger signal and formal languages", body: "R88 raises the parity share to 15%. R89 tests whether a short formal language warm up saves tokens. It also asks for which organization." }
    ]
  },
  {
    iso: "2026-10-04b", date: "4 October 2026", time: "07:27 UTC", restored: true,
    items: [
      { title: "A cheaper Transformer erased the BPB advantage", body: "A Transformer with a single global attention layer matched our previous baseline. It did so at about half the cost per token. Against it, our strongest candidate has no cost advantage in BPB." },
      { title: "A bias in our recall estimator was found and corrected", body: "The earlier recall cost figure of 0.36 to 0.69 favoured CIR. Corrected, the advantage against the cheapest Transformers is marginal: 0.74 to 1.0." },
      { title: "R81 interim: the cheaper hybrid keeps little of the margin", body: "At 750 updates, A025 keeps about 15% of A010's BPB margin over B1A. The BPB criterion will likely fail. The formal verdict is still pending." },
      { title: "The long context route narrowed further", body: "No softmax model at this scale copies text from beyond about 2,000 tokens. The recurrent state carries almost none either. Only exact n gram lookup copies at any distance." }
    ]
  },
  {
    iso: "2026-10-04", date: "4 October 2026", time: "06:05 UTC", restored: true,
    items: [
      { title: "A cheaper Transformer erased the BPB advantage", body: "A Transformer with a single global attention layer matched our previous baseline. It did so at about half the cost per token. Against it, our strongest candidate has no cost advantage in BPB." },
      { title: "A bias in our recall estimator was found and corrected", body: "The earlier recall cost figure of 0.36 to 0.69 favoured CIR. Corrected, the advantage against the cheapest Transformers is marginal: 0.74 to 1.0." },
      { title: "An analytic bound narrowed the search", body: "At 4,096 tokens of context, replacing attention alone cannot reach the 0.50 gate. This holds even if the replacement were free. The search is moving to other primitives." },
      { title: "R81 is running", body: "R81 adds thin recurrent mixers to the cheapest Transformer. Success and failure criteria were frozen before the run." }
    ]
  }
];

const renderUpdates = () => `<ol class="log" role="list">
${updates.map((u, i) => `<li class="log_entry${i === 0 ? " is-latest" : ""}" id="update-${u.iso}">
<div class="log_when"><time class="log_date" datetime="${u.iso.slice(0, 10)}">${u.date}</time><span class="log_time u-mono">${u.time}</span>${i === 0 ? `<span class="tag is-latest">Latest</span>` : ""}${u.restored ? `<span class="log_note">As published then</span>` : ""}</div>
<ul class="log_items" role="list">${u.items.map((it) => `<li><h3>${it.title}</h3><p>${it.body}</p></li>`).join("")}</ul>
</li>`).join("\n")}
</ol>`;

// ---------- gates ----------

export const gates = [
  {
    gate: "<code>≤ 0.75×</code>", meaning: "Signal",
    cir: `${tag("not-reached")}<p>Best is A025 at 0.949 to 0.985×, break even with B1A. ${kind("estimated")}</p>`,
    counted: `${tag("passed")}<p>Both languages. English from one run. ${kind("estimated")}</p>`
  },
  {
    gate: "<code>≤ 0.50×</code>", meaning: "Interesting",
    cir: `${tag("not-reached")}<p>Out of reach for mixer substitution at this context length.</p>`,
    counted: `${tag("passed")}<p>Both languages. Inference cost is about 0.49×. ${kind("estimated")}</p>`
  },
  {
    gate: "<code>≤ 0.20×</code>", meaning: "Industry level",
    cir: tag("not-reached"),
    counted: `${tag("passed")}<p>English best 0.149×, one seed. Indonesian 0.032×. ${kind("estimated")}</p>`
  },
  {
    gate: "<code>≤ 0.10×</code>", meaning: "Breakthrough level",
    cir: tag("not-reached"),
    counted: `${tag("partial")}<p>Indonesian and the average pass on two seeds. English does not. ${kind("estimated")}</p>`
  }
];

const renderGates = () => table({
  label: "Impact gates and their current status",
  cols: [
    { key: "gate", title: "Gate" },
    { key: "meaning", title: "Meaning" },
    { key: "cir", title: "CIR specific organizations, D2" },
    { key: "counted", title: "Generic counted organization, D1" }
  ],
  rows: gates,
  className: "is-gates"
});

// ---------- evidence ----------
// status: one or more STATUS keys. src: ledger IDs, kept for traceability.

export const evidence = [
  {
    finding: "Counted organization A039 vs TF LGN, average of both languages",
    status: ["reproduced"],
    evidence: `Training cost to TF LGN quality 0.0625 and 0.0634×, two seeds. ${kind("estimated")}`,
    meaning: "The cheapest organization measured. It passes the 0.10 gate on the average.",
    limit: "Generic and prior art. The average is carried by Indonesian.",
    src: "I316, I318, I313"
  },
  {
    finding: "The same organization, per language",
    status: ["supported"],
    evidence: `Indonesian 0.032×. English: A039 does not reach TF LGN quality; the best English setup reaches 0.149×. ${kind("estimated")}`,
    meaning: "A breakthrough level result in Indonesian, an industry level one in English.",
    limit: "English best from one evaluation run. Data repetition differs by language.",
    src: "I337, I338, I339"
  },
  {
    finding: "English advantage under longer training",
    status: ["contested"],
    evidence: `Against B1A at equal budget: 0.053× at 0.5×, then 0.121× at 1×. Not reached at 2× or 4×. ${kind("estimated")}`,
    meaning: "The English gain fades as the small English corpus repeats.",
    limit: "Cause under test in R161.",
    src: "I340"
  },
  {
    finding: "Budget ladder against B1A, average",
    status: ["supported"],
    evidence: `0.048, 0.063, 0.067 and 0.066× at 0.5×, 1×, 2× and 4× budget. ${kind("estimated")}`,
    meaning: "The average ratio stays flat across an eightfold budget range.",
    limit: "A fixed size opponent. A fitted multiplier of about 15× partly reflects its capacity limit.",
    src: "I326, I332, I334"
  },
  {
    finding: "Inference cost of a cheaper variant",
    status: ["reproduced"],
    evidence: `Training 0.065 and 0.066×, prefill inference 0.48× TF LGN; 0.49× with overlapping chunks. ${kind("estimated")}`,
    meaning: "Cheaper to train and to read text, not only to train.",
    limit: "Decoding token by token not measured. Count tables need about 434 MB of memory.",
    src: "I321, I323, I328, I333, I296"
  },
  {
    finding: "Text never seen in training",
    status: ["reproduced"],
    evidence: `Indonesian Wikipedia: 0.053 and 0.055× TF LGN, two seeds. ${kind("estimated")}`,
    meaning: "The advantage does not vanish outside the training text.",
    limit: "Same language. The gate is tuned on a little text from the new domain.",
    src: "I324, I325"
  },
  {
    finding: "Copying and recall in the counted organization",
    status: ["supported"],
    evidence: `Long copy gain 3.1 to 3.3 bits, above TF LGN's 2.89. Exact recall 0.99, but only with the gate. ${kind("measured")}`,
    meaning: "Counted pointers copy and look up well.",
    limit: "Single token lookup, not general associative reasoning.",
    src: "I299, I307, I309"
  },
  {
    finding: "Frontier attacks on the counted claim",
    status: ["supported"],
    evidence: "Four opponent routes: n gram heads, larger Transformers, twice the training, and short contexts.",
    meaning: "None of them reached the counted organization's cost.",
    limit: "Opponents up to width 448. Above 4× budget the frontier is unattacked.",
    src: "I291, I293, I312, I335"
  },
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
    finding: "Verbatim copying from distant context",
    status: ["supported"],
    evidence: `At a gap of 2,560 tokens, A010 and B1A gain 0.04 bits per token. Exact n gram heads gain 2.9. ${kind("measured")}`,
    meaning: "Neither attention nor recurrent state copies far at this scale. Only exact lookup does.",
    limit: "One probe, 32 samples per gap.",
    src: "I250"
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
    status: ["supported"],
    evidence: `At 6% parity data A025n learned it in one of three runs. At 15% it learned on the failed seed. B1A never did. ${kind("measured")}`,
    meaning: "The mechanism is available and emerges with a strong enough signal.",
    limit: "Synthetic data mixed into text. A chosen benchmark.",
    src: "I254, I256, I257, I258"
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
    finding: "Cost of CIR state tracking",
    status: ["falsified"],
    evidence: `On a permutation word problem, a one layer Transformer with written steps was cheaper. CIR recurrence lost. ${kind("measured")}`,
    meaning: "The capability is real, its cost advantage is not.",
    limit: "Tiny models and synthetic tasks.",
    src: "I264, I266, I267, I268"
  },
  {
    finding: "Formal language warm up before text",
    status: ["falsified"],
    evidence: `BPB rose by 0.025 for B1A and 0.050 for A025 at 750 updates. ${kind("measured")}`,
    meaning: "At 4M parameters the warm up hurts, and hurts the CIR hybrid more.",
    limit: "Published gains were measured at 160M parameters and above.",
    src: "I260"
  },
  {
    finding: "Other counted organization variants",
    status: ["falsified"],
    evidence: "Counts inside the training loss and a gate moved across languages. Also first layer attention and smaller networks.",
    meaning: "Each was worse. The working form mixes at inference with an in domain gate.",
    limit: "Tested at this scale only.",
    src: "I276, I302, I303, I320, I336"
  },
  {
    finding: "Ratios against TF LGN before 8 October",
    status: ["superseded"],
    evidence: "TF LGN's cost per token came from a bridged estimate, about 5% too low.",
    meaning: "Earlier ratios were 4 to 5.5% too favourable.",
    limit: "All current figures use the direct measurement.",
    src: "I313"
  },
  {
    finding: "Chunked inference without overlap",
    status: ["superseded"],
    evidence: "The first 128 tokens of each chunk scored 0.13 bits worse.",
    meaning: "Found after an outside tip. Overlapping chunks fixed it.",
    limit: "The fixed variant is the one now reported.",
    src: "I330, I331"
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
    finding: "Cost sessions with uncontrolled core placement",
    status: ["quarantined"],
    evidence: "Per token ratios varied by more than the effects being measured.",
    meaning: "Replaced by a canonical instrument with fixed cores and calibration.",
    limit: "Ratios are compared only within one valid session.",
    src: "I183, I186"
  },
  {
    finding: "Is data repetition the cause of the language gap?",
    status: ["evaluating"],
    evidence: "R161 trains on an Indonesian corpus cut to the English size.",
    meaning: "Decides whether the claim is about language or about repetition.",
    limit: "Running. One seed.",
    src: "R161, H038"
  }
];

// Evidence is grouped by where it stands, so negative results read as their own block.
const EVIDENCE_GROUPS = [
  { title: "Current evidence", test: (st) => !st.some((k) => ["falsified", "superseded", "quarantined", "evaluating"].includes(k)) },
  { title: "Falsified or closed", test: (st) => st.includes("falsified") },
  { title: "Superseded or quarantined", test: (st) => st.some((k) => ["superseded", "quarantined"].includes(k)) },
  { title: "Under evaluation", test: (st) => st.includes("evaluating") }
];

const renderEvidence = () => {
  const row = (e) => `<tr>
<th scope="row" data-label="Finding"><span class="ev_title">${e.finding}</span><span class="ev_tags">${tags(e.status)}</span><span class="ev_src">${e.src}</span></th>
<td data-label="Evidence"><div class="dcell">${e.evidence}</div></td>
<td data-label="Interpretation"><div class="dcell">${e.meaning}<p class="ev_limit"><span class="u-mono">Limitation</span> ${e.limit}</p></div></td>
</tr>`;
  const groups = EVIDENCE_GROUPS.map((g) => ({ ...g, rows: evidence.filter((e) => g.test(e.status)) })).filter((g) => g.rows.length);
  return `<div class="dtable_wrap"><table class="dtable is-stack is-evidence" aria-label="CIR evidence table">
<thead><tr><th scope="col">Finding</th><th scope="col">Evidence</th><th scope="col">Interpretation and limitation</th></tr></thead>
${groups.map((g) => `<tbody><tr class="dtable_group"><th scope="colgroup" colspan="3">${g.title} <span class="dtable_count">${g.rows.length}</span></th></tr>
${g.rows.map(row).join("\n")}</tbody>`).join("\n")}
</table></div>`;
};

// ---------- at a glance ----------

export const glance = [
  { label: "CIR specific advantage, D2", value: "Not reached", note: "CIR's own mixers only break even with B1A." },
  { label: "Generic counted organization, D1", value: "0.06× average", note: "Indonesian 0.03×, English 0.15×. Prior art, small scale." },
  { label: "Baselines", value: "B1A and TF LGN", note: "Cheapest Transformer, and the strongest at matched quality." },
  { label: "Active now", value: "R161", note: "Does data repetition explain the language gap?" }
];

const renderGlance = () => `<dl class="glance">
${glance.map((g) => `<div class="glance_item"><dt class="u-mono">${g.label}</dt><dd class="glance_value">${g.value}</dd><dd class="glance_note">${g.note}</dd></div>`).join("\n")}
</dl>`;

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

// ---------- counted organization: cost path and per language ----------
// Training cost to TF LGN's final quality (average of English and Indonesian), corrected (I313).

export const countedPath = [
  { step: "Small Transformer, counted n gram tables and a context cache", value: 0.172, range: "0.172 to 0.189", seeds: 2, src: "I283, I284" },
  { step: "Windowed attention and a longest match pointer", value: 0.128, range: "0.128", seeds: 1, src: "I294" },
  { step: "A tiny trained gate over all sources", value: 0.0995, range: "0.0995 to 0.101", seeds: 2, src: "I298, I314" },
  { step: "Training on 1,024 token chunks", value: 0.077, range: "0.077 to 0.083", seeds: 2, src: "I308, I315" },
  { step: "A smaller network, 0.82M parameters (A039)", value: 0.0625, range: "0.0625 to 0.0634", seeds: 2, src: "I316, I318" }
];

export const perLanguage = [
  { measure: "Best organization vs TF LGN", id: "0.032×", en: "0.149×" },
  { measure: "A039 vs TF LGN", id: "0.032×", en: "Not reached in budget" },
  { measure: "A039 vs B1A, budget 0.5× / 1×", id: "0.044 / 0.040", en: "0.053 / 0.121" },
  { measure: "A039 vs B1A, budget 2× / 4×", id: "0.038 / ≤ 0.034", en: "Not reached" },
  { measure: "Times the corpus is seen at 1×", id: "0.39", en: "3.2" }
];

const SCALE_MAX = 0.25;
const renderCounted = () => `<figure class="path reveal">
<ol class="path_list" role="list">
${countedPath.map((p, i) => `<li class="path_step">
<span class="path_index u-mono">${String(i + 1).padStart(2, "0")}</span>
<span class="path_label">${p.step}</span>
<svg class="path_bar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect class="path_track" width="100" height="10"/><rect class="path_fill" width="${Math.round((p.value / SCALE_MAX) * 1000) / 10}" height="10"/><line class="path_gate" x1="40" x2="40" y1="0" y2="10"/><line class="path_gate" x1="80" x2="80" y1="0" y2="10"/></svg>
<span class="path_value">${p.range}×<span class="path_meta u-mono">${p.seeds} seed${p.seeds > 1 ? "s" : ""} · ${p.src}</span></span>
</li>`).join("\n")}
</ol>
<figcaption>Training cost to reach TF LGN's final quality, averaged over English and Indonesian. Bars run from 0 to 0.25. Dashed lines mark the 0.10 and 0.20 gates. ${kind("estimated")}</figcaption>
</figure>
${table({
  label: "Counted organization results per language",
  cols: [
    { key: "measure", title: "Measure" },
    { key: "id", title: "Indonesian", num: true },
    { key: "en", title: "English", num: true }
  ],
  rows: perLanguage,
  className: "is-lang"
})}`;

// ---------- capability ----------

export const capabilities = [
  { cap: "Language prediction, CIR mixers", status: "worse", note: "Against the cheapest Transformer: 1.23 to 1.27× the cost. A tie at equal compute." },
  { cap: "Language prediction, counted organization", status: "better", note: "0.06× on average, 0.032× Indonesian, 0.149× English at best. Generic, not CIR specific." },
  { cap: "Long copying, counted organization", status: "better", note: "3.1 to 3.3 bits of copy gain, above TF LGN's 2.89, through counted pointers." },
  { cap: "Exact recall, counted organization", status: "mixed", note: "0.99 with the trained gate. Fragile without it." },
  { cap: "Short range copying, A010", status: "better", note: "A010 copies best at a distance of 256 tokens. Compared with Transformers without n gram heads." },
  { cap: "Long verbatim copying, A010", status: "worse", note: "At 2,560 tokens A010 and B1A copy almost nothing. Exact n gram heads keep about 2.9 bits." },
  { cap: "Associative recall, A010", status: "mixed", note: "Better than expensive Transformers. Marginal against the cheapest: 0.74 to 1.0× the cost." },
  { cap: "Bracket closing", status: "better", note: "About one bit per token better at distances of 17 to 128. Exploratory probe, small sample." },
  { cap: "State tracking (synthetic)", status: "better", note: "Parity and a permutation word problem extrapolate in tiny CIR models. Not cheaper than a Transformer with written steps." },
  { cap: "State tracking in a language model", status: "mixed", note: "Parity emerges with 15% parity data. A harder permutation task did not." },
  { cap: "Grammar", status: "unreliable", note: "All models score near chance at 4M parameters with our instrument." },
  { cap: "Relational binding", status: "unreliable", note: "Earlier instruments were too weak to separate models at this scale." },
  { cap: "Long range memory", status: "parity", note: "No CIR advantage found. Softmax models use little context beyond about 2,000 tokens here." },
  { cap: "Reasoning", status: "untested", note: "Not measurable at this scale with current instruments." },
  { cap: "Coherent generation", status: "fails-all", note: "Fails for every model at this scale." },
  { cap: "Robustness", status: "untested", note: "Not yet evaluated." }
];

const renderCapabilities = () => table({
  label: "Capability probes and their status",
  cols: [
    { key: "cap", title: "Capability" },
    { key: "statusHtml", title: "Status" },
    { key: "note", title: "Detail" }
  ],
  rows: capabilities.map((c) => ({ ...c, statusHtml: tag(c.status) })),
  className: "is-caps"
});

// ---------- active experiments ----------

export const experiments = [
  { id: "R161", question: "Does the Indonesian advantage collapse when its corpus repeats as often as English?", status: "running",
    note: "If yes, the claim is about data repetition. Normal pretraining sees data about once." },
  { id: "Decode", question: "What does token by token generation cost, not only reading text?", status: "queued",
    note: "Prefill is measured at 0.48 to 0.49×. Decoding is not." },
  { id: "Tables", question: "Can the count tables shrink without losing quality?", status: "queued",
    note: "They need about 434 MB today. Pruning rare entries hurt." },
  { id: "English", question: "Does English improve with a larger corpus or a larger network?", status: "conditional",
    note: "Chosen after R161. A larger corpus needs approval to download." },
  { id: "Ladder", question: "Does the advantage hold against larger Transformers above 4× budget?", status: "conditional",
    note: "Heavy runs. Beyond the current hardware budget." }
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

// ---------- timeline (newest first) ----------

export const timeline = [
  { date: "10 Oct", title: "Per language correction", body: "The average hid a gap: Indonesian 0.032×, English 0.149× at best. Claims are now per language." },
  { date: "9 Oct", title: "Inference, budgets and new text", body: "Prefill at 0.48×, a flat ratio across four budgets, and 0.053× on unseen Wikipedia." },
  { date: "8 Oct", title: "The 0.10 gate on average", body: "A trained gate and a smaller network reached 0.0625×. Our own accounting was corrected by about 5%." },
  { date: "7 Oct", title: "Counted statistics pass 0.20", body: "A small Transformer with counted n gram tables reached 0.172 to 0.189×. Generic, not CIR specific." },
  { date: "6 Oct", title: "State tracking cost claim fails", body: "A one layer Transformer with written steps beat CIR recurrence on cost. Counting entered the program." },
  { date: "5 Oct", title: "Parity emerges with a stronger signal", body: "At 15% parity data A025n learned it. A formal language warm up hurt at this size." },
  { date: "5 Oct", title: "Unreliable inside the language model", body: "Parity emerged in one of three language model runs. The capability claim was narrowed." },
  { date: "4 Oct", title: "Parity separates the organizations", body: "Recurrence with negative eigenvalues learned parity. Small Transformers did not." },
  { date: "4 Oct", title: "The cheapest hybrid breaks even", body: "A025 reached 0.985× B1A. The delta hybrid family was closed for BPB at this context length." },
  { date: "4 Oct", title: "Long copy probe", body: "Recurrent state carried almost no verbatim copies past an attention window. The long context route weakened further." },
  { date: "4 Oct", title: "Corrections and a new direction", body: "Equal compute gave a BPB tie. The recall estimator was corrected. An analytic bound redirected the search." },
  { date: "3 Oct", title: "Cheapest Transformer found: B1A", body: "One global attention layer matched the old baseline at half the cost per token." },
  { date: "3 Oct", title: "Generic modules close the gap", body: "Engram and n gram heads helped Transformers as much or more. The delta specific edge fell to about zero." },
  { date: "2 Oct", title: "First scaling point", body: "At width 448 the ratio rose to 0.72, still inside the signal gate." },
  { date: "1 Oct", title: "A cheaper baseline narrowed the claim", body: "Gated local global attention cost 9% less per token. A010 held at 0.63 to 0.64." },
  { date: "30 Sep", title: "A010 replicated on a second seed", body: "0.034 lower BPB than the strongest gated Transformer across two seeds." },
  { date: "27 Sep", title: "Mechanism found: final layer induction", body: "Muon makes Transformer induction heads form early. So the hybrid A010 kept one attention layer last." },
  { date: "27 Sep", title: "Muon removed that signal", body: "With Muon on both sides, the Transformer won by 0.051 BPB. The claim was withdrawn." },
  { date: "26 Sep", title: "A narrow signal for pure recurrence", body: "At 4,096 tokens and batch 8, delta reached 0.587 and 0.594 over two seeds. Both arms used AdamW." },
  { date: "24 Sep", title: "Pure recurrence falsified as first framed", body: "A delta rule memory model lost to a strong Transformer at contexts up to 4,096." }
];

const renderTimeline = () => `<ol class="timeline" role="list">
${timeline.map((t) => `<li class="timeline_item"><span class="timeline_date u-mono">${t.date}</span><div><h3>${t.title}</h3><p>${t.body}</p></div></li>`).join("\n")}
</ol>`;

// ---------- tokens for the build ----------

export const tokens = () => ({
  cirAsOf: asOf.label,
  cirAsOfIso: asOf.iso,
  cirUpdates: renderUpdates(),
  cirGates: renderGates(),
  cirEvidence: renderEvidence(),
  cirGlance: renderGlance(),
  cirCurve: renderCurve(),
  cirCounted: renderCounted(),
  cirCapabilities: renderCapabilities(),
  cirExperiments: renderExperiments(),
  cirTimeline: renderTimeline(),
  tagMeasured: kind("measured"),
  tagEstimated: kind("estimated"),
  tagProjected: kind("projected")
});
