# DTP Phantom Gallery Stage 3 Page Blueprints

Working page-level blueprint for the new Digital Technology Partner immersive website.

Last updated: 2026-06-11

Related files:

- `company-website/docs/phantom-gallery-sitemap-blueprint.md`
- `company-website/docs/phantom-gallery-stage-2-planning-board.html`
- FigJam board: https://www.figma.com/board/aeZja2omuJMNPEeCwltu4P

## Design Authority Decisions

These are the decisions to design and build against.

| Area | Decision |
| --- | --- |
| Homepage | `/` is the Phantom Gallery ecosystem hub. It should be the first impression, not a hidden novelty route. |
| Fallback route | `/ecosystem/` can exist as a staging, preview or alias route during build, but not as the primary public concept. |
| Readiness offer | Keep Snapshot, Diagnostic and Advisory as sections on `/programmes/ai-adoption-readiness/` for phase one. |
| Newsroom | Rename to Insights. Keep `/news/` only as a legacy route or redirect during implementation. |
| About | Absorb into Why DTP. Do not make About a primary navigation item in phase one. |
| Top navigation | Keep visible header nav restrained: Why DTP, Programmes, Solutions, Case Studies, Insights, Contact. |
| Support navigation | Process and FAQ stay visible through the immersive navigation belt, footer and contextual page links. |

## Premium Design Principles

The site should feel premium because it is clear, confident and controlled, not because it is visually busy.

- One dominant first impression: a strategic AI operations environment with the DTP ecosystem visible immediately.
- One primary action above the fold: book a discovery call or start with AI Adoption Readiness depending on page context.
- Conventional navigation must always be available. Immersion is the differentiator, not the only way through.
- Proof should sit near moments of doubt: near CTAs, programme claims, process claims and security reassurance.
- Avoid generic AI language. Lead with clarity, control, evidence and deployment discipline.
- Keep motion purposeful: hover, focus, selected destination and transition states should feel precise and calm.
- Respect reduced-motion preferences and provide a non-immersive page path for accessibility and performance.
- Use generous spacing, restrained contrast and high-quality typography. The feeling should be advisory, not arcade.

## Global Components Needed

| Component | Purpose | Notes |
| --- | --- | --- |
| Immersive ecosystem hub | Primary homepage experience and spatial navigation. | Destination nodes, hover copy, selected-state transition, return control and reduced-motion fallback. |
| Conventional header | Fast route access and credibility layer. | Keep to six visible items. Add CTA button for Contact or Book a Call. |
| Navigation belt | In-scene route strip around the hub. | Can include Process and FAQ without overloading the header. |
| Programme card | Reusable card for Readiness, Foundry and Coaching. | Needs audience, outcome, timeframe, CTA and proof hook. |
| Solution card | Reusable card for solution areas. | Needs problem, DTP response, typical output and related proof. |
| Proof strip | Case-study or testimonial strip near CTAs. | Prefer quantified outcomes and sector context. |
| FAQ block | Contextual buying-friction reducer. | Page-specific FAQs plus links to master FAQ. |
| Contact intent selector | Helps route enquiries. | Options: readiness assessment, AI Foundry, leadership coaching, solution delivery, general. |

## Page Blueprint: `/`

Page name: Ecosystem Hub

Primary job:

- Create the premium first impression and make the DTP ecosystem instantly understandable.

Target visitors:

- Senior leaders, operational leaders, AI sponsors and technical decision-makers who need a clear map for AI adoption.

Hero promise:

- See how readiness, people, systems, agents and delivery fit together.

Primary CTA:

- Book a discovery call.

Secondary CTA:

- Start with AI Adoption Readiness.

Core sections:

1. Immersive ecosystem scene.
   - Destination nodes: Command Centre, Adoption Radar, Foundry Floor, Leadership Suite, Solution Engine, Delivery Path, Proof Vault, Signal Feed, Question Layer, Contact Beacon.
   - Hover reveals one clear visitor question and one sentence of value.
   - Click transitions to the relevant route.
2. Conventional route layer.
   - Header: Why DTP, Programmes, Solutions, Case Studies, Insights, Contact.
   - Navigation belt can include Process and FAQ.
3. Leadership clarity panel.
   - Short copy that names the problem: leaders are overwhelmed, AI is moving fast, and the gap is widening.
   - Position DTP as the partner that turns uncertainty into a controlled path.
4. Featured pathway.
   - Recommended route: Adoption Radar -> AI Foundry -> Solution Engine.
   - This should guide visitors who are unsure where to begin.
5. Proof preview.
   - Three compact client outcome cards.
6. Final CTA.
   - "Start with a practical conversation."

Design notes:

- Full-viewport immersive scene with a visible hint of next content below the fold.
- Do not hide the commercial proposition behind interaction.
- Provide a clear static fallback for mobile, reduced motion and low-powered devices.

SEO/meta focus:

- AI adoption, digital transformation partner, business automation, AI systems, Aberdeen / UK positioning if relevant.

## Page Blueprint: `/why-dtp/`

Page name: Why DTP

Primary job:

- Build trust before the visitor evaluates programmes or delivery.

Target visitors:

- Compliance-sensitive buyers, sceptical leaders, procurement stakeholders and senior decision-makers.

Hero promise:

- Practical AI and digital systems, delivered with control.

Primary CTA:

- Talk through your situation.

Secondary CTA:

- Explore AI Adoption Readiness.

Core sections:

1. Trust headline.
   - DTP helps organisations move from AI noise to practical, governed implementation.
2. Why organisations choose DTP.
   - Reduced risk.
   - Security-aware delivery.
   - Works with existing tools.
   - Stage-gated progress.
   - Practical business outcomes.
3. How DTP reduces risk.
   - Discovery, proof, MVP, pilot and launch.
   - Explain that clients can make decisions at each gate.
4. Governance and security confidence.
   - GDPR, PII, tenant-aware architecture, controlled deployment and human oversight.
5. Who DTP is best suited for.
   - Organisations that need clear ownership, measurable value and a practical route to deployment.
6. Proof and testimonials.
   - Place proof near claims, not only at the end.
7. Fit CTA.
   - "Find out whether DTP is the right partner."

Design notes:

- Calm, authoritative and less visually experimental than the hub.
- Use proof, process and security cues as visual trust anchors.

## Page Blueprint: `/programmes/`

Page name: Programmes

Primary job:

- Explain the packaged ways to engage with DTP before or alongside solution delivery.

Target visitors:

- Leaders who know they need help but do not yet know whether they need assessment, team enablement, private coaching or implementation.

Hero promise:

- Structured ways to assess, focus and lead AI adoption.

Primary CTA:

- Compare the programmes.

Secondary CTA:

- Book a discovery call.

Core sections:

1. Programme overview.
   - Assess: AI Adoption Readiness.
   - Build confidence: AI Foundry.
   - Lead with support: Senior Leadership AI Coaching.
2. Recommended pathway.
   - Readiness -> Foundry -> Solution delivery.
   - Coaching can sit alongside any stage.
3. Programme cards.
   - Each card needs: who it is for, what happens, what leadership gets, likely next step.
4. Which programme fits?
   - Short decision guide based on visitor situation.
5. Proof or credibility strip.
6. Programme CTA.

Design notes:

- Dense but calm. This is an advisory comparison page, not a marketing splash page.
- Use a decision matrix or segmented control to help visitors self-select.

## Page Blueprint: `/programmes/ai-adoption-readiness/`

Page name: AI Adoption Readiness

Primary job:

- Convert uncertain leaders into a low-risk first step.

Target visitors:

- Doubting Thomas, Expensive Googlers, Compliance Hostages and Tyre-Kickers.

Hero promise:

- A one-week assessment showing what is already happening with AI, where risk sits and what leadership should do next.

Primary CTA:

- Book a readiness call.

Secondary CTA:

- Compare the three readiness levels.

Core sections:

1. Problem statement.
   - Most organisations do not need another generic AI talk. They need to know what is already happening, what is useful, what is risky and what to do next.
2. What the assessment answers.
   - Where AI is already being used.
   - Where value is being missed.
   - Where policy, data or adoption risk sits.
   - Which initiative deserves ownership first.
3. Who it is for.
   - Bought tools without adoption.
   - Stalled by compliance.
   - Dabbling without ownership.
   - Leadership wants clarity without committing to a major programme.
4. Three levels.
   - Snapshot: fast self-reporting baseline.
   - Diagnostic: structured answers plus AI-led interviews/listening sessions.
   - Advisory: DTP human interpretation and leadership discussion.
5. One-week flow.
   - Day 1: scope and stakeholder map.
   - Days 2-3: input gathering and listening.
   - Day 4: analysis and risk/opportunity mapping.
   - Day 5: leadership readout and recommended next steps.
6. What leadership receives.
   - Current-state map.
   - Risk and opportunity summary.
   - Priority use-case shortlist.
   - Recommended next action.
7. How it connects.
   - AI Foundry if the next need is team confidence and opportunity discovery.
   - Solution delivery if a clear, owned use case is ready.
   - Leadership coaching if senior decision support is the blocker.
8. Contextual FAQ.
9. CTA with proof nearby.

Design notes:

- This is likely the strongest first commercial offer. Make it feel controlled, time-boxed and easy to buy.
- Avoid over-selling AI transformation. Sell clarity and a next decision.

## Page Blueprint: `/programmes/ai-foundry/`

Page name: AI Foundry

Primary job:

- Position the Foundry as a practical working group club that turns interest into evidence and opportunity.

Target visitors:

- Expensive Googlers, AI Evangelists and teams that need confidence without another passive course.

Hero promise:

- A practical working group for finding useful, evidence-led AI opportunities inside the business.

Primary CTA:

- Discuss Foundry membership.

Secondary CTA:

- Start with AI Adoption Readiness.

Core sections:

1. Club, not course.
   - Make the distinction explicit: this is not passive training, generic prompts or a lecture series.
2. Who joins.
   - Leaders, operational owners, managers, technical stakeholders and selected power users.
3. What happens inside.
   - Working sessions.
   - Use-case exploration.
   - Workflow analysis.
   - Tool and agent demonstrations.
   - Governance and value discussion.
4. Outputs.
   - Opportunity backlog.
   - Prioritised experiments.
   - Adoption observations.
   - Leadership evidence.
   - Candidate delivery roadmap.
5. Why it works.
   - People learn by applying AI to real work.
   - Leadership gets evidence, not enthusiasm alone.
6. Relationship to Readiness and Solutions.
7. CTA and proof.

Design notes:

- Should feel active, peer-led and practical.
- Visual language: workshop table, foundry floor, operational map, not classroom.

## Page Blueprint: `/programmes/leadership-ai-coaching/`

Page name: Senior Leadership AI Coaching

Primary job:

- Create a discreet route for senior leaders who need private clarity, technical translation and decision support.

Target visitors:

- CEOs, MDs, founders, board members and senior leaders who feel the pace of AI is outstripping their available attention.

Hero promise:

- Private AI and technology support for senior leaders who need clarity before they make decisions.

Primary CTA:

- Arrange a confidential conversation.

Secondary CTA:

- Explore AI Adoption Readiness.

Core sections:

1. The leadership problem.
   - The volume of AI change is too high for leaders to process alone.
   - The risk is not ignorance; it is making decisions without a reliable map.
2. What coaching covers.
   - AI and technology translation.
   - Strategy and planning.
   - Vendor/tool review.
   - Risk and governance questions.
   - Practical hands-on support where useful.
3. Situations where this helps.
   - Private sounding board before a board meeting.
   - Evaluating AI proposals.
   - Understanding agent risk.
   - Building personal confidence with tools.
   - Supporting a leadership team through a decision.
4. How it works.
   - Discreet one-to-one sessions.
   - Flexible cadence.
   - Clear actions after each session.
   - Can sit alongside Readiness, Foundry or delivery.
5. Boundaries.
   - Not generic training.
   - Not a replacement for legal/compliance advice.
   - Focused on practical leadership clarity.
6. CTA.

Design notes:

- Calm, confidential and premium.
- Do not over-design this page. The premium signal is restraint.

## Page Blueprint: `/solutions/`

Page name: Solutions

Primary job:

- Show the practical business problems DTP solves and route visitors to the right conversation.

Target visitors:

- Operational leaders, technical leaders, AI sponsors and transformation owners.

Hero promise:

- AI and digital systems built around the work your organisation actually needs to improve.

Primary CTA:

- Talk through a business problem.

Secondary CTA:

- See the delivery process.

Core sections:

1. Solution positioning.
   - DTP does not sell isolated AI tools. It designs and builds useful systems around workflow, data, people and governance.
2. Solution areas.
   - Business Systems Strategy.
   - Data and Reporting.
   - Operations Automation.
   - AI Agents.
   - Bespoke AI Systems.
3. Problem-to-solution cards.
   - For each area: problem signal, DTP response, typical output, proof link.
4. AI Agents spotlight.
   - Keep governance and control visible.
5. Related case studies.
6. CTA.

Design notes:

- Operational and scannable.
- Strongly avoid one-note AI visuals. Use systems, workflows, dashboards, message flows and proof.

## Page Blueprint: `/process/`

Page name: How We Work

Primary job:

- Reduce perceived delivery risk.

Target visitors:

- Buyers who are interested but need to understand how DTP avoids open-ended consultancy or risky builds.

Hero promise:

- A stage-gated path from idea to useful system.

Primary CTA:

- Discuss the right first step.

Secondary CTA:

- Explore case studies.

Core sections:

1. Delivery principle.
   - Small enough to validate, structured enough to scale.
2. Stages.
   - Discovery.
   - Proof of Concept.
   - MVP.
   - Pilot.
   - Launch.
3. Decision gates.
   - What the client learns and decides at each stage.
4. What DTP needs from the client.
   - Owner, access, constraints, data/process knowledge and decision-maker availability.
5. How risk is controlled.
   - Scope discipline, security thinking, feedback loops and adoption planning.
6. CTA.

Design notes:

- Use a horizontal timeline or stepped operating model.
- Place FAQ and proof beside the highest-anxiety points.

## Page Blueprint: `/case-studies/`

Page name: Client Outcomes

Primary job:

- Prove that DTP delivers practical, real-world outcomes.

Target visitors:

- Sceptical leaders, procurement stakeholders, technical validators and buyers near conversion.

Hero promise:

- Practical digital and AI outcomes across operational, technical and business contexts.

Primary CTA:

- Discuss a similar challenge.

Secondary CTA:

- Explore solutions.

Core sections:

1. Outcome-led intro.
   - Emphasise measurable work, not generic innovation.
2. Case-study cards.
   - Surface area calculation automation.
   - Manufacturing maintenance via messaging.
   - AI/ML technical partner for infrastructure analytics.
   - Other existing case study assets.
3. Filter by outcome type.
   - Time saved.
   - Operational visibility.
   - Automation.
   - AI/ML.
   - Bespoke systems.
4. Testimonials.
5. CTA.

Design notes:

- Phase one keeps one page. Cards should still feel substantial.
- Pull proof into other pages rather than making visitors hunt for it.

## Page Blueprint: `/insights/`

Page name: Insights

Primary job:

- Build authority and provide useful guidance for AI adoption, governance and practical implementation.

Target visitors:

- Leaders researching AI adoption, CTOs, operations leaders and existing contacts.

Hero promise:

- Practical thinking on AI adoption, agents, automation and business systems.

Primary CTA:

- Read the latest insight.

Secondary CTA:

- Start a conversation.

Core sections:

1. Featured insight.
2. Topic groups.
   - Adoption and governance.
   - AI agents.
   - Operations and automation.
   - CTO and leadership guidance.
   - DTP news where relevant.
3. Newsletter or follow prompt if desired.
4. Related programme links.
5. CTA.

Design notes:

- Rename the user-facing area to Insights.
- Keep `/news/` technically available until redirects and content paths are planned.

## Page Blueprint: `/faq/`

Page name: Questions

Primary job:

- Remove buying friction.

Target visitors:

- Buyers close to enquiry, compliance stakeholders and people trying to understand effort, risk and cost.

Hero promise:

- Clear answers before the first conversation.

Primary CTA:

- Ask a specific question.

Secondary CTA:

- Book a discovery call.

Core sections:

1. Getting started.
2. AI Adoption Readiness.
3. AI Foundry.
4. Leadership Coaching.
5. Security and governance.
6. Timelines and pricing model.
7. Delivery process.
8. Support and optimisation.

Design notes:

- FAQ is not in the primary header but must be easy to reach from programme pages, contact and footer.
- Use accordions with visible focus states and deep links where possible.

## Page Blueprint: `/contact/`

Page name: Start a Conversation

Primary job:

- Convert interest into the right kind of enquiry.

Target visitors:

- Anyone ready to talk, including senior leaders who need discretion.

Hero promise:

- Tell us what you are trying to understand, assess or build.

Primary CTA:

- Book a discovery call.

Secondary CTA:

- Email DTP.

Core sections:

1. Intent selector.
   - AI Adoption Readiness.
   - AI Foundry.
   - Leadership Coaching.
   - Solution delivery.
   - General conversation.
2. Contact methods.
   - Booking.
   - Email.
   - WhatsApp if still desired.
   - Location.
3. What happens next.
   - Short reassurance: initial conversation, no hard sell, identify best next step.
4. Proof or trust strip.
5. Thank-you state.

Design notes:

- Forms are high-friction. Keep the form short and intent-led.
- The confirmation state should be designed, not treated as an afterthought.

## Stage 4 Build Direction

Recommended implementation sequence:

1. Add route scaffolds for new IA:
   - `/why-dtp/`
   - `/programmes/`
   - `/programmes/ai-adoption-readiness/`
   - `/programmes/ai-foundry/`
   - `/programmes/leadership-ai-coaching/`
   - `/solutions/`
   - `/process/`
   - `/insights/`
2. Keep current pages working while the new routes are built.
3. Add `/ecosystem/` as a temporary alias or prototype route only if needed for review.
4. Create redirects or compatibility routes later:
   - `/services/` -> `/process/` or `/solutions/`, depending on final content split.
   - `/news/` -> `/insights/` once content migration is complete.
   - `/about/` -> `/why-dtp/` once the new Why DTP page is live.
5. Build shared components before full pages:
   - Programme cards.
   - Solution cards.
   - Proof strips.
   - FAQ blocks.
   - Intent-led contact CTA.

## Stage 5 Release Priorities

Phase one should ship when these are true:

- The homepage hub is fast, accessible and has a static fallback.
- The primary header has six or fewer visible items.
- AI Adoption Readiness has a strong, complete sales page.
- AI Foundry and Leadership Coaching are credible enough to receive enquiries.
- Solutions explains practical business problems without generic AI hype.
- Case Studies carries proof into the conversion path.
- Contact captures intent and explains what happens next.
- Reduced motion, keyboard navigation and mobile layout have been tested.
