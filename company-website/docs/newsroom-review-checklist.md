# Newsroom Review Checklist (Required Before Approval)

Use this checklist before setting `approved: true`.

## Editorial quality
- [ ] Headline is clear, specific, and not hypey
- [ ] Description is concise and accurate
- [ ] Claims are practical and relevant to DTP’s audience
- [ ] No placeholder or scaffold text remains
- [ ] The article includes a clear DTP context section

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