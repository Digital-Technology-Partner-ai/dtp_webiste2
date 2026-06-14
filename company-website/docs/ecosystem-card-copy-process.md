# Homepage Ecosystem — Card Copy Process

**Surface:** the large 3D destination cards in the homepage ecosystem experience (`/`).
**Not in scope:** the equator belt navigation buttons (`HOME`, `WHY DTP`, `PROGRAMMES`…), the hover tooltip, or the menu — these keep the stable `title` / `desc` for wayfinding.

## Goal

Make each main card work like a compact hero section: in two seconds it should tell a
business leader what they get from clicking, why it matters, and quietly move them toward
the primary CTA — **booking a call with DTP**. Voice is visitor-led, benefit-led and
conversion-aware, mixing **questions** (where the visitor is uncertain) with **outcome
statements** (where the value is concrete).

## Implementation model

The card copy is decoupled from navigation copy so neither surface compromises the other:

| Field | Drives | Notes |
| --- | --- | --- |
| `title` | equator belt label, tooltip title, menu title | stable destination name — unchanged |
| `desc` | tooltip + menu descriptor | short wayfinding line — unchanged |
| `cardTitle` | **3D card hook** (large) | new — the hero hook |
| `cardDesc` | **3D card support line** | new — the outcome / payoff |

- Data lives in `src/pages/index.astro` (`destinations[]`), injected into the page as JSON
  (`#ecosystem-destinations`).
- `public/ecosystem/js/main.js` → `makeNodeTexture()` renders the card. It now reads
  `dest.cardTitle || dest.title` and `dest.cardDesc || dest.desc`, so any destination
  without card copy falls back to its nav copy with no visual change. The title block
  auto-sizes (84 → 50px) and vertically centres so a long question-style hook wraps
  gracefully instead of overflowing.
- Bump `ecosystemAssetVersion` in `index.astro` whenever `main.js` or the ecosystem CSS
  changes, to bust the cached asset.

---

## Worked card: WHY DTP

- **Navigation label (unchanged):** `WHY DTP`
- **Card substance:** this destination is about *trust, control, governance and senior
  delivery* (its blocks are Trusted delivery / Business-first technology / Human-approved
  AI). The hooks are aimed at that, not at the "stalled pilots / readiness" angle that
  belongs to HOME and PROGRAMMES.
- **Visitor question:** *"Can I get real value from AI without losing control of risk,
  governance and quality — and can I trust this partner to actually own that?"*

### The eight versions

| # | `cardTitle` (hook) | `cardDesc` (support) | Angle |
| --- | --- | --- | --- |
| V1 | Can you move fast on AI without losing control? | DTP keeps value, risk and governance joined up — so you get momentum and a system you can stand behind. | speed vs control |
| V2 *(baseline)* | Make AI useful without losing control. | See how DTP keeps value, risk, people and delivery joined up from day one. | current live draft |
| V3 | When AI gets it wrong, who's accountable? | Every system we build has human oversight, escalation and senior ownership designed in — not bolted on. | accountability |
| V4 | Senior people who own the outcome, not just the pitch. | Clear accountability and hands-on involvement from first conversation to live, governed operation. | trust / seniority |
| V5 | Could your AI survive a hard question from the board? | We build AI you can explain, govern and trust — value the business sees, risk the board accepts. | board-defensibility |
| V6 | AI you can actually explain — and control. | No black boxes. Governance, controls and accountability built in, so adoption is something you can defend. | black-box fear |
| V7 | The upside of AI, without the exposure. | DTP joins value, people, data and governance into one system — fast to adopt, safe to run. | risk-adjusted value |
| V8 | Most AI projects bolt on governance last. We start there. | Controls, oversight and ownership designed in from line one — so useful and safe aren't a trade-off. | provocative differentiation |

### Judge scores (/10)

| Version | Skeptical CFO | Distracted founder | Competitor | Ideal customer | Copywriter | **Avg** |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| V1 | 9 | 8 | 7 | 9 | 8 | **8.2** |
| V2 *(baseline)* | 7 | 7 | 6 | 7 | 7 | **6.8** |
| V3 | 9 | 7 | 8 | 8 | 8 | **8.0** |
| V4 | 8 | 7 | 8 | 8 | 8 | **7.8** |
| V5 | 10 | 6 | 9 | 8 | 9 | **8.4** |
| V6 | 9 | 8 | 8 | 8 | 8 | **8.2** |
| V7 | 9 | 8 | 7 | 8 | 9 | **8.2** |
| V8 | 9 | 7 | 9 | 8 | 8 | **8.2** |

### What each judge rewarded and killed

- **Skeptical CFO** — rewarded credible risk/return framing: V5 board-defensibility (10),
  V1/V3/V6/V7/V8 (9). Killed vague value words ("useful", "joined up") with no proof — the
  main drag on the V2 baseline.
- **Distracted founder (2-second test)** — rewarded instant, universal clarity: V1, V6, V7
  (8). Penalised anything that needs a second read or assumes an enterprise board — V5 (6),
  V8 (7).
- **Competitor** — rewarded lines they *can't* claim back: V5 "survive a hard question from
  the board" (9), V8 governance-first swipe (9), V3 "designed in, not bolted on" (8). Flagged
  "without losing control" and "joined up" as borrowable category language (V2, 6).
- **Ideal customer** — rewarded their literal dilemma: V1 speed-vs-control (9). Strong but
  slightly enterprise-narrow on V5 (8). Found V2 relevant but unpointed (7).
- **Conversation copywriter** — rewarded rhythm and specificity: "value the business sees,
  risk the board accepts" (V5, 9), "fast to adopt, safe to run" (V7, 9), "No black boxes"
  (V6). Marked the baseline "joined up from day one" as tidy but corporate (V2, 7).

### Selection

- **Killed:** V2 (baseline — confirms the rewrite beats the current line) and V4 (weakest of
  the strong set; its abandonment/seniority angle is carried better inside the winner's
  support line).
- **Kept as raw material:**
  - *Hook tension* — V1's value-vs-control question: the most universal, on-positioning entry
    emotion for a destination-01 "why care" card.
  - *Anti-trade-off thesis* — V8's "useful and safe aren't a trade-off".
  - *Balanced proof pair* — V5's "value the business sees, risk… you can explain".
  - *Accountability* — V3/V4's senior ownership "designed in, not bolted on".

### Final version (live)

> **cardTitle:** Could your AI survive a hard question from the board?
> **cardDesc:** DTP builds AI you can explain, govern and trust — value you can see, risk you
> can explain, and senior people accountable from day one.

This pairs **V5's hook** (the highest-scoring draft, 8.4) with a **synthesised support line**.
Steve chose the board hook directly — it is the sharpest, most competitor-proof line in the
set (CFO 10, Competitor 9, Copywriter 9) — and we fixed its one weakness (the distracted
founder's 6) at the support-line level rather than by softening the hook.

### Why it won (scoreboard summary)

- **Hook (V5):** "Could your AI survive a hard question from the board?" was the top scorer.
  Board-defensibility is the exact anxiety the Skeptical CFO scored a perfect 10, and the
  framing is almost impossible for a competitor to claim back (9). It is a question, aimed
  squarely at the moment of leadership uncertainty.
- **Support line (synthesised):** V5's original second line ("…risk the board accepts")
  doubled down on the board frame. We swapped it for the merged proof line — the balanced
  pair "value you can see, risk you can explain" plus concrete accountability "senior people
  accountable from day one." This keeps the hook's edge while broadening who the *answer*
  speaks to, and it is the bridge to booking a call.
- **Beaten:** the V2 baseline (6.8) — borrowable category language ("useful… without losing
  control", "joined up") replaced with an ownable promise and concrete proof.
- **On positioning:** holds the card's true substance — control, governance, senior ownership
  — instead of drifting into the readiness/stalled-pilot territory owned by HOME and PROGRAMMES.

> **Note on method:** the scoreboard is evidence, not a vote. The brief allows the winner to
> differ from the top draft. Here the decision was to ship the top-scoring *hook* and repair
> its single weak judge score in the support line — a deliberate split-level synthesis.

---

## Next cards

This is the worked example for sign-off on voice and format. The remaining nine destinations
(HOME, PROGRAMMES, SOLUTIONS / use-cases, PROCESS, NEWS, CASE STUDIES, INSIGHTS, LEARNING,
CONTACT) run through the same eight-version / five-judge process, each aligned to that card's
real substance, before their `cardTitle` / `cardDesc` are updated.
