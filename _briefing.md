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
- **Last verified:** 2026-05-27 18:15 BST
- **Works locally:** yes for production build and targeted Playwright browser test
- **Tests:** build, lint, type-check and hero typewriter Chromium Playwright suite pass after commit `60047cb`
- **Main risks:**
  - There are two Netlify config files. Root `netlify.toml` appears to be the deployment config for the monorepo layout; `company-website/netlify.toml` has conflicting build base/publish settings and may be stale.
  - The route set includes design-lab/design-option pages and `booking-test`, which may be useful internally but should be reviewed before treating the whole build as production-polished.
  - `npm audit fix` reduced vulnerabilities from 26 to 7. The remaining low/moderate items require semver-major or otherwise breaking dependency moves, so they are blocked pending a dedicated Astro/dependency migration pass rather than forced against the live site.
  - Public-route smoke verification passed for all 58 sitemap URLs on 2026-05-27, but route content quality/mobile visual QA still needs a separate review if Steve wants production polish rather than availability only.

## How to run

From the Astro app directory:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm install
npm run dev
```

The repo’s Playwright config starts the local dev server at `http://127.0.0.1:4321` to avoid IPv6 `localhost` ambiguity.

## How to build

Verified on 2026-05-27:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm install
npm run build
```

Result: passed. Astro built 55 static pages into `company-website/dist/`. Reverified after dependency/QA cleanup in commit `60047cb`.

Build warnings observed:

- Missing content collection directories:
  - `src/content/blog/`
  - `src/content/case-studies/`
  - `src/content/services/`
  - `src/content/testimonials/`
- Browserslist/caniuse-lite data is 9 months old.

## How to test

Verified commands and results from 2026-05-27 after commit `60047cb`:

```bash
cd "/Users/hudsonrebel/DTP Coding Projects/dtp_website2/company-website"
npm run lint
npm run type-check
npx playwright test tests/hero-typewriter.spec.ts --project=chromium --reporter=list
npm run build
```

Results:

- `npm run lint`: passed.
- `npm run type-check`: passed with 0 errors, 0 warnings, 0 hints.
- Hero typewriter Chromium Playwright suite: 13 passed.
- `npm run build`: passed; 55 pages built.

Older briefing failures were fixed in the follow-up cleanup: 16 ESLint errors, 174 Astro check errors, and the hero typewriter Playwright failures are no longer the current baseline.

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

- `npm audit fix` was run on 2026-05-27 and pushed in commit `60047cb`.
- Vulnerabilities reduced from 26 to 7: 1 low, 6 moderate, 0 high, 0 critical.
- Remaining audit fixes require semver-major/breaking dependency moves, including Astro 6 and Astro tooling changes. Treat that as a dedicated migration task, not a blind `npm audit fix --force` on the live site.

## Repository hygiene

Current Git state after follow-up delivery: clean on `main` after commit `60047cb` was pushed.

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
- Generated/test artefacts (`company-website/test-results`, `playwright-report`, Lighthouse reports and `deploy.zip`) were removed from Git tracking in commit `60047cb` and added to `.gitignore`; local generated copies may still exist and are safe to recreate.
- The source Inbox copy remains at `/Users/hudsonrebel/My Drive/DTP Inbox/dtp_website2`. Its `.git/config` is missing, so it should be treated as provenance/source evidence, not the canonical working repo.
- No deletion/archive of the Inbox provenance copy was done during this pass.

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

1. Should the GitHub repository be renamed from `dtp_webiste2` to `dtp-website`? Hudson recommends `dtp-website` as the clean public name, but not until any Netlify/GitHub integration implications are checked immediately before renaming.
2. Should the old Inbox copy be archived after Steve confirms the canonical clone is enough, or retained as provenance for now?
3. Should design/test/debug routes such as `design-lab`, `design-option-*`, `design-v*`, and `booking-test` remain published on the production build?
4. Should the two Netlify config files be consolidated so there is one obvious deployment source of truth?
5. Should the remaining 7 low/moderate audit findings be handled via a dedicated Astro/dependency major-version migration? Do not force this casually; the suggested audit fixes include breaking dependency moves.

## Next recommended actions

Hudson-owned, safe next actions:

1. Confirm Netlify deployment state for commit `60047cb` if/when deployment visibility is needed.
2. Create/update `wiki/projects/dtp-website.md` so the DTP wiki points at the canonical repo and records current verification.
3. Review production exposure of design/debug routes and decide whether to remove, gate or leave them.
4. Consolidate the root and app-level Netlify config files after confirming which one Netlify actually uses.

Steve-decision items:

1. Decide whether to rename the GitHub repository.
2. Approve any deletion/archive of the old Inbox copy.
3. Decide whether internal design/debug pages should be removed from production or gated.
4. Approve a dedicated Astro/dependency major-version migration if the remaining audit findings need to be cleared now.

## Steve's notes

None recorded yet.
