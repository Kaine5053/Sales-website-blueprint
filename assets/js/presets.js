/* ============================================================================
   THEME PRESETS — instant industry re-skins.
   ----------------------------------------------------------------------------
   Each preset is just a bag of CSS-variable overrides applied to <html>. They
   demonstrate how far the same blueprint stretches across industries by
   changing only design tokens — no markup or logic changes.

   This powers the floating "Theme" switcher (bottom-right). In production you'd
   typically pick ONE preset, paste its values into theme.css as the defaults,
   and remove the switcher. It's a showcase + starting point, not a toy.

   Add your own: copy a block, change the values, give it an id/name. The
   `vars` keys are the same tokens documented in theme.css.
   ============================================================================ */

window.THEME_PRESETS = [
  {
    id: 'default',
    name: 'SaaS / Tech',
    desc: 'Confident indigo, soft corners — the modern software look.',
    swatch: ['#3b5bff', '#8b5cf6'],
    vars: {}, /* empty = use theme.css defaults */
  },
  {
    id: 'industrial',
    name: 'Industrial',
    desc: 'Sharp, utilitarian, high-contrast. For tools, plant & machinery.',
    swatch: ['#f97316', '#1e293b'],
    vars: {
      '--brand-h': '24', '--brand-s': '95%', '--brand-l': '50%',
      '--accent-h': '210',
      '--radius-base': '4px',
      '--font-display': "'Arial Black', 'Helvetica Neue', sans-serif",
      '--tracking-tight': '-0.01em',
      '--shadow-brand': '0 8px 20px rgba(249,115,22,0.28)',
    },
  },
  {
    id: 'luxury',
    name: 'Luxury / Premium',
    desc: 'Editorial serif, gold accent, minimal radius. For high-end goods.',
    swatch: ['#b8924f', '#1a1a1a'],
    vars: {
      '--brand-h': '38', '--brand-s': '42%', '--brand-l': '47%',
      '--accent-h': '30',
      '--radius-base': '2px',
      '--font-display': "Georgia, 'Times New Roman', serif",
      '--fw-extrabold': '700',
      '--tracking-tight': '0em',
      '--shadow-brand': '0 10px 30px rgba(184,146,79,0.25)',
    },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    desc: 'Calm teal-blue, rounded and reassuring. For medical & wellbeing.',
    swatch: ['#0ea5a5', '#0284c7'],
    vars: {
      '--brand-h': '184', '--brand-s': '72%', '--brand-l': '38%',
      '--accent-h': '199',
      '--radius-base': '18px',
      '--shadow-brand': '0 10px 30px rgba(14,165,165,0.25)',
    },
  },
  {
    id: 'eco',
    name: 'Eco / Sustainable',
    desc: 'Natural green, friendly and organic. For green & outdoor brands.',
    swatch: ['#16a34a', '#65a30d'],
    vars: {
      '--brand-h': '142', '--brand-s': '64%', '--brand-l': '40%',
      '--accent-h': '84',
      '--radius-base': '16px',
      '--shadow-brand': '0 10px 30px rgba(22,163,74,0.25)',
    },
  },
  {
    id: 'finance',
    name: 'Finance / Trust',
    desc: 'Deep navy, crisp and dependable. For finance, legal & B2B.',
    swatch: ['#1e40af', '#0f766e'],
    vars: {
      '--brand-h': '224', '--brand-s': '72%', '--brand-l': '42%',
      '--accent-h': '174',
      '--radius-base': '8px',
      '--shadow-brand': '0 10px 30px rgba(30,64,175,0.22)',
    },
  },
  {
    id: 'bold',
    name: 'Bold / Consumer',
    desc: 'Hot pink energy, playful and loud. For lifestyle & D2C.',
    swatch: ['#ec4899', '#f59e0b'],
    vars: {
      '--brand-h': '330', '--brand-s': '85%', '--brand-l': '55%',
      '--accent-h': '38',
      '--radius-base': '20px',
      '--shadow-brand': '0 10px 30px rgba(236,72,153,0.30)',
    },
  },
];
