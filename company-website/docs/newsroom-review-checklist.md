# Newsroom Review Checklist (Required Before Approval)

Use this checklist before setting `approved: true`.

## Editorial quality
- [ ] Headline is clear, specific, and not hypey
- [ ] Description is concise and accurate
- [ ] Claims are practical and relevant to DTP’s audience
- [ ] No placeholder or scaffold text remains
- [ ] The body reads as the publishable article itself, not an overview, outline, or internal note
- [ ] The ending is framed as `Why this matters in practice` or equivalent practical framing, not a DTP-centred commentary section

## Review-surface quality
- [ ] The here.now review page looks like the final website article
- [ ] The only draft marker is one minimal strip at the top
- [ ] Header, footer, tag treatment, and CTA buttons match the live DTP article design rather than a generic preview skin
- [ ] No metadata/status/source/review boilerplate appears inside the article body or footer

## Governance & compliance
- [ ] `source` is present and meaningful
- [ ] `approvedBy` is set
- [ ] `approvedAt` is set
- [ ] Draft footer/disclaimer has been removed from the published body

## Technical readiness
- [ ] Frontmatter is valid
- [ ] Article renders locally without errors
- [ ] Tags and category are correct
- [ ] `npm run newsroom:verify` passes

## Publish decision
- [ ] Approve for publication
- [ ] Needs revision (leave `approved: false`)