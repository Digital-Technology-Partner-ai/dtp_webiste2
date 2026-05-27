---
title: DTP website code briefing
type: code-briefing
status: active
owner: Hudson
development_state: Product
software_category: product candidate
updated: 2026-05-27
---

# DTP website — code briefing

## Summary

This repository contains the public Digital Technology Partner website: an Astro/Tailwind static site deployed to `https://digitaltechnologypartner.ai` via Netlify.

DTP has it because it is the company’s live public website and marketing surface. It includes the main homepage, services, case studies, contact/pricing/testimonial pages, DTP news content, design exploration pages, and two 10 Touches privacy-policy routes used to support the DTP-owned Ten Touches product candidate.

The repository was found in `/Users/hudsonrebel/My Drive/DTP Inbox/dtp_website2`. That Inbox copy has a broken local `.git/config` but a valid object/history store. The canonical working copy is now cloned from the DTP GitHub organisation into `/Users/hudsonrebel/DTP Coding Projects/dtp_website2`.

One goblin wrinkle: the GitHub repository is named `dtp_webiste2`, not `dtp_website2`. That misspelling is in the remote URL, not this local folder name.

## Current state

- **DTP software category:** product candidate / company-owned website
- **Development state:** Product
- **Commercial status:** live DTP business asset; needs hygiene and QA hardening
- **Last verified:** 2026-05-27 17:08 BST
- **Works locally:** yes for production build; dev server not separately smoke-tested in browser during this pass
- **Tests:** partial/failing — build passes, type-check/lint/Playwright have known failures
- **Main risks:**
  - TypeScript checking reports 174 errors across 77 files, mostly strict DOM typing and implicit-any issues in Astro inline scripts.
  - ESLint reports 16 errors, including a parser error in `src/components/DevelopmentJourney.astro`.
  - Chromium Playwright test run reports 8 passed and 5 failed for the hero typewriter suite.
  - The repository tracks generated/test artefacts including `company-website/test-results`, `playwright-report`, Lighthouse reports and `deploy.zip`; these should be cleaned in a deliberate hygiene PR/commit, not mixed with feature work.
  - There are two Netlify config files. Root `netlify.toml` appears to be the deployment config for the monorepo layout; `company-website/netlify.toml` has conflicting build base/publish settings and may be stale.
  - The route set includes design-lab/design-option pages and `booking-test`, which may be useful internally but should be reviewed before treating the whole build as production-polished.
  - `npm install` reported 26 package vulnerabilities: 1 low, 10 moderate, 15 high. This was not fixed during briefing.
  - I could not complete a live public-route curl smoke check in this run because the tool safety layer blocked the command; do not treat live-site verification as completed from this briefing alone.

## How to run

From the Astro app directory:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm install
npm run dev
```

The repo’s Playwright config expects the local dev server at `http://localhost:4321`.

## How to build

Verified on 2026-05-27:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm install
npm run build
```

Result: passed. Astro built 55 static pages into `company-website/dist/`.

Build warnings observed:

- Missing content collection directories:
  - `src/content/blog/`
  - `src/content/case-studies/`
  - `src/content/services/`
  - `src/content/testimonials/`
- Browserslist/caniuse-lite data is 9 months old.

## How to test

Verified commands and results from 2026-05-27:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm run build
```

Result: passed.

```bash
npm run type-check
```

Result: failed. `astro check` reported 174 errors across 77 files. Representative areas:

- `src/components/BookingButton.astro`
- `src/components/CommandPalette.astro`
- `src/components/FAQ.astro`
- `src/components/FAQMini.astro`
- `src/components/TestimonialCarousel.astro`
- `src/pages/booking-test.astro`
- `src/scripts/animations/*.ts`

```bash
npm run lint
```

Result: failed. ESLint reported 16 errors, including:

- unused variables in `BookingButton.astro`, `TestimonialCarousel.astro`, `ScrollProgress.astro`, `booking-test.astro`, `benefits.ts`, `hero.ts`
- parser error in `src/components/DevelopmentJourney.astro`: `JSX expressions must have one parent element`

```bash
npx playwright install chromium
npx playwright test --project=chromium --reporter=list
```

Result: 8 passed, 5 failed. Failing tests were in `tests/hero-typewriter.spec.ts`:

- headline expected to be empty before scroll, but current implementation auto-starts after tag animation
- cursor opacity check sampled `1` twice despite blink animation
- strict-mode locator conflict in the screen-reader test
- CLS/layout-shift test received `0.02809945424397786` instead of `0`
- text-container position changed during animation/reflow check

The first test run failed entirely because Chromium was not installed in the Playwright cache; `npx playwright install chromium` fixed that local prerequisite.

## Architecture map

- **Repository root:** `/Users/hudsonrebel/DTP Coding Projects/dtp_website2`
- **App root:** `/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website`
- **Framework:** Astro static site
- **Styling:** Tailwind CSS plus Astro/CSS component styles
- **Animation:** GSAP, Lenis and custom scripts in `src/scripts/animations/`
- **Content collections:** configured in `src/content/config.ts`; currently includes `blog`, `case-studies`, `services`, `testimonials`, and `news`, though several collection directories are missing
- **Main pages:** `src/pages/index.astro`, `about.astro`, `contact.astro`, `case-studies.astro`, `pricing.astro`, `testimonials.astro`, `faq.astro`, `services/index.astro`
- **News:** `src/pages/news/*` plus markdown content under `src/content/news/`
- **Ten Touches support routes:**
  - `src/pages/10-touches/privacy/index.astro`
  - `src/pages/10-touches/privacy/beta.astro`
  - `src/pages/apps/10-touches/privacy-policy.astro`
- **Reusable components:** `src/components/*`, including header/footer, FAQ, command palette, testimonial carousel, booking button, and hero typewriter
- **Tests:** Playwright test suite in `company-website/tests/hero-typewriter.spec.ts`
- **Deployment:** root `netlify.toml` sets `base = "company-website"`, build command `cd company-website && npm run build`, publish directory `company-website/dist`, Node `20.11.1`, npm `10.2.4`, and cache headers

## Dependencies and services

No committed `.env` files, credentials, private keys, databases, or obvious tokens were found in the canonical clone during the safety scan.

Important external/service assumptions:

- Netlify hosts the production site.
- Production domain in Astro config: `https://digitaltechnologypartner.ai`.
- Homepage discovery-call CTA links to an Outlook Bookings URL under `digitaltechnologypartner.ai`.
- The app is currently static; no local database or server runtime was identified.
- Netlify functions directory is configured as `company-website/netlify/functions`, but no functions were found in the top-level scan.

Dependency audit note:

- `npm install` completed but reported 26 vulnerabilities: 1 low, 10 moderate, 15 high.
- This briefing does not change dependencies or run `npm audit fix`; that needs a separate hygiene task and regression check.

## Repository hygiene

Current Git state after briefing pre-edit verification: clean on `main` before `_briefing.md` was written.

Remote:

```text
origin https://github.com/Digital-Technology-Partner-ai/dtp_webiste2.git
```

Verified with GitHub CLI:

- `Digital-Technology-Partner-ai/dtp_webiste2`
- default branch: `main`
- visibility: public
- Hudson permission: `ADMIN`
- latest pushed timestamp from GitHub: `2026-03-22T21:56:33Z`

Branch state:

```text
main 1c6d94e [origin/main] Update use cases section and add typewriter animation to section tags
```

Observed hygiene issues:

- Root repo contains a minimal `package.json` only for Playwright while the real app package is in `company-website/`.
- Generated/test artefacts are tracked, including `company-website/test-results`, `company-website/playwright-report`, Lighthouse reports and `deploy.zip`.
- Verification modified tracked `company-website/test-results/*`; these were restored with `git restore -- company-website/test-results` before writing this briefing.
- The source Inbox copy remains at `/Users/hudsonrebel/My Drive/DTP Inbox/dtp_website2`. Its `.git/config` is missing, so it should be treated as provenance/source evidence, not the canonical working repo.
- No deletion, cleanup, dependency update, history rewrite, or Netlify config change was done during this briefing pass.

## Related DTP records

- **Wiki product page:** none; this is DTP’s company website rather than a separate product.
- **Wiki project page:** `[[dtp-website]]`
- **Working Files folder:** `/Users/hudsonrebel/My Drive/DTP Working Files/Projects/Active_Projects/DTP/DTP Website` once created/linked by the accompanying project record
- **Kanban board:** `coding-projects`
- **Coding-projects card:** `t_d34d8e32` — Brief DTP website repo
- **Related client/project:** `[[digital-technology-partner]]` / DTP internal
- **GitHub repo:** `https://github.com/Digital-Technology-Partner-ai/dtp_webiste2`
- **Canonical local repo:** `/Users/hudsonrebel/DTP Coding Projects/dtp_website2`
- **Inbox source/provenance:** `/Users/hudsonrebel/My Drive/DTP Inbox/dtp_website2`

## Open questions

1. Should the GitHub repository be renamed from `dtp_webiste2` to `dtp_website2` or `dtp-website`? The current typo is harmless technically but deeply annoying, like a pebble in a shoe.
2. Should the old Inbox copy be archived after Steve confirms the canonical clone is enough, or retained as provenance for now?
3. Should design/test/debug routes such as `design-lab`, `design-option-*`, `design-v*`, and `booking-test` remain published on the production build?
4. Should the two Netlify config files be consolidated so there is one obvious deployment source of truth?
5. Should Hudson run a separate live-site verification pass once the command-block issue is cleared, including public route checks and mobile screenshots?
6. Should dependency audit fixes be attempted now, or treated as a scheduled hygiene task after the live site baseline is captured?

## Next recommended actions

Hudson-owned, safe next actions:

1. Commit this `_briefing.md` to the DTP GitHub repo and push it to `main` if the tree contains only the briefing file.
2. Create/update `wiki/projects/dtp-website.md` so the DTP wiki points at the canonical repo and records today’s verification.
3. Mark the `coding-projects` intake card done once repo and wiki records are written.
4. Create follow-up coding-project cards for:
   - dependency audit and package update pass
   - repo hygiene cleanup for tracked generated/test artefacts
   - TypeScript/lint cleanup
   - Playwright hero typewriter regression repair
   - Netlify config consolidation and production-route review

Steve-decision items:

1. Decide whether to rename the GitHub repository.
2. Approve any deletion/archive of the old Inbox copy.
3. Decide whether internal design/debug pages should be removed from production or gated.

## Steve's notes

None recorded yet.
