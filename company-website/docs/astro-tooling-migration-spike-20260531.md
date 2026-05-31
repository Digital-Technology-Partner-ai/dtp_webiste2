# Astro/tooling migration spike — PR decision note

Owner: Hudson  
Branch: `hudson/astro-tooling-migration-spike`  
Date: 2026-05-31 11:45 BST  
Scope: branch-only spike. No deployment. No main-branch merge.

## Summary

This branch proves the DTP website can move from the current Astro 5 / Tailwind 3 integration route to an Astro 6 / Tailwind 4-compatible toolchain while keeping the site building and the existing hero animation tests passing.

## What changed

- Upgraded the website to Astro 6:
  - `astro` -> `^6.4.2`
  - `@astrojs/sitemap` -> `^3.7.3`
- Replaced `@astrojs/tailwind` with the Tailwind 4 route:
  - removed `@astrojs/tailwind`
  - added `@tailwindcss/vite`
  - added `@tailwindcss/postcss`
  - updated `src/styles/global.css` from Tailwind 3 directives to Tailwind 4 import syntax
- Migrated Astro legacy content configuration:
  - old: `src/content/config.ts`
  - new: `src/content.config.ts`
  - added explicit `glob()` loaders required by Astro 6
- Updated content-entry routing from `entry.slug` to `entry.id`, because Astro 6 content loader entries no longer expose the old `slug` property in the same way.
- Added npm overrides for the remaining YAML language-server chain:
  - `volar-service-yaml` -> `0.0.71`
  - `yaml-language-server` -> `1.23.0`

## Audit result

Before spike:

- 7 total vulnerabilities
- 1 low
- 6 moderate
- 0 high
- 0 critical

After spike:

- 0 total vulnerabilities
- 0 low
- 0 moderate
- 0 high
- 0 critical

Command:

```bash
npm audit --json
```

## Verification run

All verification was run from `company-website`.

Passed:

```bash
npm run type-check
npm run build
npm run lint
npx playwright test
npm audit --json
```

Results:

- `astro check`: 0 errors, 0 warnings, 0 hints
- `astro build`: passed, 56 pages built
- `eslint`: passed
- Playwright: 39 passed across Chromium, Firefox, and WebKit
- `npm audit`: 0 vulnerabilities

## Notes / residual warnings

Build/type-check still report existing missing optional content directories:

- `src/content/blog/`
- `src/content/case-studies/`
- `src/content/services/`
- `src/content/testimonials/`

Those warnings existed in the previous build path as well. They are not blockers for this migration branch, but we should either create placeholder directories or remove unused collections in a later cleanup.

## Risk assessment

Recommended status: **safe for review, not auto-merge**.

Reasons:

- The branch changes core framework/tooling, not just patch versions.
- Tailwind integration changed route from Astro integration to Vite/PostCSS plugins.
- Astro content collection shape changed and required routing updates.
- Verification is green locally, but this should still go through review before merge/deploy.

## Rollback

No production rollback is needed because this is branch-only.

To abandon locally:

```bash
git switch main
git branch -D hudson/astro-tooling-migration-spike
```

To abandon remotely after pushing:

```bash
git push origin --delete hudson/astro-tooling-migration-spike
```

## Recommendation

Open a review PR and merge only after Steve/Hudson review confirms the generated pages look right. No deploy from this branch without the normal website deployment decision.
