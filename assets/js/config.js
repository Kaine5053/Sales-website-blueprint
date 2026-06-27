/* ============================================================================
   SITE CONFIG — edit this file to rebrand the blueprint.
   ----------------------------------------------------------------------------
   Nothing here is industry-specific by accident. Change the strings, swap the
   nav, drop in your contact details, and the whole site updates. For colours
   and fonts, see assets/css/theme.css.
   ============================================================================ */

window.SITE_CONFIG = {
  /* ---- Currency & locale (used everywhere prices are shown) ----
     Change these three to re-currency the whole site. `locale` controls
     thousands separators; `code` is the ISO code used in SEO/structured data. */
  currency: { symbol: '£', code: 'GBP', locale: 'en-GB' },

  /* ---- Brand identity ---- */
  brand: {
    name: 'Northwind',
    tagline: 'Solutions that move your business forward',
    /* Inline SVG logo mark (kept as a string so it inherits currentColor). */
    logoSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l6-9 6 9-6 9z" opacity=".9"/><path d="M15 3l6 9-6 9"/></svg>',
  },

  /* ---- Top announcement bar (set show:false to hide) ---- */
  announcement: {
    show: true,
    text: 'New for 2026 — our most advanced lineup yet.',
    linkText: 'See what’s new',
    linkHref: '#products',
  },

  /* ---- Primary navigation ---- */
  nav: [
    { label: 'Products', href: '#products', hasMega: true },
    { label: 'Why us', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ],

  /* Header call-to-action button */
  headerCta: { label: 'Get a quote', href: '#contact' },

  /* ---- Hero section ---- */
  hero: {
    badge: 'Trusted by 4,000+ teams',
    headlinePre: 'The smarter way to choose',
    headlineHighlight: 'the right product',
    sub: 'Browse our full range, compare with confidence, and let our guided finder match you to the perfect fit in under a minute — no expertise required.',
    primaryCta: { label: 'Browse products', href: '#products' },
    secondaryCta: { label: 'Help me choose', action: 'open-quiz' },
    image: 'assets/img/hero.svg',
    floatingTop: { icon: 'star', text: '4.9/5 average rating' },
    floatingBottom: { icon: 'check', text: '30-day money-back guarantee' },
    proofAvatars: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'],
    proofText: 'Join thousands who found their match',
  },

  /* ---- Trust logos (text-based placeholders; swap for <img> if you have them) ---- */
  trustLogos: ['ACME', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Hooli'],

  /* ---- Stats band ---- */
  stats: [
    { num: '4,000+', label: 'Happy customers' },
    { num: '50+',    label: 'Products in range' },
    { num: '4.9★',   label: 'Average review score' },
    { num: '24/7',   label: 'Expert support' },
  ],

  /* ---- "Why us" feature cards ---- */
  features: [
    { icon: 'shield', title: 'Quality guaranteed', text: 'Every product is rigorously tested and backed by our industry-leading warranty.' },
    { icon: 'bolt', title: 'Fast delivery', text: 'Free, tracked shipping on all orders with most items dispatched same-day.' },
    { icon: 'compass', title: 'Expert guidance', text: 'Not sure what you need? Our guided finder and specialists are here to help.' },
    { icon: 'refresh', title: 'Easy returns', text: 'Changed your mind? Enjoy a no-questions-asked 30-day return policy.' },
    { icon: 'headset', title: '24/7 support', text: 'Real humans, ready to help by chat, phone or email whenever you need us.' },
    { icon: 'tag', title: 'Fair pricing', text: 'Transparent, competitive pricing with price-match on every product we stock.' },
  ],

  /* ---- Pricing / service tiers ---- */
  pricing: {
    enabled: true,
    note: 'No hidden fees. Cancel anytime.',
    plans: [
      {
        name: 'Starter', price: '£0', period: '/mo', featured: false,
        blurb: 'Everything you need to get going.',
        features: ['Access to core range', 'Standard delivery', 'Email support', '30-day returns'],
        cta: { label: 'Get started', href: '#contact' },
      },
      {
        name: 'Professional', price: '£49', period: '/mo', featured: true,
        blurb: 'For growing teams that need more.',
        features: ['Everything in Starter', 'Priority delivery', 'Dedicated account manager', 'Extended 2-year warranty', 'Volume discounts'],
        cta: { label: 'Start free trial', href: '#contact' },
      },
      {
        name: 'Enterprise', price: 'Custom', period: '', featured: false,
        blurb: 'Tailored to your organisation.',
        features: ['Everything in Professional', 'Custom integrations', 'SLA & onboarding', 'Bespoke pricing'],
        cta: { label: 'Contact sales', href: '#contact' },
      },
    ],
  },

  /* ---- Testimonials ---- */
  testimonials: [
    { quote: 'The guided finder pointed us to exactly the right product in minutes. Saved us hours of research.', name: 'Sarah Chen', role: 'Operations Lead, ACME', rating: 5, color: '#6366f1' },
    { quote: 'Outstanding quality and the support team genuinely cares. Best buying experience we’ve had.', name: 'Marcus Webb', role: 'Founder, Globex', rating: 5, color: '#ec4899' },
    { quote: 'Clear pricing, fast delivery, no surprises. We’ve since rolled it out across all departments.', name: 'Priya Nair', role: 'Procurement, Initech', rating: 5, color: '#14b8a6' },
  ],

  /* ---- FAQ ---- */
  faq: [
    { q: 'How do I know which product is right for me?', a: 'Use our “Help me choose” finder — answer a few quick questions and we’ll recommend the best matches for your needs. You can also chat with our specialists any time.' },
    { q: 'What is your return policy?', a: 'Every order is covered by a 30-day, no-questions-asked return policy. If you’re not happy, send it back for a full refund.' },
    { q: 'Do you offer warranties?', a: 'Yes. All products include a standard warranty, with extended cover available on Professional and Enterprise plans.' },
    { q: 'How fast is delivery?', a: 'We offer free tracked shipping on all orders, with most items dispatched the same day and delivered within 2–3 working days.' },
    { q: 'Can I get a custom quote for bulk orders?', a: 'Absolutely. Head to the contact section or hit “Get a quote” and our team will put together tailored pricing for your volume.' },
  ],

  /* ---- Resources / blog (set posts:[] to hide the whole section) ---- */
  resources: {
    eyebrow: 'Resources',
    title: 'Guides & insights',
    lead: 'Practical advice to help you choose well and get the most from your purchase.',
    posts: [
      {
        category: 'Buying guide', title: 'How to choose the right product for your needs', excerpt: 'A simple framework for weighing up budget, scale and features — without the jargon.', readTime: '6 min read', icon: 'compass', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        author: 'The Northwind team', date: 'June 2026',
        body: [
          { h: 'Start with the outcome, not the spec sheet' },
          { p: 'The most common mistake is shopping by features. Instead, write down the result you want — “equip a team of ten” or “handle peak-season demand” — and work backwards. The right product is the cheapest one that comfortably delivers that outcome with a little headroom to grow.' },
          { h: 'Three questions that settle most decisions' },
          { p: 'Who is it for (just you, a small team, or a whole organisation)? What’s your realistic budget range? And how hands-on do you want to be — plug-and-play, or full control? Answer those honestly and the shortlist usually narrows to two or three options.' },
          { p: 'Not sure? Our guided finder asks exactly these questions and recommends the best-matched products in under a minute — with a clear explanation of why each one fits.' },
          { h: 'Leave room to grow' },
          { p: 'Buying slightly above today’s needs is almost always cheaper than upgrading in six months. Check the next tier up: if it’s a modest step in price for a meaningful step in capacity or support, it’s often the smarter buy.' },
        ],
      },
      {
        category: 'Comparison', title: 'Essentials vs Professional vs Enterprise', excerpt: 'Which tier is right for you? We break down the real-world differences side by side.', readTime: '8 min read', icon: 'scale', color: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
        author: 'The Northwind team', date: 'June 2026',
        body: [
          { h: 'Essentials — for getting started' },
          { p: 'Essentials covers the fundamentals brilliantly for individuals and light use. If you want something dependable that works out of the box without ongoing management, start here.' },
          { h: 'Professional — for growing teams' },
          { p: 'Professional adds capacity, priority support and advanced controls. It’s the sweet spot for businesses that have outgrown the basics and need reliability they can lean on.' },
          { h: 'Enterprise — for scale and assurance' },
          { p: 'Enterprise is built for demanding, mission-critical environments: dedicated support, the longest warranties, and custom integrations. Choose it when downtime is expensive and scale is non-negotiable.' },
          { p: 'Still weighing it up? Use the comparison tool to put any products side by side — it highlights the lowest price and top-rated options automatically.' },
        ],
      },
      {
        category: 'Tips', title: '5 mistakes to avoid when buying', excerpt: 'Save time and money by sidestepping the most common pitfalls our customers report.', readTime: '4 min read', icon: 'bolt', color: 'linear-gradient(135deg,#14b8a6,#0d9488)',
        author: 'The Northwind team', date: 'June 2026',
        body: [
          { h: '1. Buying on price alone' },
          { p: 'The cheapest option can cost more over time if it doesn’t fit. Weigh value, not just sticker price.' },
          { h: '2. Ignoring support' },
          { p: 'When something goes wrong, support is what you’re really paying for. Check response times and channels before you buy.' },
          { h: '3. Under-sizing for growth' },
          { p: 'Plan for where you’ll be in a year, not just today. A little headroom now beats a disruptive upgrade later.' },
          { h: '4. Skipping the warranty terms' },
          { p: 'Know what’s covered and for how long. Extended cover is often worth it on higher-value purchases.' },
          { h: '5. Going it alone when unsure' },
          { p: 'If you’re not certain, ask. Our finder and specialists exist precisely to take the guesswork out of the decision.' },
        ],
      },
    ],
  },

  /* ---- Final CTA band ---- */
  ctaBand: {
    title: 'Ready to find your perfect product?',
    text: 'Take the guided finder or talk to a specialist today. No pressure, no jargon — just the right advice.',
    primaryCta: { label: 'Help me choose', action: 'open-quiz' },
    secondaryCta: { label: 'Talk to us', href: '#contact' },
  },

  /* ---- Cookie consent (set show:false to disable the banner) ---- */
  cookies: {
    show: true,
    message: 'We use cookies to improve your experience and analyse traffic. You can accept or decline non-essential cookies.',
    acceptLabel: 'Accept all',
    declineLabel: 'Decline',
    policyLabel: 'Cookie policy',
    policyHref: '#',
  },

  /* ---- Analytics (loads ONLY after cookie consent). Leave id blank to keep
     it as a no-op stub you can wire to GA4, Plausible, Fathom, etc. ---- */
  analytics: {
    provider: 'stub',   /* 'stub' | 'ga4' | 'plausible' */
    id: '',             /* e.g. 'G-XXXXXXX' for GA4 */
  },

  /* ---- Contact details ---- */
  contact: {
    heading: 'Let’s talk',
    sub: 'Questions, quotes, or a custom requirement? We usually reply within a few hours.',
    email: 'hello@northwind.example',
    phone: '+44 20 7946 0000',
    address: '1 Commerce Street, London, EC1A 1AA',
  },

  /* ---- Footer ---- */
  footer: {
    about: 'Northwind helps businesses choose, buy and deploy the right products with confidence. A blueprint you can make your own.',
    newsletter: {
      enabled: true,
      title: 'Get product news & offers',
      placeholder: 'you@company.com',
      cta: 'Subscribe',
      note: 'No spam. Unsubscribe anytime.',
    },
    columns: [
      { title: 'Product', links: [ { label: 'All products', href: '#products' }, { label: 'Pricing', href: '#pricing' }, { label: 'What’s new', href: '#products' }, { label: 'Guided finder', href: '#', action: 'open-quiz' } ] },
      { title: 'Company', links: [ { label: 'About us', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#contact' } ] },
      { title: 'Support', links: [ { label: 'Help centre', href: '#faq' }, { label: 'Shipping', href: '#' }, { label: 'Returns', href: '#' }, { label: 'Warranty', href: '#' } ] },
    ],
    socials: ['twitter', 'linkedin', 'facebook', 'instagram'],
    legalLinks: [ { label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Cookies', href: '#' } ],
  },
};
