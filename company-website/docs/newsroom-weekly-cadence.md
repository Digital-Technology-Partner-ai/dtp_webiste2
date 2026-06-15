# DTP Newsroom Cadence — 7-Day Activation Plan

## Goal
Build visible momentum on the DTP news page with daily activity for 7 days.

## Cadence
- Frequency: once daily
- Window: morning UK time
- Outcome each day: at least one reviewed draft, ideally one approved publishable story

## Daily Checklist
1. Run topic discovery
2. Build 10-topic shortlist with high-level overview
3. Share shortlist with Steve for selection
4. Wait for Steve to pick the topic id; do not auto-pick
5. Generate draft article only after selection
6. Review with checklist
7. Use a standalone here.now preview slug for review if needed; never the production domain
8. Publish only after explicit human approval, via the normal Netlify-backed production path
9. Run status + validation and log result

## Commands
```bash
./scripts/news/discover_topics --date YYYY-MM-DD
./scripts/news/generate_draft --shortlist src/content/news/shortlists/YYYY-MM-DD-topics.json --topic-id topic-01
npm run news:status
npm run news:validate
```

## How Steve interacts
- Send a source input (tweet, article link, or topic direction).
- I generate the draft card + full article.
- You can request edits before approval.
- Once approved, it appears on `/news` and click-through article page.
