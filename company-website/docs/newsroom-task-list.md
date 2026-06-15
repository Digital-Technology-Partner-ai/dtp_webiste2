# Task List — DTP Website Newsroom Hardening

Project Name: DTP Website Newsroom Hardening
Owner: Hudson
Last Updated: 2026-06-15 23:30 BST
Status: Phase-1 requirements implemented and locally verified; ready for deployment/use within the documented human approval boundary

## Repo reality check verdict
- The newsroom is now *buildable and locally verifiable* as an Astro newsroom workflow.
- The remaining boundaries are intentional, not accidental: human topic selection, human approval, and no public draft preview in production.
- The main phase-1 requirements from the PRD are now covered by code, docs, and verification commands.

## Consensus implementation track
This task list reflects the final Hudson/Codex Bridge consensus:
- keep phase 1 file-based
- no CMS
- no auto-pick fallback
- no public production preview surface
- human topic selection and human approval stay mandatory
- social automation deferred; future socials derive from approved website articles only

## Atomic tasks

### Phase A — Documentation truth reset
- [x] A1. Rewrite `docs/newsroom-prd.md` to match the audited repo reality and agreed phase-1 architecture.
- [x] A2. Rewrite `docs/newsroom-sop.md` to remove auto-pick behaviour and define the publish-safety gate.
- [x] A3. Update `docs/newsroom-review-checklist.md` so it matches the publish rules.
- [x] A4. Replace stale Gideon-era status claims and dead local paths in newsroom docs.

### Phase B — Script hardening
- [x] B1. Make shortlist generation safe on rerun by default.
- [x] B2. Add explicit overwrite behaviour for shortlist regeneration.
- [x] B3. Make shortlist writes atomic.
- [x] B4. Validate shortlist structure before draft generation.
- [x] B5. Make draft generation use deterministic date behaviour.
- [x] B6. Make draft writes atomic.
- [x] B7. Keep duplicate title/slug protection in place.
- [x] B8. Tighten approved-article validation to catch placeholder/scaffold text.
- [x] B9. Improve `news:status` so Hudson gets a truthful quick state read.

### Phase C — Production safety
- [x] C1. Remove or gate production preview exposure so draft content is not publicly accessible.
- [x] C2. Add a newsroom verification command that runs validation, tests, type-check, and build.
- [x] C3. Ensure Netlify build uses the publish-safety gate before build succeeds.

### Phase D — Matt-TDD test coverage
- [x] D1. Add a behaviour test for deterministic shortlist creation.
- [x] D2. Add a behaviour test for no silent shortlist overwrite on rerun.
- [x] D3. Add a behaviour test for happy-path draft generation from shortlist topic.
- [x] D4. Add a behaviour test for duplicate draft blocking.
- [x] D5. Add a behaviour test for malformed shortlist failure.
- [x] D6. Add a behaviour test for approved-article validation failure modes.
- [x] D7. Add a behaviour test for `prepare_publish` idempotency.
- [x] D8. Add a render/build test proving drafts stay off public `/news` output.
- [x] D9. Add a render/build test proving the production preview surface is disabled.

### Phase E — Verification
- [x] E1. Run newsroom verification locally and record exact results.
- [x] E2. Run a safe shortlist/draft rehearsal and verify rerun behaviour.
- [x] E3. Confirm public-site build still succeeds after newsroom hardening.
- [x] E4. Summarise residual risks and explicit phase-2 deferrals.

## Verification notes
- `python3 -m unittest tests/newsroom_workflow_test.py` → passed, 9 tests.
- `npm run newsroom:verify` → passed.
- `npm run news:status` → 15 total articles, 8 approved, 7 drafts, 0 duplicate titles, 8 shortlist files.
- Safe rehearsal in an isolated temp workspace:
  - first `discover_topics --date 2026-06-15` run succeeded
  - second same-date run failed cleanly without overwrite unless forced
  - `generate_draft` created one deterministic draft from `topic-01`
  - `prepare_publish` succeeded on the generated draft
- Production build verification confirms:
  - approved article routes build
  - draft article routes do not build under `/news/*`
  - `/news/preview` renders a production-safe unavailable message
  - draft preview article routes do not build in production

## Residual risks and phase-2 deferrals
- `prepare_publish` removes the draft footer and injects DTP context, but it does not rewrite placeholder section body text; human editorial refinement is still mandatory before approval.
- `astro check`/`astro build` emit content-directory warnings for `blog`, `case-studies`, `services`, and `testimonials` collections that do not currently exist under `src/content/`. These are warnings, not blockers for newsroom verification, but they are repo hygiene debt.
- Publication is still intentionally human-gated. The workflow stops if Steve does not select a topic or if approval metadata is missing.
- Social automation remains deferred and must continue to derive from approved website articles only.

## Done criteria
- [x] Reruns are explicit and non-destructive by default.
- [x] Drafts are not publicly exposed in production.
- [x] Approved content must pass newsroom validation before publish.
- [x] One command proves newsroom publish safety.
- [x] Docs reflect actual Hudson operating behaviour.
- [x] The future social phase remains downstream of approved website articles only.