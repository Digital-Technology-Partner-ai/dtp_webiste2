# PRD — DTP Website Newsroom Workflow (Hudson phase-1 hardening)

## Status
- Owner: Hudson
- Date: 2026-06-14
- Supersedes: earlier Gideon-era newsroom PRD assumptions where they conflict
- Decision basis: live repo audit plus four-round Hudson/Codex Bridge design debate

## Problem
The repo already contains a working Astro news section, markdown articles, shortlist JSON files, and CLI scripts. It is *buildable*, but it is not yet safe to treat as a reliable daily newsroom operating system.

Current failure modes:
- approved articles can still fail newsroom validation
- preview routes are publicly buildable
- discovery can overwrite a same-day shortlist on rerun
- draft generation uses placeholder filler and can drift from shortlist date
- SOP/docs still contain stale Gideon assumptions, including a 3-hour auto-pick fallback
- there is no single newsroom verification command for publish safety

## Product goal
Make the DTP newsroom boringly reliable as part of Hudson’s daily operating rhythm.

"Boringly reliable" means:
- cron reruns do not silently overwrite or duplicate work
- drafts never leak to the public site
- approved articles always pass governance checks before publish
- the workflow stops cleanly when human selection or approval is missing
- one verification command proves the newsroom is safe to publish

## Non-goals for phase 1
These are explicitly deferred:
- no CMS or admin UI
- no CMS or admin UI for draft review management
- no auto-pick if Steve does not select a topic
- no social posting automation
- no structured multi-field source object migration for old articles
- no database or queue service
- no autonomous publication without human topic selection and human approval

## Consensus architecture
Phase 1 remains file-based inside the Astro repo.

### Durable workflow surfaces
- Approved and draft article files: `src/content/news/*.md`
- Shortlists: `src/content/news/shortlists/YYYY-MM-DD-topics.json`
- Archive material: `src/content/news/_archive/*`
- Operational scripts: `scripts/news/*`
- Operating docs: `docs/newsroom-*.md`

### Publish boundary
- `/news` and `/news/[slug]` render approved entries only.
- Drafts remain out of the main public newsroom until approval.
- Draft review happens on a separate standalone here.now page before publication.
- The DTP production domain must not host draft article pages.

### Human control points
- Hudson may generate a shortlist.
- Steve selects the topic.
- Hudson may prepare and refine the draft.
- A human sets approval metadata before publication.
- If selection or approval is missing, the workflow stops. It does not guess.

## Functional requirements

### FR1 — Deterministic shortlist generation
`discover_topics` must create a dated shortlist file with stable topic IDs and required fields.

Required behaviour:
- output path is deterministic from date
- rerunning for the same date does not silently overwrite unless explicitly forced
- shortlist JSON is valid and complete
- writes are atomic

Shortlist item contract for phase 1:
- `id`
- `title`
- `category`
- `source`
- `status` (simple metadata only; no workflow engine semantics)

### FR2 — Safe draft generation from a selected topic
`generate_draft` must create one markdown draft from one shortlist topic.

Required behaviour:
- fails clearly if shortlist file is missing or malformed
- fails clearly if topic ID is missing
- blocks duplicate title/slug unless explicitly overridden
- uses the shortlist date for deterministic dating unless intentionally overridden later
- writes atomically
- produces a review-ready scaffold, not free-form junk

### FR3 — Approved-only main newsroom rendering
Approved entries remain the only content visible on the live main newsroom routes.

Required behaviour:
- `/news` lists approved entries only
- `/news/[slug]` builds for approved entries only
- draft files do not create public article routes
- production preview surface is disabled or redirected away from draft content
- draft review is hosted on a separate standalone here.now URL
- the DTP production domain does not expose draft article pages before approval

### FR4 — Governance validation before publish
Approved articles must satisfy newsroom validation before deploy.

Minimum required for approved articles:
- `approved: true`
- `approvedBy`
- `approvedAt`
- `source`
- non-placeholder description
- no draft footer
- no placeholder scaffold text
- DTP context section present

### FR5 — One-command verification
A single command must prove the newsroom is publish-safe.

Expected checks:
- newsroom validation
- newsroom behaviour tests
- type-check
- production build

### FR6 — Operator-facing status visibility
`news:status` must give Hudson a quick truthful picture of newsroom state.

Minimum reporting:
- total article count
- approved count
- draft count
- duplicate title detection
- shortlist count and/or recent shortlist visibility if practical

## Non-functional requirements
- British English output conventions remain intact
- cron reruns must be predictable
- file writes must be atomic
- CLI failures must be explicit and non-silent
- repo workflow must remain understandable without specialist tooling
- old approved content should not require expensive schema migrations just to keep phase 1 moving

## Accepted phase-1 compromises
- `source` stays a simple string for now
- shortlist `status` is lightweight metadata, not a full state machine
- draft and approved content remain in the same folder, with public visibility controlled by `approved: true`
- social distribution is designed as downstream of approved website content, but not implemented here

## Bear traps that must be eliminated
1. 3-hour auto-pick fallback in docs or automation
2. Main newsroom routes leaking draft content
3. Same-day shortlist overwrite on rerun
4. Duplicate draft creation on rerun
5. Validation that passes obviously placeholder approved content
6. No single publish-safety verification command
7. Stale Gideon paths and outdated task-state claims in docs

## Phase-2 design guardrails
When socials arrive later:
- derive social candidates from approved website articles only
- do not generate social posts from shortlists or drafts
- keep the website article as canonical source content
- add listing/queue behaviour before any API posting
- preserve human approval boundaries for external publishing

## Acceptance criteria
Phase 1 is done when all of the following are true:
1. `discover_topics --date YYYY-MM-DD` is deterministic and safe on rerun.
2. `generate_draft` creates one draft from one selected topic and blocks duplicates.
3. `npm run news:validate` fails bad approved content and passes good approved content.
4. The public news pages only expose approved articles.
5. Production preview content is not publicly accessible.
6. `npm run newsroom:verify` passes end-to-end.
7. SOP/docs match actual operating behaviour.
8. Hudson can run the workflow daily without ad-hoc memory or hidden steps.

## Definition of done
The newsroom SOP “runs like a Swiss watch” when reruns are boring, failures are obvious, human approvals remain intact, and the repo can prove publish safety on demand.