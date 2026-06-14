const bookingUrl =
  'https://outlook.office.com/bookwithme/user/f0762b9af6a94ed2add9818a4f3ca4e5@digitaltechnologypartner.ai/meetingtype/qc2lOXjEdkO6GkMS_jZJrQ2?anonymous';

export type PhantomSection = {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
};

export type PhantomPage = {
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  primaryCta: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  signal: string;
  outcomes: string[];
  sections: PhantomSection[];
  proof: string[];
  related: {
    label: string;
    href: string;
    note: string;
  }[];
};

export const phantomPages = {
  whyDtp: {
    title: 'Why DTP',
    description:
      'Why Digital Technology Partner is a practical, low-risk partner for AI adoption, business automation and digital systems delivery.',
    eyebrow: '// command_centre',
    heroTitle: 'Practical AI and digital systems, delivered with control.',
    heroText:
      'DTP helps leaders move from AI noise to governed, useful implementation. We work in clear stages, protect delivery confidence and keep business outcomes at the centre.',
    primaryCta: { label: 'Talk through your situation', href: bookingUrl, external: true },
    secondaryCta: { label: 'Start with readiness', href: '/programmes/ai-adoption-readiness/' },
    signal: 'Trust, security and delivery confidence',
    outcomes: ['Reduced project risk', 'Clear decision gates', 'Governance-aware delivery'],
    sections: [
      {
        eyebrow: '01',
        title: 'Why organisations choose DTP',
        body:
          'DTP is for organisations that need practical progress, not another abstract AI strategy. We connect business workflow, systems, people and governance so AI becomes useful inside real operations.',
        bullets: ['Outcome-led delivery', 'Works with existing tools', 'Business-first technical translation'],
      },
      {
        eyebrow: '02',
        title: 'How risk is reduced',
        body:
          'Work moves through Discovery, Proof of Concept, MVP, Pilot and Launch. Each stage gives leadership evidence before the next commitment.',
        bullets: ['Smaller first steps', 'Visible progress early', 'Decision points before scale'],
      },
      {
        eyebrow: '03',
        title: 'Governance and security confidence',
        body:
          'AI adoption needs practical controls around data, permissions, deployment patterns and human oversight. Those questions are treated as design inputs, not late blockers.',
        bullets: ['GDPR and PII awareness', 'Tenant-aware architecture thinking', 'Human-in-the-loop control'],
      },
    ],
    proof: ['Client work across operations, manufacturing and technical systems.', 'Testimonials carried into buying pages near the point of doubt.'],
    related: [
      { label: 'AI Adoption Readiness', href: '/programmes/ai-adoption-readiness/', note: 'Assess the current state first.' },
      { label: 'How We Work', href: '/process/', note: 'See the stage-gated delivery path.' },
      { label: 'Client Outcomes', href: '/case-studies/', note: 'Review proof before committing.' },
    ],
  },
  programmes: {
    title: 'Programmes',
    description:
      'Structured DTP programmes for AI readiness, practical AI working groups and discreet senior leadership coaching.',
    eyebrow: '// programmes',
    heroTitle: 'Structured ways to assess, focus and lead AI adoption.',
    heroText:
      'Use DTP programmes when you need clarity before delivery, confidence inside the team or private senior support around AI and technology decisions.',
    primaryCta: { label: 'Compare the programmes', href: '#programme-pathway' },
    secondaryCta: { label: 'Book a discovery call', href: '/contact/' },
    signal: 'Assess, build confidence, decide, deliver',
    outcomes: ['A clearer starting point', 'Evidence-led opportunity discovery', 'Senior confidence and support'],
    sections: [
      {
        eyebrow: 'assess',
        title: 'AI Adoption Readiness',
        body:
          'A one-week assessment showing what is already happening with AI, where risk sits and what leadership should do next.',
        bullets: ['Snapshot', 'Diagnostic', 'Advisory'],
      },
      {
        eyebrow: 'build',
        title: 'AI Foundry',
        body:
          'A practical working group programme that helps teams explore useful AI opportunities through real work, not passive training.',
        bullets: ['Working sessions', 'Opportunity backlog', 'Leadership evidence'],
      },
      {
        eyebrow: 'lead',
        title: 'Senior Leadership AI Coaching',
        body:
          'Discreet one-to-one support for senior leaders who need a trusted technical sounding board and practical AI translation.',
        bullets: ['Private coaching', 'Strategy support', 'Vendor and tool clarity'],
      },
    ],
    proof: ['Programme pages should place proof and reassurance close to each CTA.', 'Readiness is the strongest first commercial offer for uncertain buyers.'],
    related: [
      { label: 'Readiness', href: '/programmes/ai-adoption-readiness/', note: 'Best first step for uncertainty.' },
      { label: 'Foundry', href: '/programmes/ai-foundry/', note: 'Best for practical team confidence.' },
      { label: 'Leadership Coaching', href: '/programmes/leadership-ai-coaching/', note: 'Best for private senior support.' },
    ],
  },
  readiness: {
    title: 'AI Adoption Readiness',
    description:
      'A one-week AI readiness assessment showing what is happening, where risk sits and what leadership should do next.',
    eyebrow: '// adoption_radar',
    heroTitle: 'Find out what is really happening with AI in your organisation.',
    heroText:
      'AI Adoption Readiness gives leadership a one-week view of current activity, adoption risk, missed value and the next practical decision.',
    primaryCta: { label: 'Book a readiness call', href: bookingUrl, external: true },
    secondaryCta: { label: 'Compare the levels', href: '#programme-pathway' },
    signal: 'One week to clarity',
    outcomes: ['Current-state map', 'Risk and opportunity summary', 'Recommended next action'],
    sections: [
      {
        eyebrow: 'problem',
        title: 'Most teams do not need another AI talk',
        body:
          'They need to know what is already happening, what is useful, what is risky and which initiative deserves ownership first.',
        bullets: ['Licence spend without behaviour change', 'Compliance uncertainty', 'Experimentation without ownership'],
      },
      {
        eyebrow: 'levels',
        title: 'Snapshot, Diagnostic and Advisory',
        body:
          'Keep the three options on one parent page for phase one. This makes the offer easier to understand and avoids sending buyers into thin child pages too early.',
        bullets: ['Snapshot: fast self-reporting baseline', 'Diagnostic: structured answers plus listening sessions', 'Advisory: DTP interpretation and leadership discussion'],
      },
      {
        eyebrow: 'flow',
        title: 'The one-week flow',
        body:
          'Scope the assessment, gather input, listen to key stakeholders, map risk and opportunity, then give leadership a practical readout.',
        bullets: ['Day 1: scope', 'Days 2-3: input gathering', 'Day 5: leadership readout'],
      },
    ],
    proof: ['This page should become the strongest conversion path for uncertain buyers.', 'Use proof from organisations that moved from uncertainty to a narrow, owned first step.'],
    related: [
      { label: 'AI Foundry', href: '/programmes/ai-foundry/', note: 'Continue into team opportunity discovery.' },
      { label: 'Solutions', href: '/solutions/', note: 'Move into delivery when a use case is ready.' },
      { label: 'Questions', href: '/faq/', note: 'Handle risk, timing and pricing concerns.' },
    ],
  },
  foundry: {
    title: 'AI Foundry',
    description:
      'A practical working group programme for evidence-led AI opportunity discovery inside the business.',
    eyebrow: '// foundry_floor',
    heroTitle: 'A practical AI working group, not another passive course.',
    heroText:
      'AI Foundry helps teams build confidence by applying AI to real work, surfacing useful opportunities and giving leadership evidence for the next decision.',
    primaryCta: { label: 'Discuss Foundry membership', href: bookingUrl, external: true },
    secondaryCta: { label: 'Start with readiness', href: '/programmes/ai-adoption-readiness/' },
    signal: 'Club, not course',
    outcomes: ['Opportunity backlog', 'Prioritised experiments', 'Leadership evidence'],
    sections: [
      {
        eyebrow: '01',
        title: 'Learn by working on real problems',
        body:
          'The Foundry should feel like a practical working group. Participants explore workflows, tools, agents and adoption questions through the work the organisation actually does.',
        bullets: ['Working sessions', 'Workflow analysis', 'Use-case exploration'],
      },
      {
        eyebrow: '02',
        title: 'Designed for evidence',
        body:
          'The goal is not enthusiasm alone. Leadership needs to see which opportunities are credible, what adoption would require and where delivery should focus.',
        bullets: ['Prioritised opportunities', 'Adoption observations', 'Candidate roadmap'],
      },
      {
        eyebrow: '03',
        title: 'Connects readiness to delivery',
        body:
          'AI Foundry is a useful next step after Readiness when the organisation needs team confidence and evidence before committing to build.',
      },
    ],
    proof: ['Use practical workshop outputs as proof.', 'Show examples of opportunities becoming delivery candidates.'],
    related: [
      { label: 'AI Adoption Readiness', href: '/programmes/ai-adoption-readiness/', note: 'Assess before convening the group.' },
      { label: 'Solutions', href: '/solutions/', note: 'Turn the best opportunities into systems.' },
      { label: 'Process', href: '/process/', note: 'See how ideas become pilots.' },
    ],
  },
  coaching: {
    title: 'Senior Leadership AI Coaching',
    description:
      'Discreet one-to-one AI and technology coaching for senior leaders who need clarity and decision support.',
    eyebrow: '// leadership_suite',
    heroTitle: 'Private AI and technology support for senior leaders.',
    heroText:
      'A calm, confidential route for leaders who need a trusted technical sounding board, practical translation and clearer decisions around AI.',
    primaryCta: { label: 'Arrange a confidential conversation', href: bookingUrl, external: true },
    secondaryCta: { label: 'Explore readiness first', href: '/programmes/ai-adoption-readiness/' },
    signal: 'Discreet senior support',
    outcomes: ['Clearer decisions', 'Technical translation', 'Private confidence-building'],
    sections: [
      {
        eyebrow: 'pressure',
        title: 'The leadership problem',
        body:
          'The pace of AI change is too high for busy leaders to process alone. The risk is making decisions without a reliable map.',
        bullets: ['Board questions', 'Vendor claims', 'Agent risk', 'Tool confusion'],
      },
      {
        eyebrow: 'support',
        title: 'What coaching covers',
        body:
          'Sessions can cover strategy, planning, tool review, governance questions, practical demonstrations and personal confidence with AI workflows.',
        bullets: ['Strategy and planning', 'Vendor/tool review', 'Practical technical translation'],
      },
      {
        eyebrow: 'boundaries',
        title: 'Clear boundaries',
        body:
          'This is not generic training and not a replacement for legal or compliance advice. It is practical leadership clarity from a trusted technical partner.',
      },
    ],
    proof: ['Use restraint as the premium signal.', 'This page should feel calm, confidential and direct.'],
    related: [
      { label: 'Why DTP', href: '/why-dtp/', note: 'Understand the trust model.' },
      { label: 'AI Agents', href: '/solutions/', note: 'Explore controlled agent adoption.' },
      { label: 'Contact', href: '/contact/', note: 'Start privately.' },
    ],
  },
  solutions: {
    title: 'Solutions',
    description:
      'Practical AI and digital systems for business strategy, data, reporting, automation, AI agents and bespoke systems.',
    eyebrow: '// solution_engine',
    heroTitle: 'Useful AI starts with the work your organisation needs to improve.',
    heroText:
      'DTP designs and builds practical systems around workflow, data, people and governance. The aim is measurable operational value, not isolated tools.',
    primaryCta: { label: 'Talk through a business problem', href: bookingUrl, external: true },
    secondaryCta: { label: 'See the process', href: '/process/' },
    signal: 'Business problems first',
    outcomes: ['Operational visibility', 'Reduced manual effort', 'Controlled AI deployment'],
    sections: [
      {
        eyebrow: 'strategy',
        title: 'Business Systems Strategy',
        body:
          'Map the current estate, define a future-state architecture, identify strategic options and build a phased roadmap.',
      },
      {
        eyebrow: 'operations',
        title: 'Data, reporting and automation',
        body:
          'Bring data together, create actionable reporting and remove routine manual steps from operational workflows.',
        bullets: ['Dashboards and alerts', 'Document processing', 'Task routing'],
      },
      {
        eyebrow: 'agents',
        title: 'AI agents and bespoke systems',
        body:
          'Build controlled agents, copilots and custom AI tools that fit existing operations and governance requirements.',
        bullets: ['Messaging-native agents', 'Operational copilots', 'Production-ready integrations'],
      },
    ],
    proof: ['Surface case studies by outcome type.', 'Keep governance visible on all AI agent messaging.'],
    related: [
      { label: 'Client Outcomes', href: '/case-studies/', note: 'See practical examples.' },
      { label: 'AI Adoption Readiness', href: '/programmes/ai-adoption-readiness/', note: 'Assess before building.' },
      { label: 'How We Work', href: '/process/', note: 'Understand delivery gates.' },
    ],
  },
  process: {
    title: 'How We Work',
    description:
      'The DTP stage-gated delivery process from discovery to proof of concept, MVP, pilot and full launch.',
    eyebrow: '// delivery_path',
    heroTitle: 'A stage-gated path from idea to useful system.',
    heroText:
      'DTP reduces delivery risk by starting small, validating early and giving leadership clear decisions before scale.',
    primaryCta: { label: 'Discuss the right first step', href: bookingUrl, external: true },
    secondaryCta: { label: 'Explore outcomes', href: '/case-studies/' },
    signal: 'Small enough to validate, structured enough to scale',
    outcomes: ['Discovery', 'Proof of Concept', 'MVP', 'Pilot', 'Launch'],
    sections: [
      {
        eyebrow: '01',
        title: 'Discovery',
        body:
          'Understand the problem, users, data, constraints and success measures before committing to a build.',
      },
      {
        eyebrow: '02-03',
        title: 'Proof of Concept and MVP',
        body:
          'Validate the core idea with real context, then build the essential version that users can test in real work.',
      },
      {
        eyebrow: '04-05',
        title: 'Pilot and Launch',
        body:
          'Run in a controlled setting, refine from feedback and then scale with support, monitoring and a roadmap for improvement.',
      },
    ],
    proof: ['Place proof and FAQ beside the highest-anxiety stages.', 'Make decision gates visible, not buried in copy.'],
    related: [
      { label: 'Why DTP', href: '/why-dtp/', note: 'See how risk is reduced.' },
      { label: 'Solutions', href: '/solutions/', note: 'Match a problem to a delivery path.' },
      { label: 'Contact', href: '/contact/', note: 'Discuss the first step.' },
    ],
  },
  insights: {
    title: 'Insights',
    description:
      'Practical DTP thinking on AI adoption, governance, AI agents, automation and leadership decision-making.',
    eyebrow: '// signal_feed',
    heroTitle: 'Practical thinking for leaders deploying AI.',
    heroText:
      'Insights replaces Newsroom as the place for useful AI adoption guidance, market signals and implementation thinking.',
    primaryCta: { label: 'Read the latest insight', href: '/news/' },
    secondaryCta: { label: 'Start a conversation', href: '/contact/' },
    signal: 'Guidance without hype',
    outcomes: ['Adoption and governance', 'AI agents', 'Operations and automation', 'Leadership guidance'],
    sections: [
      {
        eyebrow: 'adoption',
        title: 'Adoption and governance',
        body:
          'Practical guidance on turning AI from scattered experimentation into a controlled organisational capability.',
      },
      {
        eyebrow: 'agents',
        title: 'AI agents',
        body:
          'Thinking on agentic workflows, control planes, ROI visibility and governance for fast-moving teams.',
      },
      {
        eyebrow: 'operations',
        title: 'Operations and automation',
        body:
          'Ideas for improving reporting, reducing manual work and connecting AI to real operational context.',
      },
    ],
    proof: ['Keep existing Newsroom content available while the user-facing area becomes Insights.', 'Group content by buyer questions, not publication mechanics.'],
    related: [
      { label: 'AI Adoption Readiness', href: '/programmes/ai-adoption-readiness/', note: 'Turn insight into a first step.' },
      { label: 'Solutions', href: '/solutions/', note: 'Apply ideas to practical systems.' },
      { label: 'News archive', href: '/news/', note: 'Current content source.' },
    ],
  },
} satisfies Record<string, PhantomPage>;
