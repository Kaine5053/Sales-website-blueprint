/* ============================================================================
   PRODUCTS — your catalogue.
   ----------------------------------------------------------------------------
   Add, edit or remove products here. The grid, filters, search, product detail
   and the "Help me choose" finder all read from this one array.

   Each product's `attrs` object is what the questionnaire scores against.
   The keys (e.g. useCase, budget, experience) must match the `attr` of each
   question option in questionnaire.js. Values are arrays of tags the product
   satisfies — a product matches a chosen option when they share a tag.

   Optional commerce fields (all safe to omit):
     • compareAtPrice — original/RRP; if higher than `price`, a strike-through
       and a "Save X%" badge are shown automatically.
     • stock — 'in' (default) | 'low' | 'out'. Drives the stock badge and, when
       'out', swaps the CTA to "Notify me".
   ============================================================================ */

window.PRODUCTS = [
  {
    id: 'aurora-core',
    name: 'Aurora Core',
    category: 'Essentials',
    tagline: 'The dependable all-rounder',
    description: 'A balanced, no-fuss option that covers the fundamentals brilliantly. Ideal for first-time buyers and everyday use.',
    price: 199,
    compareAtPrice: 249,
    stock: 'in',
    priceUnit: 'one-off',
    image: 'assets/img/product-1.svg',
    badges: [{ text: 'Best seller', type: 'solid' }],
    rating: 4.8,
    reviews: 1280,
    features: [
      'Set up in minutes, no expertise required',
      'Covers all everyday essentials',
      '1-year standard warranty included',
      'Free tracked delivery',
    ],
    specs: { 'Best for': 'Everyday use', 'Setup': 'Plug & play', 'Warranty': '1 year', 'Support': 'Standard' },
    attrs: { useCase: ['personal', 'small'], budget: ['low', 'mid'], experience: ['beginner'], priority: ['ease', 'value'] },
  },
  {
    id: 'aurora-pro',
    name: 'Aurora Pro',
    category: 'Professional',
    tagline: 'Power for growing teams',
    description: 'Steps up performance and capacity for professionals and teams who need more headroom, with priority support baked in.',
    price: 449,
    priceUnit: 'one-off',
    image: 'assets/img/product-2.svg',
    badges: [{ text: 'Popular', type: '' }],
    rating: 4.9,
    reviews: 864,
    features: [
      'Up to 3× the capacity of Core',
      'Priority support & onboarding',
      'Extended 2-year warranty',
      'Advanced controls & reporting',
    ],
    specs: { 'Best for': 'Growing teams', 'Setup': 'Guided', 'Warranty': '2 years', 'Support': 'Priority' },
    attrs: { useCase: ['small', 'medium'], budget: ['mid', 'high'], experience: ['intermediate'], priority: ['performance', 'support'] },
  },
  {
    id: 'aurora-max',
    name: 'Aurora Max',
    category: 'Enterprise',
    tagline: 'Maximum performance, no compromise',
    description: 'Our flagship. Built for demanding, high-volume environments where reliability and scale are non-negotiable.',
    price: 1199,
    priceUnit: 'one-off',
    image: 'assets/img/product-3.svg',
    badges: [{ text: 'Flagship', type: 'solid' }],
    rating: 4.9,
    reviews: 412,
    features: [
      'Top-tier performance & scalability',
      'Dedicated account manager',
      'Premium 3-year warranty',
      'Custom integrations available',
    ],
    specs: { 'Best for': 'Enterprise', 'Setup': 'White-glove', 'Warranty': '3 years', 'Support': 'Dedicated' },
    attrs: { useCase: ['medium', 'large'], budget: ['high', 'premium'], experience: ['intermediate', 'expert'], priority: ['performance', 'support'] },
  },
  {
    id: 'nimbus-lite',
    name: 'Nimbus Lite',
    category: 'Essentials',
    tagline: 'Budget-friendly starter',
    description: 'The most affordable way to get started. Lean, simple and reliable for light, occasional use.',
    price: 89,
    stock: 'low',
    priceUnit: 'one-off',
    image: 'assets/img/product-4.svg',
    badges: [{ text: 'Great value', type: '' }],
    rating: 4.6,
    reviews: 2105,
    features: [
      'Lowest entry price',
      'Lightweight and simple',
      'Perfect for occasional use',
      'Free delivery',
    ],
    specs: { 'Best for': 'Light use', 'Setup': 'Plug & play', 'Warranty': '1 year', 'Support': 'Standard' },
    attrs: { useCase: ['personal'], budget: ['low'], experience: ['beginner'], priority: ['value', 'ease'] },
  },
  {
    id: 'nimbus-flex',
    name: 'Nimbus Flex',
    category: 'Professional',
    tagline: 'Adapts to how you work',
    description: 'A modular, flexible option that grows with you. Configure it to your exact needs and expand later.',
    price: 329,
    compareAtPrice: 399,
    stock: 'in',
    priceUnit: 'one-off',
    image: 'assets/img/product-5.svg',
    badges: [{ text: 'Customisable', type: '' }],
    rating: 4.7,
    reviews: 558,
    features: [
      'Fully modular & expandable',
      'Mix and match components',
      'Pay only for what you need',
      '2-year warranty',
    ],
    specs: { 'Best for': 'Flexible needs', 'Setup': 'Configurable', 'Warranty': '2 years', 'Support': 'Priority' },
    attrs: { useCase: ['personal', 'small'], budget: ['mid'], experience: ['intermediate', 'expert'], priority: ['flexibility', 'value'] },
  },
  {
    id: 'titan-x',
    name: 'Titan X',
    category: 'Enterprise',
    tagline: 'Industrial-grade reliability',
    description: 'Engineered for the toughest, mission-critical workloads with redundancy and round-the-clock support.',
    price: 2499,
    stock: 'low',
    priceUnit: 'one-off',
    image: 'assets/img/product-6.svg',
    badges: [{ text: 'Heavy duty', type: 'solid' }],
    rating: 5.0,
    reviews: 187,
    features: [
      'Built for mission-critical use',
      'Redundancy & failover built in',
      '24/7 dedicated support line',
      'Premium 5-year warranty',
    ],
    specs: { 'Best for': 'Mission-critical', 'Setup': 'White-glove', 'Warranty': '5 years', 'Support': 'Dedicated 24/7' },
    attrs: { useCase: ['medium', 'large'], budget: ['premium'], experience: ['expert'], priority: ['performance', 'support'] },
  },
];
