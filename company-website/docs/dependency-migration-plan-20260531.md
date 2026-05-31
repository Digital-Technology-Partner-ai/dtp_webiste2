# DTP website — Astro/tooling dependency migration plan

Owner: Hudson  
Date: 2026-05-31 11:18 BST  
Scope: planning only. No dependency versions changed in this pass.

## Current baseline

Commands run from `company-website` on 2026-05-31:

```bash
npm audit --json
npm run build
npm run type-check
```

Results:

- `npm audit`: 7 total vulnerabilities: 1 low, 6 moderate, 0 high, 0 critical.
- `npm run build`: passes.
- `npm run type-check`: passes, 0 errors/warnings/hints.
- Warnings observed during build/type-check are content-collection base-directory warnings for missing optional content folders (`blog`, `case-studies`, `services`, `testimonials`) and stale Browserslist data. They are not current build failures.

## Remaining audit findings

The remaining findings are tied to Astro/tooling rather than a narrow safe patch:

- `astro`: moderate findings in the current Astro 5 line; npm suggests Astro 6.4.2 as the fix path and marks it semver-major.
- `@astrojs/tailwind`: low finding because it depends on vulnerable Astro ranges; npm suggests `@astrojs/tailwind@2.1.3`, which is a semver-major downgrade from the current `^5.1.0` line and should not be applied blindly.
- `@astrojs/check` / `@astrojs/language-server` / `volar-service-yaml` / `yaml-language-server` / `yaml`: moderate YAML-language-server chain; npm suggests `@astrojs/check@0.9.2`, which is also a semver-major downgrade from the current `^0.9.4` declaration in npm's view.

The npm `fixAvailable` recommendations are therefore not safe automatic upgrades. Some are downgrades, and the Astro path is a framework major-version migration.

## Recommendation

Do **not** run dependency migration on the live website main branch today.

Recommended route:

1. Create a dedicated branch: `hudson/astro-tooling-migration`.
2. First try non-breaking housekeeping only:
   - refresh Browserslist/caniuse metadata if it changes lockfile safely;
   - re-run `npm audit`, `npm run build`, `npm run type-check`, and Playwright if available.
3. Then test Astro 6 in the branch only:
   - read Astro 6 migration notes before changing package versions;
   - update Astro-related integrations together, not one package at a time;
   - check Tailwind integration compatibility before accepting npm's suggested `@astrojs/tailwind` downgrade.
4. Verify:
   - `npm install`
   - `npm audit`
   - `npm run build`
   - `npm run type-check`
   - `npm run lint` if lint config is currently compatible
   - Playwright smoke/regression checks if available from the repo root.
5. If tests pass and the audit materially improves, open/prepare a PR-style review note for Steve before deploying.
6. If Astro 6 causes page/build regressions, abandon the branch and park until the next proper website update cycle.

## Rollback

Rollback is straightforward if this stays branch-based:

```bash
git switch main
git branch -D hudson/astro-tooling-migration
```

Do not force-push or rewrite main history.

## Go/no-go gate

Proceed to implementation only if Steve wants a dependency-cleanup sprint now. My recommendation is:

- **Now:** keep the plan and baseline evidence.
- **Next:** run a branch-only migration spike when website work is already scheduled.
- **Do not:** treat `npm audit fix --force` as safe here. That is how projects wake up with a lampshade on their head.

## Implementation /goal command

```text
/goal DTP website Astro/tooling migration spike: create a branch-only migration experiment for remaining npm audit findings. Do not touch main directly. Read Astro 6 and integration compatibility first. Use TDD/verification gates: npm install, npm audit, npm run build, npm run type-check, npm run lint if compatible, and available Playwright smoke tests. Produce a PR-style decision note with pass/fail evidence and rollback path. No deploy without Steve approval.
```
