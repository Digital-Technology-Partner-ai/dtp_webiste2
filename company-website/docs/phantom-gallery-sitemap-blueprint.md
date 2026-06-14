# DTP Phantom Gallery Website Sitemap Blueprint

Working draft for turning the current Digital Technology Partner website and the local Phantom Gallery prototype into a full website experience.

Last updated: 2026-06-11

## Main Deliverable

Create a clear sitemap and experience blueprint for the new DTP immersive website. The blueprint should define:

- The final website structure.
- The Phantom Gallery hub destinations.
- The product, programme and service pages required.
- How current website content moves into the new structure.
- What each page or area needs to say and do.
- The next design and build tasks.

Visual sitemap:

- FigJam board: https://www.figma.com/board/aeZja2omuJMNPEeCwltu4P

## Source Material

Current public site:

- Home: https://digitaltechnologypartner.ai/
- Our Approach: https://digitaltechnologypartner.ai/services/
- Case Studies: https://digitaltechnologypartner.ai/case-studies/
- FAQ: https://digitaltechnologypartner.ai/faq/
- Newsroom: https://digitaltechnologypartner.ai/news/
- Contact: https://digitaltechnologypartner.ai/contact/

Audience and market context:

- /Users/steveshearman/Downloads/1781188067966.pdf
- Notes extracted from the PDF should inform user journeys, value proposition, AI Adoption Readiness, AI Foundry and Senior Leadership AI Coaching.

Local branch context:

- Repository: Digital-Technology-Partner-ai/dtp_webiste2
- Branch: feature/phantom-gallery-experience
- Current app root: company-website
- Current Astro pages live under: company-website/src/pages

## Strategic Direction

The new website should not simply put the old menu into a 3D interface. The Phantom Gallery should act as the DTP ecosystem map: a spatial, business-focused navigation environment that helps visitors understand the relationship between AI readiness, practical programmes, solution delivery, proof and leadership support.

The experience should feel like:

- A professional AI operations environment.
- A strategic technology ecosystem.
- A premium digital command centre.
- A credible business website first, with immersive navigation as the differentiator.

Avoid:

- Gaming language.
- Heavy cyberpunk styling.
- Over-complex navigation.
- Hiding important buying information behind interaction.

## Architecture Decisions

These decisions resolve the remaining open questions and should now guide Stage 3 page blueprints and Stage 4 build planning.

| Decision | Resolution | Rationale |
| --- | --- | --- |
| Homepage role | `/` becomes the immersive ecosystem hub. Keep `/ecosystem/` as a build/staging alias or fallback route during implementation. | The immersive ecosystem is the differentiator and should be the first impression. Premium execution depends on making the hub fast, accessible and commercially clear, with conventional navigation always available. |
| AI Adoption Readiness depth | Begin with one strong parent page at `/programmes/ai-adoption-readiness/`. Treat Snapshot, Diagnostic and Advisory as deep page sections, not separate phase-one routes. | One high-converting offer page will be easier to understand and stronger for conversion than three thin child pages. Child routes can be added later when each version has enough distinct search intent, proof and FAQs. |
| Newsroom label | Rename `Newsroom` to `Insights` in the new IA. Keep `/news/` as a technical legacy route or redirect later. | `Insights` feels more useful, premium and advisory. It better supports thought leadership, adoption guidance and practical AI decision support. |
| About page | Absorb the current About role into `/why-dtp/` for phase one. Do not keep `/about/` in the primary navigation. | Buyers need trust, fit and delivery confidence more than a generic About page. Founder/team story can appear inside Why DTP where it answers buying doubt. |
| Products area | Keep app/product pages as utility routes outside the primary Phantom Gallery destinations. Revisit a Products area later if DTP wants a product portfolio. | The phase-one experience should reduce cognitive load and focus on programmes, solutions, proof and contact. |
| Primary navigation | Use a restrained visible nav: Why DTP, Programmes, Solutions, Case Studies, Insights, Contact. Place Process and FAQ in the nav belt, footer and contextual links. | A premium top navigation should stay below the user's cognitive limit. Process and FAQ remain important, but they work better as reassurance layers near moments of doubt. |

## Proposed Primary Sitemap

```text
/
Ecosystem Hub
Immersive homepage and primary spatial navigation experience.

/why-dtp/
Why DTP
Trust, credibility, risk reduction, security, delivery confidence and fit.

/programmes/
Programmes
Packaged DTP offers that help organisations decide, learn and lead with AI.

/programmes/ai-adoption-readiness/
AI Adoption Readiness
One-week assessment showing what is already happening with AI, where risk sits and what leadership should do next. Snapshot, Diagnostic and Advisory begin as sections on this parent page.

/programmes/ai-foundry/
AI Foundry
A practical working group programme, positioned as a club rather than a course.

/programmes/leadership-ai-coaching/
Senior Leadership AI Coaching
Discreet one-to-one technology and AI coaching for senior leaders.

/solutions/
Solutions
The practical business problems DTP helps solve through AI and digital systems.

/solutions/business-systems-strategy/
Business Systems Strategy
Current estate, future-state architecture, strategic options, roadmap and investment case.

/solutions/data-reporting/
Data and Reporting
Dashboards, alerts, operational visibility, reporting pipelines and actionable insight.

/solutions/operations-automation/
Operations Automation
Workflow automation, document processing, task routing and manual-effort reduction.

/solutions/ai-agents/
AI Agents
Messaging-native agents, task extraction, operational copilots and agentic workflows.

/solutions/bespoke-ai-systems/
Bespoke AI Systems
Custom AI tools, integrations and production-ready digital products.

/process/
How We Work
Discovery, PoC, MVP, Pilot and Launch. This should explain delivery method, not act as the main services page.

/case-studies/
Client Outcomes
Proof, results and business impact.

/insights/
Insights
Newsroom, thought leadership and practical AI guidance.

/faq/
Questions
Buying concerns, timelines, security, pricing, support and adoption questions.

/contact/
Start a Conversation
Discovery call, email, WhatsApp and location details.
```

## Utility And Non-Primary Pages

These pages can remain in the codebase but should not appear as primary Phantom Gallery destinations:

- /apps/whichlogin/
- /apps/whichlogin/support/
- /apps/whichlogin/privacy-policy/
- /apps/10-touches/privacy-policy/
- /10-touches/privacy/
- /10-touches/privacy/beta/
- /thank-you/
- /booking-test/
- Design exploration routes such as /design-v1/ to /design-v5/ and /design-option-1/ to /design-option-5/

Decision needed later:

- Whether app/product pages should sit under a future "Products" area or remain separate utility routes.

## Phantom Gallery Destination Model

The visual hub can use evocative destination names while routes remain clear and SEO-friendly.

| Hub destination | Route | Visitor question answered | Suggested hover copy |
| --- | --- | --- | --- |
| Command Centre | /why-dtp/ | Why should we trust DTP? | Understand how DTP reduces risk, protects delivery and turns AI into practical business value. |
| Adoption Radar | /programmes/ai-adoption-readiness/ | Are we ready for AI, and where is the risk? | A one-week view of current AI activity, adoption risk and leadership next steps. |
| Foundry Floor | /programmes/ai-foundry/ | How do we build confidence and surface real opportunities? | A practical working group for teams exploring useful, evidence-led AI adoption. |
| Leadership Suite | /programmes/leadership-ai-coaching/ | Can senior leaders get private AI support? | Discreet one-to-one coaching, planning and practical technology support for leaders. |
| Solution Engine | /solutions/ | What problems can DTP help us solve? | Explore strategy, reporting, automation, AI agents and bespoke AI systems. |
| Delivery Path | /process/ | How does DTP deliver safely? | See the staged route from Discovery to Launch, with validation at every step. |
| Proof Vault | /case-studies/ | Has this worked before? | Review real client outcomes across manufacturing, infrastructure and operations. |
| Signal Feed | /insights/ | What is DTP thinking about now? | Practical AI insight, adoption guidance and market signals for leaders. |
| Question Layer | /faq/ | What do buyers usually ask? | Clear answers on timelines, security, support, pricing and implementation. |
| Contact Beacon | /contact/ | How do we start? | Book a discovery call or speak directly with DTP. |

## Recommended Main Navigation

For the conventional navigation belt or fallback header:

```text
Why DTP
Programmes
Solutions
Case Studies
Insights
Contact
```

Process and FAQ should remain prominent in the immersive navigation belt, footer, command palette and contextual page links. They should not need to compete for space in the highest-level conventional header.

## Content Migration Map

| Current content | New destination | Action |
| --- | --- | --- |
| Homepage headline and value proposition | / and /why-dtp/ | Reuse core message, rewrite around ecosystem entry and leadership clarity. |
| Benefits: reduced risk, security, reliable delivery, scales with you, flexible engagement, works with your tools | /why-dtp/ | Expand into credibility and reassurance sections. |
| Use cases: Business Systems Strategy, Data and Reporting, Operations Automation | /solutions/ and child pages | Promote into solution cards and deeper pages. |
| Process: Discovery, PoC, MVP, Pilot, Launch | /process/ | Reuse and expand. Keep practical and buyer-friendly. |
| Case studies | /case-studies/ | Reframe as outcomes with stronger metrics and sector tags. Consider individual case study pages later. |
| Testimonials | /why-dtp/, /case-studies/, hub previews | Use as trust signals across relevant pages. |
| FAQ | /faq/ plus contextual page sections | Keep master FAQ and add targeted FAQ blocks to programme and solution pages. |
| Newsroom | /insights/ | Rename from Newsroom to Insights. Keep `/news/` as a legacy technical route or redirect path during build. |
| Contact and booking CTA | /contact/ plus persistent CTA | Keep, but make entry points clearer by visitor intent. |
| AI Adoption Readiness | /programmes/ai-adoption-readiness/ | New content required. Treat as a primary commercial offer. |
| Readiness Snapshot | /programmes/ai-adoption-readiness/#snapshot | New content required. Define as entry-level baseline. |
| Readiness Diagnostic | /programmes/ai-adoption-readiness/#diagnostic | New content required. Define interview/listening-led option. |
| Readiness Advisory | /programmes/ai-adoption-readiness/#advisory | New content required. Define leadership interpretation and discussion. |
| AI Foundry | /programmes/ai-foundry/ | New content required. Position as a club, not a course. |
| Senior Leadership AI Coaching | /programmes/leadership-ai-coaching/ | New content required. Position as discreet senior support. |

## Audience Archetypes And Emotional Context

The PDF supplied by the user describes six CEO archetypes that are useful for the new site's user journeys, value proposition and product positioning. These should not necessarily be used as public labels, but they are strong internal planning personas.

| Internal archetype | Current state | What they feel | What they need from DTP | Best entry point |
| --- | --- | --- | --- | --- |
| Doubting Thomas | Denial or scepticism | Publicly sceptical but privately concerned that competitors may be moving faster. | Evidence, a narrow use case, low-risk proof and commercial relevance. | AI Adoption Readiness or Why DTP |
| Expensive Googlers | Disillusion after tool rollout | They have spent money on AI licences but users treat the tools like search. | Workflow redesign, measurement, adoption support and value-per-seat clarity. | AI Adoption Readiness, AI Foundry or Solutions |
| Compliance Hostages | Blocked by security, legal or GDPR concerns | They can see better tools, but feel constrained by policy and fear of risk. | Secure architecture, EU-region or tenant-aware deployment thinking, governance and PII handling. | Why DTP, AI Adoption Readiness or Leadership AI Coaching |
| Tyre-Kickers | Dabbling without commitment | They are "doing AI" in fragments, but without ownership, budget or a success measure. | One properly owned initiative, a defined number, a practical plan and accountability. | AI Adoption Readiness or Process |
| AI Evangelists | Committed but sprawling | They have sponsorship and energy, but too many initiatives are blooming at once. | Operating model, governance, prioritisation and route from strategy deck to deployment. | AI Foundry, Solutions or Process |
| Agent Cowboys | Agentic and uncontrolled | They are moving fast with frontier tools and autonomous agents, but governance is thin. | Control plane thinking, multi-model gateway, ROI visibility and governance across use cases. | Leadership AI Coaching, AI Adoption Readiness or AI Agents |

Important emotional and market context to carry into copy and journeys:

- Leaders are overwhelmed by the pace of AI model releases and cannot process every change themselves.
- The quality of outputs is improving quickly, so waiting for perfect certainty creates risk.
- There is no settled map; most organisations are feeling their way through uncertainty.
- The gap is widening and compounding between organisations that deploy well and those that only experiment.
- The hard part is not trying agents; the hard part is deploying AI as an enterprise system.
- The challenge is now as much people, change and culture as it is technology.
- Context is central. AI has to be wired into the business, not treated as a standalone tool.
- The response needs vision, strategy, planning and disciplined implementation.

Implications for DTP:

- AI Adoption Readiness should be framed around clarity, risk and next-step evidence.
- AI Foundry should be framed around confidence, practical opportunity discovery and leadership evidence.
- Senior Leadership AI Coaching should speak directly to confusion, discretion, confidence and the need for a trusted technical sounding board.
- Solutions pages should avoid "AI hype" language and instead show controlled deployment, measurable value and operating-system thinking.

## Page Responsibilities

### /

Purpose:

- Introduce DTP and the immersive ecosystem.
- Let users explore visually without losing quick access to key routes.
- Present the core promise: AI that works, simplified.

Primary CTA:

- Book a discovery call.

Secondary CTA:

- Explore the ecosystem or start with AI Adoption Readiness.

### /why-dtp/

Purpose:

- Build confidence before visitors evaluate offers.
- Explain why DTP is practical, low-risk and outcome-focused.

Core sections:

- Why organisations work with DTP.
- Security and governance.
- Works with existing tools.
- Stage-gated delivery.
- Testimonials.
- Who DTP is best suited for.

### /programmes/

Purpose:

- Present packaged ways to engage with DTP before or alongside delivery.

Core sections:

- AI Adoption Readiness.
- AI Foundry.
- Senior Leadership AI Coaching.
- Recommended pathway: assess, build confidence, decide, deliver.

### /programmes/ai-adoption-readiness/

Purpose:

- Explain the one-week readiness assessment and help buyers choose the right level.

Core sections:

- What it is.
- Who it is for.
- What leadership gets at the end.
- Three versions: Snapshot, Diagnostic, Advisory.
- How it connects to AI Foundry or solution delivery.

### /programmes/ai-foundry/

Purpose:

- Position the Foundry as a practical working group programme, not passive training.

Core sections:

- Club, not course.
- Who joins.
- What happens inside.
- Outputs and evidence for leadership.
- How it surfaces real opportunities.
- Link to readiness outcomes.

### /programmes/leadership-ai-coaching/

Purpose:

- Offer discreet, senior-level support for leaders who need clarity, confidence and technical translation.

Core sections:

- One-to-one coaching.
- Strategy and planning.
- Confidential sounding board.
- Practical hands-on technical support.
- Ideal client situations.

### /solutions/

Purpose:

- Show the practical problems DTP solves.

Core sections:

- Business Systems Strategy.
- Data and Reporting.
- Operations Automation.
- AI Agents.
- Bespoke AI Systems.
- Relevant case study links.

### /process/

Purpose:

- Explain how DTP moves from idea to impact with reduced risk.

Core sections:

- Discovery.
- Proof of Concept.
- MVP.
- Pilot.
- Full Launch.
- Decision gates.
- What the client gets at each stage.

### /case-studies/

Purpose:

- Provide proof.

Core sections:

- Surface area calculation automation.
- Manufacturing maintenance via messaging.
- AI/ML technical partner for infrastructure analytics.
- Results summary by outcome type.

### /insights/

Purpose:

- Build authority and provide useful AI guidance.

Core sections:

- Featured insight.
- Adoption and governance.
- Operations and automation.
- AI agents.
- CTO/leadership guidance.

### /faq/

Purpose:

- Remove buying friction.

Core sections:

- Getting started.
- Security.
- Timelines.
- Pricing model.
- Support and optimisation.
- Technical expertise required.
- Stage-gate process.
- Programme-specific questions.

### /contact/

Purpose:

- Convert interest into conversation.

Core sections:

- Book a discovery call.
- Email.
- WhatsApp.
- Location.
- Suggested reason-to-contact prompts.

## Key User Journeys

### Sceptical leader who needs proof

```text
Ecosystem Hub -> Command Centre -> Adoption Radar -> AI Adoption Readiness -> Case Studies -> Contact
```

Journey intent:

- Move them from scepticism to a narrow, evidence-led first step.
- Avoid hype.
- Make the first commitment feel controlled and commercially relevant.

### Organisation that has bought tools but not changed work

```text
Ecosystem Hub -> Adoption Radar -> AI Adoption Readiness -> Foundry Floor -> Solution Engine -> Contact
```

Journey intent:

- Show that licence spend alone does not create business value.
- Move the discussion towards workflow redesign, adoption and value-per-seat evidence.
- Use AI Foundry as the bridge between tool access and practical behaviour change.

### Compliance-blocked leadership team

```text
Ecosystem Hub -> Command Centre -> Why DTP -> Adoption Radar -> Leadership Suite -> Contact
```

Journey intent:

- Reassure around security, GDPR, governance and safe architecture.
- Show that DTP can help leadership progress without bypassing controls.
- Make private leadership support feel credible and discreet.

### Dabbling organisation with no clear owner

```text
Ecosystem Hub -> Adoption Radar -> AI Adoption Readiness -> Delivery Path -> Contact
```

Journey intent:

- Turn loose experimentation into one owned initiative.
- Introduce a number, a responsible owner and a stage-gated route.
- Position readiness as the antidote to weak pilots.

### Energetic AI sponsor with too many initiatives

```text
Ecosystem Hub -> Foundry Floor -> Solution Engine -> Delivery Path -> Contact
```

Journey intent:

- Help them convert enthusiasm into an operating model.
- Prioritise opportunities.
- Show how pilots converge into repeatable delivery.

### Fast-moving agent adopter with governance risk

```text
Ecosystem Hub -> Leadership Suite -> Solution Engine -> AI Agents -> Command Centre -> Contact
```

Journey intent:

- Acknowledge ambition and speed.
- Introduce control, ROI visibility and governance without sounding anti-innovation.
- Position DTP as the partner that can turn agentic energy into a manageable system.

### Existing relationship or senior executive

```text
Ecosystem Hub -> Leadership Suite -> Contact
```

Journey intent:

- Provide a discreet route for senior leaders who want a trusted person to talk to.
- Support strategy, planning, practical questions and confidence-building.
- Keep the page calm, direct and low-friction.

## Design And Build Tasks

### Stage 1 - Confirm sitemap

- Review this document. Status: confirmed by user as a working basis.
- Confirm route names. Status: route names make sense for now.
- Confirm whether "Programmes" is the right top-level label. Status: keep "Programmes" for now.
- Confirm whether FAQ stays top-level or becomes supporting navigation. Status: FAQ stays top-level.
- Confirm whether individual case study pages are required in phase one. Status: no individual case study pages in phase one; keep a single Case Studies page.

### Stage 2 - Create FigJam/Figma map

- Convert the primary sitemap into a visual map. Status: complete in FigJam.
- Add the Phantom Gallery destination model. Status: complete in FigJam.
- Add key user journeys. Status: complete in FigJam via persona-led journey diagram.
- Add content ownership notes for each page. Status: drafted in this blueprint; next FigJam edit should add these as a planning board when the Figma MCP tool-call limit resets.

Stage 2 FigJam board:

- https://www.figma.com/board/aeZja2omuJMNPEeCwltu4P

Recommended next FigJam addition:

- A "Stage 2 Planning Board" section containing confirmed decisions, open decisions, hub destination ownership, persona-led journey priorities and content ownership notes.

### Stage 2 Planning Board Content

This section is the paste-ready content for the next FigJam update. It should sit to the right of the existing sitemap, destination model and persona-led journey diagram as a practical decision and ownership layer.

Suggested FigJam section title:

- Stage 2 Planning Board

Suggested subtitle:

- What is confirmed, what still needs a decision and what each destination must own before page blueprinting begins.

#### Confirmed Decisions

Use these as green or blue confirmation cards:

| Decision | Current position | Implication |
| --- | --- | --- |
| Sitemap direction | Accepted as a working basis. | Proceed to page-level planning rather than reopening the full IA. |
| Route names | Acceptable for now. | Use clear SEO-friendly route names while the hub can use more evocative labels. |
| Programmes label | Keep "Programmes". | AI Adoption Readiness, AI Foundry and Leadership AI Coaching sit together as packaged offers. |
| FAQ | Keep as top-level navigation. | FAQ remains visible in the main nav and can also be reused contextually. |
| Case studies | Keep one Case Studies page in phase one. | No individual case study page build is required for the first release. |
| Phantom Gallery role | Treat as ecosystem navigation, not a visual wrapper for the old menu. | The hub should show relationships between readiness, programmes, solutions, proof and contact. |

#### Open Decisions

Use these as pink or gold decision-needed cards:

| Decision | Options | Recommendation to test |
| --- | --- | --- |
| Homepage role | `/` as immersive ecosystem, or `/ecosystem/` as hub with `/` as a conventional entry. | Favour `/` as the ecosystem if the experience remains fast, accessible and commercially clear. Keep `/ecosystem/` as a fallback or preview route during build. |
| AI Adoption Readiness depth | Three child pages immediately, or Snapshot, Diagnostic and Advisory as sections on one parent page. | Start with one parent page and deep sections unless each version has enough distinct sales copy, FAQs and CTAs. |
| Newsroom label | Keep `Newsroom`, or rename to `Insights`. | Favour `Insights` because it better fits practical AI guidance and leadership content. |
| About page | Restore `/about/`, or absorb into `/why-dtp/`. | Absorb most content into `/why-dtp/` unless there is a strong founder/team story that needs its own page. |
| Products area | Keep app/product pages as utility routes, or create a future Products area. | Keep utility routes out of primary navigation for phase one, then review if DTP needs a products portfolio later. |

#### Hub Destination Ownership

Use these as destination ownership cards under each Phantom Gallery hub label:

| Hub destination | Route | Owns | Must make clear |
| --- | --- | --- | --- |
| Command Centre | `/why-dtp/` | Trust, credibility, security and delivery confidence. | Why DTP is a low-risk, practical partner for serious AI and digital work. |
| Adoption Radar | `/programmes/ai-adoption-readiness/` | Readiness, risk, current-state clarity and next-step evidence. | Leaders can get a one-week view of what is happening, where risk sits and what to do next. |
| Foundry Floor | `/programmes/ai-foundry/` | Collaborative opportunity discovery and confidence-building. | This is a practical working group club, not passive AI training. |
| Leadership Suite | `/programmes/leadership-ai-coaching/` | Discreet senior support, translation and decision confidence. | Senior leaders can get private help without needing to become technical specialists. |
| Solution Engine | `/solutions/` | Practical business problems and DTP solution areas. | DTP solves business systems, reporting, automation, agent and bespoke AI problems. |
| Delivery Path | `/process/` | Method, sequence, validation and risk reduction. | DTP moves from Discovery to Launch through stage-gated decisions. |
| Proof Vault | `/case-studies/` | Evidence, outcomes and sector credibility. | DTP has delivered practical results in operational and technical contexts. |
| Signal Feed | `/insights/` | Thought leadership and practical market guidance. | DTP understands the AI adoption landscape and can explain it without hype. |
| Question Layer | `/faq/` | Buying friction, reassurance and practical answers. | Prospects can understand timelines, security, pricing, support and implementation expectations. |
| Contact Beacon | `/contact/` | Conversion and intent capture. | Visitors can start the right conversation quickly. |

#### Persona Journey Priorities

Use these as journey-priority cards connected back to the existing persona-led journey diagram:

| Priority | Persona context | Primary route | Planning note |
| --- | --- | --- | --- |
| 1 | Expensive Googlers | Adoption Radar -> Foundry Floor -> Solution Engine | This is likely a strong commercial entry point because the pain is visible: money has been spent but work has not changed. |
| 2 | Compliance Hostages | Command Centre -> Adoption Radar -> Leadership Suite | Reassurance, governance and senior confidence should appear before selling delivery. |
| 3 | Tyre-Kickers | Adoption Radar -> Delivery Path | The page flow should convert dabbling into one owned initiative with a number and a decision gate. |
| 4 | AI Evangelists | Foundry Floor -> Solution Engine -> Delivery Path | The message should channel energy into prioritisation, governance and practical implementation. |
| 5 | Agent Cowboys | Leadership Suite -> AI Agents -> Command Centre | Speak to ambition first, then introduce control, ROI visibility and operating-model thinking. |
| 6 | Doubting Thomas | Command Centre -> Adoption Radar -> Proof Vault | Avoid hype. Lead with proof, risk reduction and a narrow first step. |

#### Content Ownership Notes

Use these as page-card prompts during Stage 3:

| Page | Content owner / source | New copy needed |
| --- | --- | --- |
| `/` | Existing homepage value proposition plus Phantom Gallery prototype direction. | Ecosystem entry copy, hub orientation and fallback conventional navigation copy. |
| `/why-dtp/` | Existing benefits, testimonials, security and delivery confidence content. | Stronger trust narrative, fit criteria and credibility framing. |
| `/programmes/` | New DTP programme positioning. | Short overview of assess, build confidence, decide and deliver. |
| `/programmes/ai-adoption-readiness/` | User-supplied offer description and six-archetype PDF insight. | Full commercial page copy, deliverables, levels, timeline, FAQs and CTAs. |
| `/programmes/ai-foundry/` | User-supplied "club not course" positioning. | Membership/workgroup explanation, outputs, cadence, evidence and leadership benefits. |
| `/programmes/leadership-ai-coaching/` | User-supplied senior support offer and archetype insight. | Discreet one-to-one positioning, use cases, boundaries, outcomes and enquiry CTA. |
| `/solutions/` | Current use cases and case study references. | Solution grouping copy and stronger links from problems to measurable business outcomes. |
| `/process/` | Existing Discovery, PoC, MVP, Pilot and Launch content. | Decision gates, client outputs and risk-control language. |
| `/case-studies/` | Current case study assets and testimonials. | Outcome-led summaries with sector tags and stronger metrics where available. |
| `/insights/` | Current Newsroom content. | Rename and reorganise around adoption, governance, agents, operations and leadership. |
| `/faq/` | Existing FAQ. | Add programme-specific and immersive-navigation questions. |
| `/contact/` | Existing contact and booking content. | Intent-led contact prompts and clearer programme/solution enquiry paths. |

#### FigJam Layout Suggestion

Build the Stage 2 Planning Board as five horizontal zones:

1. Confirmed decisions.
2. Open decisions.
3. Hub destination ownership.
4. Persona journey priorities.
5. Content ownership notes.

Recommended visual treatment:

- Confirmed decisions: blue or green cards.
- Open decisions: gold or pink cards.
- Ownership notes: white cards inside a soft blue or light grey section.
- Persona priorities: numbered cards with the route path shown as small supporting text.
- Keep this board practical and legible at overview zoom; it is a planning layer, not a second sitemap.

### Stage 3 - Page blueprints

- Create a page card for each primary route. Status: complete in `company-website/docs/phantom-gallery-stage-3-page-blueprints.md`.
- Define page objective, sections, CTAs and source content. Status: complete in `company-website/docs/phantom-gallery-stage-3-page-blueprints.md`.
- Draft missing content direction for readiness, foundry and coaching pages. Status: complete as page-level blueprint guidance.

### Stage 4 - Prototype integration

- Add or restore the /ecosystem/ route if required.
- Replace placeholder hub nodes with agreed destination labels.
- Wire hub destinations to real pages.
- Add hover copy and entry transitions.
- Add conventional navigation belt.

### Stage 5 - Build pages

- Build new Astro routes.
- Create reusable programme, solution, proof and CTA components.
- Migrate current content.
- Add new product/programme copy.
- Test mobile, accessibility and reduced-motion behaviour.

## Resolved Decisions

- Homepage route `/` should be the immersive ecosystem. `/ecosystem/` can exist as a staging, preview or alias route during implementation.
- AI Adoption Readiness should begin as one strong parent page with Snapshot, Diagnostic and Advisory as sections. Do not create separate child pages in phase one.
- Newsroom should become Insights in the new user-facing IA. Keep `/news/` as a technical legacy route or redirect later.
- The current About page role should be absorbed into `/why-dtp/` for phase one.
- App/product utility pages should remain outside the primary Phantom Gallery destinations for phase one.
- Visible conventional header navigation should be restrained to Why DTP, Programmes, Solutions, Case Studies, Insights and Contact. Process and FAQ remain available through the navigation belt, footer and contextual links.

## Stage 1 Decisions Recorded

- Sitemap reviewed and accepted as a working basis.
- Route names are acceptable for now.
- Keep "Programmes" as the top-level label for AI Adoption Readiness, AI Foundry and Senior Leadership AI Coaching.
- Keep FAQ as a top-level page in the main navigation.
- Do not create individual case study pages in phase one. Keep a single Case Studies page.
