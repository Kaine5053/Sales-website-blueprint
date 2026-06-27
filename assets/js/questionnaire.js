/* ============================================================================
   QUESTIONNAIRE — the "Unsure? Help me choose" finder.
   ----------------------------------------------------------------------------
   HOW IT WORKS
   Each question has an `attr` (matching a key in every product's `attrs`) and a
   set of options. When the user picks an option, its `value` is matched against
   the product's tags for that attr. Each match adds the question's `weight` to
   the product's score. The products with the highest scores are recommended.

   To customise: change the questions, options and weights below. Make sure each
   question's `attr` and option `value`s line up with the tags you used in
   products.js. That's the whole contract — no code changes needed.
   ============================================================================ */

window.QUESTIONNAIRE = {
  /* Optional intro shown before the first question */
  intro: {
    title: 'Let’s find your perfect match',
    text: 'Answer a few quick questions — it takes about 30 seconds. We’ll recommend the products that fit you best, and explain why.',
  },

  questions: [
    {
      id: 'useCase',
      attr: 'useCase',
      weight: 3,
      question: 'Who is this mainly for?',
      help: 'This helps us gauge the scale you need.',
      multi: false,
      options: [
        { value: 'personal', label: 'Just me / personal', desc: 'Individual or home use', icon: 'user' },
        { value: 'small',    label: 'A small team', desc: '2–20 people', icon: 'users' },
        { value: 'medium',   label: 'A growing business', desc: '20–200 people', icon: 'building' },
        { value: 'large',    label: 'A large organisation', desc: '200+ people', icon: 'enterprise' },
      ],
    },
    {
      id: 'budget',
      attr: 'budget',
      weight: 2,
      question: 'What’s your budget?',
      help: 'We’ll prioritise options in your range — but still show you the best fit.',
      multi: false,
      options: [
        { value: 'low',     label: 'Keep it lean', desc: 'Under £150', icon: 'piggy' },
        { value: 'mid',     label: 'Mid-range', desc: '£150–£500', icon: 'wallet' },
        { value: 'high',    label: 'Premium', desc: '£500–£1,500', icon: 'gem' },
        { value: 'premium', label: 'Top of the range', desc: '£1,500+', icon: 'crown' },
      ],
    },
    {
      id: 'experience',
      attr: 'experience',
      weight: 1,
      question: 'How experienced are you with products like this?',
      help: 'We’ll factor in how much setup and support you might want.',
      multi: false,
      options: [
        { value: 'beginner',     label: 'Total beginner', desc: 'I want it simple', icon: 'seedling' },
        { value: 'intermediate', label: 'Fairly comfortable', desc: 'I know the basics', icon: 'sprout' },
        { value: 'expert',       label: 'Very experienced', desc: 'Give me full control', icon: 'tree' },
      ],
    },
    {
      id: 'priority',
      attr: 'priority',
      weight: 3,
      question: 'What matters most to you?',
      help: 'Pick all that apply — this strongly shapes our recommendation.',
      multi: true,
      options: [
        { value: 'value',       label: 'Best value', desc: 'Most for my money', icon: 'tag' },
        { value: 'ease',        label: 'Ease of use', desc: 'Simple and quick', icon: 'feather' },
        { value: 'performance', label: 'Performance', desc: 'Power and capacity', icon: 'bolt' },
        { value: 'support',     label: 'Great support', desc: 'Help when I need it', icon: 'headset' },
        { value: 'flexibility', label: 'Flexibility', desc: 'Adapts as I grow', icon: 'puzzle' },
      ],
    },
  ],

  /* Copy for the results screen */
  result: {
    title: 'Here’s what we recommend',
    subtitle: 'Based on your answers, these are your best-matched products.',
    ctaLabel: 'View product',
    restartLabel: 'Start over',
    contactLabel: 'Still unsure? Talk to us',
  },
};

/* ----------------------------------------------------------------------------
   RECOMMENDATION ENGINE
   Pure function: given the answers map and the product list, returns a ranked
   list with scores and human-readable "why it matched" reasons.
   ---------------------------------------------------------------------------- */
window.recommendProducts = function recommendProducts(answers, products, questions) {
  const ranked = products.map((product) => {
    let score = 0;
    let maxScore = 0;
    const reasons = [];

    questions.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen == null) return;
      const chosenValues = Array.isArray(chosen) ? chosen : [chosen];
      if (chosenValues.length === 0) return;

      const productTags = (product.attrs && product.attrs[q.attr]) || [];
      maxScore += q.weight;

      // A question counts as "hit" if the product satisfies any chosen value.
      const hits = chosenValues.filter((v) => productTags.includes(v));
      if (hits.length > 0) {
        score += q.weight;
        // Build a friendly reason from the matched option label(s).
        const labels = hits
          .map((v) => {
            const opt = q.options.find((o) => o.value === v);
            return opt ? opt.label.toLowerCase() : v;
          });
        reasons.push(labels[0]);
      }
    });

    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return { product, score, percent, reasons };
  });

  // Highest score first; tie-break by rating then review volume.
  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
    return (b.product.reviews || 0) - (a.product.reviews || 0);
  });

  return ranked;
};
