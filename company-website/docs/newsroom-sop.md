# DTP Newsroom SOP (Hudson phase 1)

## Purpose
Run a repeatable DTP website newsroom workflow that is safe enough for daily use and boring enough to trust.

## Operating rules
- Human topic selection is mandatory.
- Human approval is mandatory before publication.
- If selection or approval is missing, the workflow stops.
- Draft content must not be publicly visible in production.
- Approved content must pass newsroom validation before deploy.
- Social distribution is a later phase and must derive from approved website articles only.
- here.now may be used for standalone preview slugs only.
- The workflow must never mount, update, or repoint `digitaltechnologypartner.ai` or `www.digitaltechnologypartner.ai` to here.now unless Steve explicitly approves that domain migration in the current conversation.

## Incident note — 2026-06-15 production routing error
- **What changed:** production DNS/domain was routed through here.now.
- **Impact:** the live domain served the wrong/old site.
- **Root cause:** production apex and `www` were mounted to here.now and then republished from the wrong build.
- **Fix:** apex and `www` were restored to Netlify, and the here.now custom-domain association was removed.
- **Prevention:** here.now can only use standalone preview slugs, never `digitaltechnologypartner.ai` or `www.digitaltechnologypartner.ai`, unless Steve explicitly approves a domain migration in the current conversation.

## Daily workflow

### 1) Generate the day’s live shortlist
```bash
./scripts/news/discover_topics --date YYYY-MM-DD
```
Expected result:
- a fresh 10-topic shortlist JSON file in `src/content/news/shortlists/`
- topics drawn from live internet/news sources, not a static internal topic pool
- each topic includes source name, URL/evidence, score, and category metadata
- no silent overwrite on rerun unless explicitly forced with `--force`

Example:
```bash
./scripts/news/discover_topics --date 2026-06-15
```

### 2) Send shortlist to Steve
Share the 10 live-sourced options with source/evidence per topic and ask Steve to reply with the topic id.

### 3) Wait for topic selection
Do **not** auto-pick after a timeout.
If Steve does not choose a topic, the workflow remains paused.

### 4) Generate the draft from the selected topic
```bash
./scripts/news/generate_draft \
  --shortlist src/content/news/shortlists/YYYY-MM-DD-topics.json \
  --topic-id topic-01
```
Expected result:
- one markdown draft under `src/content/news/`
- duplicate title protection by default
- duplicate slug protection by default

Example:
```bash
./scripts/news/generate_draft \
  --shortlist src/content/news/shortlists/2026-06-15-topics.json \
  --topic-id topic-02
```

### 5) Refine the draft
Use normal editorial judgement.
Keep claims tied to the cited source context.
Maintain British English.
Remove filler and replace scaffold text with specific, useful content.

### 6) Publish the draft to a separate here.now review page
Every draft may carry a `reviewToken` in frontmatter, but draft review itself happens on a separate here.now URL, not on `digitaltechnologypartner.ai`.

Rules:
- the review page must be hosted on a standalone here.now site URL immediately after Steve selects a topic and Hudson drafts it
- there is no extra permission gate before deploying the here.now draft review page
- it must not sit on the DTP production domain before approval
- it should look like the final website article, with exactly one minimal draft strip at the top
- it must not include metadata/status/source cards, repeated approval warnings, or review boilerplate in the article body/footer
- `/news` and `/news/[slug]` remain approved-only on the DTP site

### 7) Prepare the draft for approval
```bash
./scripts/news/prepare_publish --file src/content/news/YYYY-MM-DD-slug.md
```
This should:
- remove draft boilerplate/footer
- replace placeholder description if still present
- ensure the DTP context section exists

Example:
```bash
./scripts/news/prepare_publish \
  --file src/content/news/2026-06-15-knowledge-retention-playbook-for-field-teams-facing-workforce-contractio.md
```

### 8) Human approval gate
Before publish, a human reviewer must update frontmatter on the article file:
- `approved: true`
- `approvedBy: "<reviewer>"`
- `approvedAt: YYYY-MM-DD`
- `source: "<source note or URL>"`

Use:
- `docs/newsroom-review-checklist.md`

If approval is missing, the workflow stops there. No cowboy publishing.

### 9) Check newsroom status
```bash
npm run news:status
```
Use this for a quick view of:
- total article count
- approved vs draft count
- duplicate title detection
- latest shortlist file

### 10) Run newsroom verification
```bash
npm run newsroom:verify
```
This is the publish-safety gate.
It must pass before deploy.

What it now does, in order:
- runs the repo-local production-domain guard (`npm run news:guard`)
- fails fast if newsroom operational code references `digitaltechnologypartner.ai` or `www.digitaltechnologypartner.ai` in a here.now/custom-domain/DNS/mount/pairing context
- still allows ordinary live-site references such as canonical URLs, article links, sitemap checks, and Netlify verification
- then runs newsroom tests, approved-content validation, type-checking, and the production build

### 11) Publish the site
Deploy the built site once verification passes.
Current live path:
- build with `npm run newsroom:verify`
- deploy approved site changes via the normal Netlify-backed production path only

Public newsroom routes must expose approved content only.
Draft review must happen on a separate standalone here.now URL before approval, not on the DTP production domain.

## Minimum tested command sequence
```bash
npm run news:guard
./scripts/news/discover_topics --date YYYY-MM-DD
./scripts/news/generate_draft \
  --shortlist src/content/news/shortlists/YYYY-MM-DD-topics.json \
  --topic-id topic-02
./scripts/news/prepare_publish --file src/content/news/YYYY-MM-DD-slug.md
npm run news:status
npm run newsroom:verify
```

## Failure handling
- If shortlist generation fails, stop and inspect the file/output.
- If draft generation fails, do not hand-edit around the failure until the cause is understood.
- If validation fails, fix the article or metadata before publish.
- If verification fails, do not deploy.

## Operational notes
- Same-day reruns should be boring and explicit.
- Validation should catch approved articles that still look like drafts.
- The repo, not memory, is the source of truth for newsroom state.
- Phase 2 socials must read from approved website articles only.