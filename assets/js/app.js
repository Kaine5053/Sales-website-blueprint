/* ============================================================================
   APP — rendering + interactions for the sales-website blueprint.
   Plain ES (no build step, no dependencies). Reads from config.js,
   products.js and questionnaire.js and wires up the whole page.
   ============================================================================ */
(function () {
  'use strict';

  const cfg = window.SITE_CONFIG;
  const PRODUCTS = window.PRODUCTS || [];
  const QUIZ = window.QUESTIONNAIRE;

  /* ---- tiny DOM helpers ---- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CUR = (cfg && cfg.currency) || { symbol: '£', code: 'GBP', locale: 'en-GB' };
  const money = (n) => typeof n === 'number' ? CUR.symbol + n.toLocaleString(CUR.locale) : esc(n);

  /* ---- Icon library (inline SVG, currentColor) ------------------------- */
  const I = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
    chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/><path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" opacity=".7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0116 0v2"/><path d="M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z"/><path d="M18 16v1a3 3 0 01-3 3h-3"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    /* quiz option icons */
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2 20v-1a5 5 0 015-5h4a5 5 0 015 5v1"/><path d="M16 5.5a3.5 3.5 0 010 6.5M22 20v-1a5 5 0 00-3-4.58"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
    enterprise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg>',
    piggy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 10c.7 0 1 .3 1 1v2c0 .7-.3 1-1 1M4 13a6 6 0 016-6h3a6 6 0 016 6 6 6 0 01-3 5v2h-3v-1h-2v1H8v-2a6 6 0 01-4-5z"/><circle cx="9" cy="11" r="1" fill="currentColor"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/><path d="M16 12h.01M3 9h18"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M12 3L8 9l4 12 4-12-4-6z"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20l-1.5-9-4.5 4-4-7-4 7-4.5-4L2 18z"/></svg>',
    seedling: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 8 9 5 4 5c0 5 3 7 8 7zM12 12c0-3 2-5 6-5 0 4-2 6-6 5z"/></svg>',
    sprout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V10M12 10a5 5 0 00-5-5H4a5 5 0 005 5zM12 10a4 4 0 014-4h3a4 4 0 01-4 4z"/></svg>',
    tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-6M9 16a5 5 0 01-2-9.5A4 4 0 0112 3a4 4 0 015 3.5A5 5 0 0115 16H9z"/></svg>',
    feather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>',
    puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 10h-1a2 2 0 110-4h.5a2.5 2.5 0 00-5 0V6a2 2 0 11-4 0V5a2 2 0 00-2 2v1a2 2 0 11-4 0H3v4a2 2 0 002 2h1a2 2 0 110 4H5v4h4a2 2 0 002-2v-1a2 2 0 114 0v1a2 2 0 002 2h4v-4a2 2 0 00-2-2z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-.5-.2-.95-.5-1.3-.3-.34-.5-.79-.5-1.2 0-.83.67-1.5 1.5-1.5H16a6 6 0 006-6c0-5-4.5-8-10-8z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.2" fill="currentColor"/></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 7h10M5 21h14M3 11l3-6 3 6a3 3 0 01-6 0zM15 11l3-6 3 6a3 3 0 01-6 0z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
    article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a2 2 0 012 2v13a1 1 0 001 1 1 1 0 001-1V8h-3"/><path d="M4 4a1 1 0 00-1 1v14a2 2 0 002 2h13"/><line x1="7" y1="8" x2="12" y2="8"/><line x1="7" y1="12" x2="12" y2="12"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  };
  const icon = (name) => I[name] || '';

  /* ====================================================================
     RENDER: header / nav
     ==================================================================== */
  function renderHeader() {
    // brand
    $('#brand-mount').innerHTML =
      `<a href="#top" class="brand" aria-label="${esc(cfg.brand.name)} home">
         <span class="brand__mark">${cfg.brand.logoSvg}</span>
         <span>${esc(cfg.brand.name)}</span>
       </a>`;

    // desktop links (+ mega menu for products)
    const links = cfg.nav.map((item) => {
      if (item.hasMega) {
        const cats = [...new Set(PRODUCTS.map((p) => p.category))];
        const mega = cats.map((cat) => {
          const sample = PRODUCTS.find((p) => p.category === cat);
          return `<a href="#products" data-filter="${esc(cat)}">
                    <span class="icon-tile" style="width:40px;height:40px">${icon('box')}</span>
                    <span><span class="dd-title">${esc(cat)}</span><br><span class="dd-desc">${esc(sample ? sample.tagline : '')}</span></span>
                  </a>`;
        }).join('');
        return `<div class="nav__item">
                  <a class="nav__link" href="${esc(item.href)}">${esc(item.label)}</a>
                  <div class="nav__dropdown">${mega}</div>
                </div>`;
      }
      return `<a class="nav__link" href="${esc(item.href)}">${esc(item.label)}</a>`;
    }).join('');
    $('#nav-links').innerHTML = links;

    // mobile drawer links
    $('#mobile-drawer').innerHTML =
      cfg.nav.map((i) => `<a href="${esc(i.href)}" data-close-drawer>${esc(i.label)}</a>`).join('') +
      `<a href="${esc(cfg.headerCta.href)}" class="btn btn--primary" data-close-drawer style="margin-top:1rem">${esc(cfg.headerCta.label)}</a>`;

    // header CTA + quiz trigger + favourites indicator
    $('#header-cta').innerHTML =
      `<button class="btn btn--ghost btn--sm" data-action="open-quiz" title="Not sure what you need?">
         ${icon('compass')}<span class="nav__cta-text">Help me choose</span>
       </button>
       <a class="fave-indicator" href="#products" data-faves-only title="Your favourites" aria-label="View favourites">
         ${icon('heart')}<span class="fave-indicator__count" id="fave-count" hidden>0</span>
       </a>
       <a class="btn btn--primary btn--sm" href="${esc(cfg.headerCta.href)}">${esc(cfg.headerCta.label)}</a>`;
  }

  /* ====================================================================
     RENDER: announcement
     ==================================================================== */
  function renderAnnouncement() {
    const a = cfg.announcement;
    if (!a || !a.show) { $('#announce').remove(); return; }
    $('#announce').innerHTML =
      `${esc(a.text)} ${a.linkText ? `<a href="${esc(a.linkHref)}">${esc(a.linkText)} →</a>` : ''}`;
  }

  /* ====================================================================
     RENDER: hero
     ==================================================================== */
  function renderHero() {
    const h = cfg.hero;
    const avatars = (h.proofAvatars || []).map((c) =>
      `<span class="avatar" style="background:${esc(c)}"></span>`).join('');
    $('#hero-mount').innerHTML = `
      <div class="hero__glow" aria-hidden="true"></div>
      <div class="container">
        <div class="hero__grid">
          <div class="hero__content" data-reveal>
            <span class="badge">${icon('sparkles')} ${esc(h.badge)}</span>
            <h1>${esc(h.headlinePre)} <span class="text-gradient">${esc(h.headlineHighlight)}</span></h1>
            <p class="hero__sub">${esc(h.sub)}</p>
            <div class="hero__actions">
              <a class="btn btn--primary btn--lg" href="${esc(h.primaryCta.href)}">${esc(h.primaryCta.label)} ${icon('arrowRight')}</a>
              <button class="btn btn--secondary btn--lg btn--pulse" data-action="open-quiz">${icon('compass')} ${esc(h.secondaryCta.label)}</button>
            </div>
            <div class="hero__proof">
              <div class="avatar-group">${avatars}</div>
              <div>
                <div class="stars" aria-hidden="true">${icon('star').repeat(5)}</div>
                <span class="hero__proof-text">${esc(h.proofText)}</span>
              </div>
            </div>
          </div>
          <div class="hero__visual" data-reveal data-reveal-delay="1">
            <img src="${esc(h.image)}" alt="Product showcase" loading="eager" width="600" height="510"
                 onerror="this.style.display='none'">
            <div class="hero__floating hero__floating--tl">${icon(h.floatingTop.icon)} ${esc(h.floatingTop.text)}</div>
            <div class="hero__floating hero__floating--br">${icon(h.floatingBottom.icon)} ${esc(h.floatingBottom.text)}</div>
          </div>
        </div>
      </div>`;
  }

  /* ====================================================================
     RENDER: trust logos + stats
     ==================================================================== */
  function renderTrust() {
    $('#logos-mount').innerHTML = (cfg.trustLogos || []).map((l) => `<span>${esc(l)}</span>`).join('');
    $('#stats-mount').innerHTML = (cfg.stats || []).map((s, i) => `
      <div data-reveal data-reveal-delay="${i % 3}">
        <div class="stat__num" data-count="${esc(s.num)}">${esc(s.num)}</div>
        <div class="stat__label">${esc(s.label)}</div>
      </div>`).join('');
  }

  /* ====================================================================
     RENDER: features
     ==================================================================== */
  function renderFeatures() {
    $('#features-mount').innerHTML = (cfg.features || []).map((f, i) => `
      <div class="feature" data-reveal data-reveal-delay="${i % 3}">
        <span class="icon-tile">${icon(f.icon)}</span>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.text)}</p>
      </div>`).join('');
  }

  /* ====================================================================
     RENDER: product catalogue (with search + category filters)
     ==================================================================== */
  const catalogState = { query: '', category: 'All', favesOnly: false };
  const compareState = { ids: [], max: 4 };

  /* localStorage-backed lists (favourites + recently viewed) */
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } },
  };
  const faves = { ids: store.get('faves', []) };
  const recent = { ids: store.get('recent', []) };

  function isFave(id) { return faves.ids.includes(id); }
  function toggleFave(id) {
    const i = faves.ids.indexOf(id);
    if (i >= 0) faves.ids.splice(i, 1); else faves.ids.unshift(id);
    store.set('faves', faves.ids);
    // reflect on any heart buttons + header count without full re-render
    $$(`[data-fave="${cssEsc(id)}"]`).forEach((b) => {
      const on = isFave(id);
      b.setAttribute('aria-pressed', on);
      b.innerHTML = icon(on ? 'heartFilled' : 'heart');
    });
    updateFaveCount();
    if (catalogState.favesOnly) applyCatalogFilter();
  }
  function updateFaveCount() {
    const badge = $('#fave-count');
    if (!badge) return;
    badge.textContent = faves.ids.length;
    badge.hidden = faves.ids.length === 0;
  }
  function pushRecent(id) {
    recent.ids = [id, ...recent.ids.filter((x) => x !== id)].slice(0, 8);
    store.set('recent', recent.ids);
  }
  const cssEsc = (s) => String(s).replace(/"/g, '\\"');

  function productCardHTML(p) {
    const badges = (p.badges || []).map((b) =>
      `<span class="badge ${b.type === 'solid' ? 'badge--solid' : ''}">${esc(b.text)}</span>`).join('');
    const isComparing = compareState.ids.includes(p.id);
    return `
      <article class="card card--interactive product-card" data-product="${esc(p.id)}" tabindex="0" role="button" aria-label="View ${esc(p.name)}">
        <button class="compare-toggle" data-compare="${esc(p.id)}" aria-pressed="${isComparing}"
                title="Add to comparison" aria-label="Compare ${esc(p.name)}">
          ${icon('scale')} Compare
        </button>
        <button class="fave-btn" data-fave="${esc(p.id)}" aria-pressed="${isFave(p.id)}"
                title="Save to favourites" aria-label="Save ${esc(p.name)} to favourites">
          ${icon(isFave(p.id) ? 'heartFilled' : 'heart')}
        </button>
        <div class="product-card__media">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="320" height="220"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'pd-fallback'}))">
          ${badges ? `<div class="product-card__badges">${badges}</div>` : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__cat">${esc(p.category)}</span>
          <h3 class="product-card__title">${esc(p.name)}</h3>
          <p class="product-card__desc">${esc(p.tagline)}</p>
          <div class="product-card__foot">
            <span class="product-card__price">${money(p.price)} <small>${esc(p.priceUnit || '')}</small></span>
            <span class="stars" title="${esc(p.rating)} out of 5">${icon('star')}<span style="font-size:.8rem;color:var(--text-muted);font-weight:600">${esc(p.rating)}</span></span>
          </div>
        </div>
      </article>`;
  }

  function renderCatalog() {
    const cats = ['All', ...new Set(PRODUCTS.map((p) => p.category))];
    $('#catalog-filters').innerHTML = cats.map((c) =>
      `<button class="chip" data-category="${esc(c)}" aria-pressed="${!catalogState.favesOnly && c === catalogState.category}">${esc(c)}</button>`).join('') +
      `<button class="chip chip--fave" data-faves-only aria-pressed="${catalogState.favesOnly}" title="Show only your saved products">${icon('heart')} Favourites</button>`;
    applyCatalogFilter();
  }

  function applyCatalogFilter() {
    const q = catalogState.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const inCat = catalogState.category === 'All' || p.category === catalogState.category;
      const inSearch = !q ||
        [p.name, p.tagline, p.description, p.category].join(' ').toLowerCase().includes(q);
      const inFaves = !catalogState.favesOnly || isFave(p.id);
      return inCat && inSearch && inFaves;
    });
    const grid = $('#product-grid');
    if (list.length === 0) {
      const favesEmpty = catalogState.favesOnly && faves.ids.length === 0;
      grid.innerHTML = `<div class="empty-state">${icon(favesEmpty ? 'heart' : 'search')}<p><strong>${favesEmpty ? 'No favourites yet.' : 'No products found.'}</strong><br>${favesEmpty ? 'Tap the heart on any product to save it here.' : 'Try a different search or filter — or let us help you choose.'}</p>
        ${favesEmpty ? '' : `<button class="btn btn--primary" data-action="open-quiz" style="margin-top:1rem">${icon('compass')} Help me choose</button>`}</div>`;
      return;
    }
    grid.innerHTML = list.map(productCardHTML).join('');
    $$('[data-reveal]', grid).forEach((n) => n.classList.add('is-visible'));
  }

  /* ====================================================================
     PRODUCT DETAIL modal
     ==================================================================== */
  function openProduct(id, fromRoute) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    pushRecent(id);
    const features = (p.features || []).map((f) => `<li>${icon('check')} <span>${esc(f)}</span></li>`).join('');
    const specs = Object.entries(p.specs || {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    const badges = (p.badges || []).map((b) => `<span class="badge ${b.type === 'solid' ? 'badge--solid' : ''}">${esc(b.text)}</span>`).join(' ');
    // related = same category first, then top up with nearest-priced others
    let related = PRODUCTS.filter((x) => x.id !== id && x.category === p.category);
    if (related.length < 3) {
      const fillers = PRODUCTS
        .filter((x) => x.id !== id && !related.includes(x))
        .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price));
      related = related.concat(fillers).slice(0, 3);
    } else {
      related = related.slice(0, 3);
    }
    const relatedHTML = related.length ? `
      <div class="pd__related">
        <h3 class="pd__related-title">Related products</h3>
        <div class="pd__related-list">
          ${related.map((r) => `
            <button class="pd-related-card" data-product="${esc(r.id)}">
              <img src="${esc(r.image)}" alt="${esc(r.name)}" onerror="this.style.visibility='hidden'">
              <span><span class="pd-related-name">${esc(r.name)}</span><span class="pd-related-price">${money(r.price)}</span></span>
            </button>`).join('')}
        </div>
      </div>` : '';

    $('#product-modal-content').innerHTML = `
      <div class="pd">
        <div class="pd__media">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.opacity=0">
        </div>
        <div class="pd__body">
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
            ${badges}
            <button class="pd-icon-btn" data-fave="${esc(p.id)}" aria-pressed="${isFave(p.id)}" title="Save to favourites" style="margin-left:auto">${icon(isFave(p.id) ? 'heartFilled' : 'heart')}</button>
            <button class="pd-icon-btn" data-share="${esc(p.id)}" title="Share this product">${icon('share')}</button>
          </div>
          <span class="product-card__cat">${esc(p.category)}</span>
          <h2 class="pd__title">${esc(p.name)}</h2>
          <div class="stars">${icon('star').repeat(Math.round(p.rating))}
            <span style="color:var(--text-muted);font-size:.85rem;font-weight:600;margin-left:.25rem">${esc(p.rating)} (${esc(p.reviews)} reviews)</span></div>
          <p class="text-muted">${esc(p.description)}</p>
          <div class="pd__price">${money(p.price)} <small>${esc(p.priceUnit || '')}</small></div>
          <ul class="pd__features" role="list">${features}</ul>
          <dl class="pd__specs">${specs}</dl>
          <div class="pd__actions">
            <a class="btn btn--primary btn--block" href="#contact" data-close-modal data-product-request="${esc(p.id)}">Request this product ${icon('arrowRight')}</a>
            <button class="btn btn--secondary" data-compare="${esc(p.id)}">Add to compare</button>
          </div>
          ${relatedHTML}
        </div>
      </div>`;
    if (!fromRoute) setHash('product/' + id);
    openModal('#product-modal');
    renderRecentlyViewed();
  }

  function shareProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const url = location.origin + location.pathname + '#product/' + id;
    const data = { title: `${p.name} — ${cfg.brand.name}`, text: p.tagline, url };
    if (navigator.share) { navigator.share(data).catch(() => {}); return; }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => toast('Link copied to clipboard')).catch(() => toast(url));
    } else { toast(url); }
  }

  /* ====================================================================
     PRICING / TESTIMONIALS / FAQ / CTA / CONTACT / FOOTER
     ==================================================================== */
  function renderPricing() {
    if (!cfg.pricing || !cfg.pricing.enabled) { $('#pricing')?.remove(); return; }
    $('#pricing-note').textContent = cfg.pricing.note || '';
    $('#pricing-mount').innerHTML = cfg.pricing.plans.map((pl) => {
      const feats = pl.features.map((f) => `<li>${icon('check')} <span>${esc(f)}</span></li>`).join('');
      return `<div class="price-card ${pl.featured ? 'price-card--featured' : ''}" data-reveal>
        <div class="price-card__name">${esc(pl.name)}</div>
        <p class="text-muted" style="font-size:.875rem">${esc(pl.blurb)}</p>
        <div class="price-card__price">${esc(pl.price)}<small>${esc(pl.period)}</small></div>
        <ul class="price-card__features" role="list">${feats}</ul>
        <a class="btn ${pl.featured ? 'btn--primary' : 'btn--secondary'} btn--block" href="${esc(pl.cta.href)}">${esc(pl.cta.label)}</a>
      </div>`;
    }).join('');
  }

  function renderTestimonials() {
    $('#testimonials-mount').innerHTML = (cfg.testimonials || []).map((t, i) => `
      <figure class="testimonial" data-reveal data-reveal-delay="${i % 3}">
        <div class="stars" aria-hidden="true">${icon('star').repeat(t.rating || 5)}</div>
        <blockquote class="testimonial__quote">“${esc(t.quote)}”</blockquote>
        <figcaption class="testimonial__person">
          <span class="avatar" style="background:${esc(t.color || '#888')}"></span>
          <span><span class="testimonial__name">${esc(t.name)}</span><br><span class="testimonial__role">${esc(t.role)}</span></span>
        </figcaption>
      </figure>`).join('');
  }

  function renderResources() {
    const section = $('#resources');
    const data = cfg.resources;
    if (!section) return;
    if (!data || !data.posts || !data.posts.length) { section.remove(); return; }
    $('#resources-eyebrow').textContent = data.eyebrow || 'Resources';
    $('#resources-title').textContent = data.title || 'From our blog';
    $('#resources-lead').textContent = data.lead || '';
    $('#resources-mount').innerHTML = data.posts.map((post, i) => `
      <article class="card card--interactive resource-card" data-resource="${i}" role="button" tabindex="0"
               aria-label="Read: ${esc(post.title)}" data-reveal data-reveal-delay="${i % 3}">
        <div class="resource-card__media" style="background:${esc(post.color || 'var(--brand)')}">
          ${icon(post.icon || 'article')}
          <span class="resource-card__cat">${esc(post.category || 'Guide')}</span>
        </div>
        <div class="resource-card__body">
          <h3 class="resource-card__title">${esc(post.title)}</h3>
          <p class="resource-card__excerpt">${esc(post.excerpt)}</p>
          <div class="resource-card__meta">
            <span>${icon('clock')} ${esc(post.readTime || '5 min read')}</span>
            <span class="resource-card__link">Read more ${icon('arrowRight')}</span>
          </div>
        </div>
      </article>`).join('');
  }

  function openArticle(index) {
    const post = (cfg.resources && cfg.resources.posts) ? cfg.resources.posts[index] : null;
    if (!post) return;
    const bodyHTML = (post.body || [{ p: post.excerpt }]).map((block) =>
      block.h ? `<h3 class="article__h">${esc(block.h)}</h3>` : `<p>${esc(block.p)}</p>`).join('');
    $('#article-modal-content').innerHTML = `
      <div class="article">
        <div class="article__hero" style="background:${esc(post.color || 'var(--brand)')}">
          ${icon(post.icon || 'article')}
        </div>
        <div class="article__body">
          <span class="badge">${esc(post.category || 'Guide')}</span>
          <h1 class="article__title">${esc(post.title)}</h1>
          <div class="article__meta">
            ${post.author ? `<span>${esc(post.author)}</span>` : ''}
            ${post.date ? `<span>· ${esc(post.date)}</span>` : ''}
            <span>· ${icon('clock')} ${esc(post.readTime || '5 min read')}</span>
          </div>
          <div class="article__content">${bodyHTML}</div>
          <div class="article__cta">
            <button class="btn btn--primary" data-action="open-quiz" data-close-modal>${icon('compass')} Help me choose</button>
            <a class="btn btn--secondary" href="#products" data-close-modal>Browse products</a>
          </div>
        </div>
      </div>`;
    openModal('#article-modal');
  }

  function renderRecentlyViewed() {
    const section = $('#recently-viewed');
    if (!section) return;
    const items = recent.ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean).slice(0, 6);
    if (items.length < 2) { section.hidden = true; return; }
    section.hidden = false;
    $('#recent-mount').innerHTML = items.map((p) => `
      <button class="recent-card" data-product="${esc(p.id)}" title="${esc(p.name)}">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">
        <span class="recent-card__name">${esc(p.name)}</span>
        <span class="recent-card__price">${money(p.price)}</span>
      </button>`).join('');
  }

  function renderFaq() {
    $('#faq-mount').innerHTML = (cfg.faq || []).map((f) => `
      <details class="faq-item">
        <summary>${esc(f.q)} <span class="faq-icon">${icon('plus')}</span></summary>
        <div class="faq-item__body">${esc(f.a)}</div>
      </details>`).join('');
  }

  function renderCtaBand() {
    const c = cfg.ctaBand;
    $('#cta-mount').innerHTML = `
      <div class="cta-band" data-reveal>
        <h2>${esc(c.title)}</h2>
        <p>${esc(c.text)}</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative">
          <button class="btn btn--on-dark btn--lg" data-action="open-quiz">${icon('compass')} ${esc(c.primaryCta.label)}</button>
          <a class="btn btn--lg" style="background:#fff;color:var(--brand)" href="${esc(c.secondaryCta.href)}">${esc(c.secondaryCta.label)}</a>
        </div>
      </div>`;
  }

  function renderContact() {
    const c = cfg.contact;
    $('#contact-info').innerHTML = `
      <div class="contact-info__item"><span class="icon-tile">${icon('mail')}</span>
        <div><strong>Email</strong><br><a class="text-muted" href="mailto:${esc(c.email)}">${esc(c.email)}</a></div></div>
      <div class="contact-info__item"><span class="icon-tile">${icon('phone')}</span>
        <div><strong>Phone</strong><br><a class="text-muted" href="tel:${esc(c.phone)}">${esc(c.phone)}</a></div></div>
      <div class="contact-info__item"><span class="icon-tile">${icon('pin')}</span>
        <div><strong>Visit us</strong><br><span class="text-muted">${esc(c.address)}</span></div></div>`;
    $('#contact-heading').textContent = c.heading;
    $('#contact-sub').textContent = c.sub;
  }

  function renderFooter() {
    const f = cfg.footer;
    const cols = f.columns.map((col) => `
      <div class="footer-col">
        <h4>${esc(col.title)}</h4>
        <ul role="list">${col.links.map((l) =>
          `<li><a href="${esc(l.href)}" ${l.action ? `data-action="${esc(l.action)}"` : ''}>${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`).join('');
    const socials = (f.socials || []).map((s) =>
      `<a href="#" aria-label="${esc(s)}">${icon(s)}</a>`).join('');
    $('#footer-mount').innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <a href="#top" class="brand"><span class="brand__mark">${cfg.brand.logoSvg}</span><span>${esc(cfg.brand.name)}</span></a>
            <p class="footer-about">${esc(f.about)}</p>
            <div class="social-links">${socials}</div>
          </div>
          ${cols}
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(cfg.brand.name)}. All rights reserved.</span>
          <div style="display:flex;gap:1.5rem">${(f.legalLinks || []).map((l) => `<a href="${esc(l.href)}" style="color:inherit">${esc(l.label)}</a>`).join('')}</div>
        </div>
      </div>`;
  }

  /* ====================================================================
     QUESTIONNAIRE WIZARD
     ==================================================================== */
  const quiz = { step: -1, answers: {} }; // step -1 = intro

  function openQuiz() {
    quiz.step = -1;
    quiz.answers = {};
    renderQuizStep();
    openModal('#quiz-modal');
  }

  function renderQuizStep() {
    const total = QUIZ.questions.length;
    const content = $('#quiz-modal-content');

    if (quiz.step === -1) {
      content.innerHTML = `
        <div class="quiz">
          <div class="quiz-result__match">${icon('compass')}</div>
          <h2 class="quiz__question text-center">${esc(QUIZ.intro.title)}</h2>
          <p class="quiz__help text-center mx-auto" style="max-width:42ch">${esc(QUIZ.intro.text)}</p>
          <div class="quiz__nav" style="justify-content:center">
            <button class="btn btn--primary btn--lg" data-quiz-next>Let’s go ${icon('arrowRight')}</button>
          </div>
        </div>`;
      return;
    }

    if (quiz.step >= total) { renderQuizResult(); return; }

    const q = QUIZ.questions[quiz.step];
    const chosen = quiz.answers[q.id];
    const isChosen = (v) => Array.isArray(chosen) ? chosen.includes(v) : chosen === v;
    const opts = q.options.map((o) => `
      <button class="quiz-option" data-quiz-option="${esc(o.value)}" aria-pressed="${isChosen(o.value)}">
        <span class="quiz-option__icon">${icon(o.icon)}</span>
        <span><span class="quiz-option__label">${esc(o.label)}</span>
        ${o.desc ? `<br><span class="quiz-option__desc">${esc(o.desc)}</span>` : ''}</span>
        <span class="quiz-option__check">${icon('check')}</span>
      </button>`).join('');

    const pct = Math.round((quiz.step / total) * 100);
    const canAdvance = q.multi ? (Array.isArray(chosen) && chosen.length > 0) : (chosen != null);

    content.innerHTML = `
      <div class="quiz">
        <div class="quiz__progress"><div class="quiz__progress-bar" style="width:${pct}%"></div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
          <span class="quiz__step-count">Question ${quiz.step + 1} of ${total}</span>
          ${q.multi ? '<span class="badge badge--neutral">Choose all that apply</span>' : ''}
        </div>
        <h2 class="quiz__question">${esc(q.question)}</h2>
        <p class="quiz__help">${esc(q.help || '')}</p>
        <div class="quiz__options ${q.options.length > 3 ? 'quiz__options--cols' : ''}">${opts}</div>
        <div class="quiz__nav">
          <button class="btn btn--ghost" data-quiz-back>${icon('arrowLeft')} Back</button>
          <button class="btn btn--primary" data-quiz-next ${canAdvance ? '' : 'disabled'}>
            ${quiz.step === total - 1 ? 'See results' : 'Next'} ${icon('arrowRight')}
          </button>
        </div>
      </div>`;
    announce(`Question ${quiz.step + 1} of ${total}. ${q.question}`);
  }

  function renderQuizResult() {
    const ranked = window.recommendProducts(quiz.answers, PRODUCTS, QUIZ.questions);
    const top = ranked.filter((r) => r.score > 0).slice(0, 3);
    const picks = (top.length ? top : ranked.slice(0, 3));
    const r = QUIZ.result;

    const picksHTML = picks.map((entry, i) => {
      const p = entry.product;
      const why = entry.reasons.length
        ? `Matches: ${entry.reasons.slice(0, 3).join(', ')}`
        : 'A solid all-round choice';
      return `
        <div class="quiz-pick" data-product="${esc(p.id)}" role="button" tabindex="0">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">
          <div class="quiz-pick__body">
            ${i === 0 ? `<span class="badge badge--solid">${icon('sparkles')} Top match</span>` : ''}
            <div style="font-weight:700;margin-top:.25rem">${esc(p.name)}</div>
            <div class="text-muted" style="font-size:.85rem">${esc(p.tagline)} · ${money(p.price)}</div>
            <span class="quiz-pick__why">${esc(why)}</span>
          </div>
          <span class="quiz-pick__score">${entry.percent}%<br><span style="font-size:.65rem;font-weight:500;color:var(--text-subtle)">match</span></span>
        </div>`;
    }).join('');

    $('#quiz-modal-content').innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result__match">${icon('sparkles')}</div>
        <span class="badge quiz-result__badge">${icon('check')} Your results are in</span>
        <h2 class="quiz__question">${esc(r.title)}</h2>
        <p class="quiz__help mx-auto" style="max-width:44ch">${esc(r.subtitle)}</p>
        <div class="quiz-result__picks">${picksHTML}</div>
        <div class="quiz__nav" style="margin-top:2rem">
          <button class="btn btn--ghost" data-quiz-restart>${icon('refresh')} ${esc(r.restartLabel)}</button>
          <a class="btn btn--primary" href="#contact" data-close-modal>${esc(r.contactLabel)} ${icon('arrowRight')}</a>
        </div>
      </div>`;
  }

  function quizSelect(value) {
    const q = QUIZ.questions[quiz.step];
    if (!q) return;
    if (q.multi) {
      const arr = Array.isArray(quiz.answers[q.id]) ? quiz.answers[q.id] : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(value);
      quiz.answers[q.id] = arr;
      renderQuizStep(); // re-render to reflect multi-select + enable Next
    } else {
      quiz.answers[q.id] = value;
      // auto-advance for single-select after a short beat
      renderQuizStep();
      setTimeout(() => { quiz.step++; renderQuizStep(); }, 260);
    }
  }

  /* ====================================================================
     PRODUCT COMPARISON
     ==================================================================== */
  function toggleCompare(id) {
    const i = compareState.ids.indexOf(id);
    if (i >= 0) {
      compareState.ids.splice(i, 1);
    } else {
      if (compareState.ids.length >= compareState.max) {
        toast(`You can compare up to ${compareState.max} products at once.`);
        return;
      }
      compareState.ids.push(id);
    }
    // reflect on any visible toggle buttons without a full re-render
    $$('[data-compare]').forEach((b) =>
      b.setAttribute('aria-pressed', compareState.ids.includes(b.getAttribute('data-compare'))));
    renderCompareTray();
  }

  function renderCompareTray() {
    const tray = $('#compare-tray');
    const n = compareState.ids.length;
    tray.setAttribute('data-open', n > 0);
    $('#compare-count').textContent = `${n} selected`;
    $('#compare-open').disabled = n < 2;
    $('#compare-open').textContent = n < 2 ? 'Pick 2+' : `Compare (${n})`;
    $('#compare-thumbs').innerHTML = compareState.ids.map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return p ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" title="${esc(p.name)}">` : '';
    }).join('');
  }

  function clearCompare() {
    compareState.ids = [];
    $$('[data-compare]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    renderCompareTray();
  }

  function openCompare() {
    const items = compareState.ids.map((id) => PRODUCTS.find((x) => x.id === id)).filter(Boolean);
    if (items.length < 2) return;

    // collect the union of spec keys across selected products
    const specKeys = [...new Set(items.flatMap((p) => Object.keys(p.specs || {})))];
    const minPrice = Math.min(...items.map((p) => p.price));
    const maxRating = Math.max(...items.map((p) => p.rating));

    const head = items.map((p) => `
      <th class="ct-product" scope="col">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">
        <div class="ct-name">${esc(p.name)}</div>
        <div class="product-card__cat">${esc(p.category)}</div>
      </th>`).join('');

    const priceRow = items.map((p) =>
      `<td class="${p.price === minPrice ? 'ct-best' : ''}"><span class="ct-price">${money(p.price)}</span> <small>${esc(p.priceUnit || '')}</small>${p.price === minPrice ? ' <span class="badge badge--success">Lowest</span>' : ''}</td>`).join('');

    const ratingRow = items.map((p) =>
      `<td class="${p.rating === maxRating ? 'ct-best' : ''}"><span class="stars">${icon('star')}</span> ${esc(p.rating)} <small>(${esc(p.reviews)})</small>${p.rating === maxRating ? ' <span class="badge badge--success">Top rated</span>' : ''}</td>`).join('');

    const specRows = specKeys.map((k) => `
      <tr><th scope="row">${esc(k)}</th>
        ${items.map((p) => `<td>${esc((p.specs && p.specs[k]) || '—')}</td>`).join('')}
      </tr>`).join('');

    // feature presence matrix (union of all features)
    const allFeatures = [...new Set(items.flatMap((p) => p.features || []))];
    const featureRows = allFeatures.map((f) => `
      <tr><th scope="row">${esc(f)}</th>
        ${items.map((p) => `<td class="text-center">${(p.features || []).includes(f) ? `<span class="ct-yes">${icon('check')}</span>` : '<span style="color:var(--text-subtle)">—</span>'}</td>`).join('')}
      </tr>`).join('');

    const ctaRow = items.map((p) =>
      `<td class="compare-cell-cta"><a class="btn btn--primary btn--sm" href="#contact" data-close-modal data-product-request="${esc(p.id)}">Choose</a></td>`).join('');

    $('#compare-modal-content').innerHTML = `
      <div class="compare-wrap">
        <div class="section-head" style="margin-bottom:1rem">
          <span class="eyebrow">${icon('scale')} Side by side</span>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
            <h2 class="section-title" style="font-size:var(--fs-2xl)">Compare ${items.length} products</h2>
            <button class="btn btn--secondary btn--sm no-print" id="compare-print">${icon('print')} Print / PDF</button>
          </div>
        </div>
        <table class="compare-table">
          <thead><tr><th scope="col" style="width:160px"></th>${head}</tr></thead>
          <tbody>
            <tr><th scope="row">Price</th>${priceRow}</tr>
            <tr><th scope="row">Rating</th>${ratingRow}</tr>
            ${specRows}
            ${featureRows}
            <tr><th scope="row"></th>${ctaRow}</tr>
          </tbody>
        </table>
      </div>`;
    openModal('#compare-modal');
    $('#compare-print')?.addEventListener('click', () => window.print());
  }

  /* ====================================================================
     THEME PRESET SWITCHER  (industry re-skins)
     ==================================================================== */
  const PRESETS = window.THEME_PRESETS || [];

  function applyPreset(id, persist = true) {
    const preset = PRESETS.find((p) => p.id === id) || PRESETS[0];
    if (!preset) return;
    const root = document.documentElement;
    // clear any previously-applied preset vars, then apply the new set
    (applyPreset._applied || []).forEach((k) => root.style.removeProperty(k));
    applyPreset._applied = Object.keys(preset.vars || {});
    Object.entries(preset.vars || {}).forEach(([k, v]) => root.style.setProperty(k, v));
    if (persist) localStorage.setItem('preset', id);
    $$('#theme-presets .theme-preset').forEach((b) =>
      b.setAttribute('aria-pressed', b.getAttribute('data-preset') === preset.id));
  }

  function renderThemeSwitcher() {
    $('#theme-fab-icon').innerHTML = icon('palette');
    $('#theme-panel-close').innerHTML = icon('close');
    $('#theme-presets').innerHTML = PRESETS.map((p) => `
      <button class="theme-preset" data-preset="${esc(p.id)}" aria-pressed="false">
        <span class="theme-preset__swatch">${(p.swatch || []).map((c) => `<span style="background:${esc(c)}"></span>`).join('')}</span>
        <span class="theme-preset__name">${esc(p.name)}</span>
      </button>`).join('');

    // apply preset on click
    $('#theme-presets').addEventListener('click', (e) => {
      const b = e.target.closest('[data-preset]');
      if (b) applyPreset(b.getAttribute('data-preset'));
    });

    // restore saved preset
    const saved = localStorage.getItem('preset');
    applyPreset(saved && PRESETS.some((p) => p.id === saved) ? saved : 'default', false);

    // sync dark switch with current theme
    const darkSwitch = $('#theme-dark-switch');
    darkSwitch.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    darkSwitch.addEventListener('change', () => { toggleTheme(); });

    // panel open/close
    const fab = $('#theme-fab');
    const panel = $('#theme-panel');
    const setPanel = (open) => { panel.setAttribute('data-open', open); fab.setAttribute('aria-expanded', open); };
    fab.addEventListener('click', () => setPanel(panel.getAttribute('data-open') !== 'true'));
    $('#theme-panel-close').addEventListener('click', () => setPanel(false));
    document.addEventListener('click', (e) => {
      if (panel.getAttribute('data-open') === 'true' && !panel.contains(e.target) && !fab.contains(e.target)) setPanel(false);
    });
  }

  /* ====================================================================
     SEO — inject JSON-LD structured data (Organization + Products)
     ==================================================================== */
  function injectStructuredData() {
    const org = {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: cfg.brand.name, description: cfg.brand.tagline,
      contactPoint: { '@type': 'ContactPoint', email: cfg.contact.email, telephone: cfg.contact.phone, contactType: 'sales' },
    };
    const itemList = {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: PRODUCTS.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'Product', name: p.name, description: p.description, category: p.category,
          offers: { '@type': 'Offer', price: p.price, priceCurrency: CUR.code, availability: 'https://schema.org/InStock' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
        },
      })),
    };
    [org, itemList].forEach((data) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
    });
  }

  /* ====================================================================
     Keyboard shortcuts: "?" opens finder, "/" focuses search
     ==================================================================== */
  function initShortcuts() {
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (typing) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); openQuiz(); }
      else if (e.key === '/') {
        const s = $('#catalog-search');
        if (s) { e.preventDefault(); s.scrollIntoView({ block: 'center', behavior: 'smooth' }); s.focus(); }
      }
    });
  }

  /* ====================================================================
     HASH ROUTER — deep-linkable, shareable product views (#product/<id>)
     ==================================================================== */
  let suppressRoute = false;
  function setHash(h) { suppressRoute = true; location.hash = h; setTimeout(() => { suppressRoute = false; }, 0); }
  function clearProductHash() {
    if (/^#product\//.test(location.hash)) {
      suppressRoute = true;
      history.replaceState(null, '', location.pathname + location.search);
      setTimeout(() => { suppressRoute = false; }, 0);
    }
  }
  function handleRoute() {
    if (suppressRoute) return;
    const m = location.hash.match(/^#product\/(.+)$/);
    if (m) {
      const id = decodeURIComponent(m[1]);
      if (PRODUCTS.some((p) => p.id === id)) openProduct(id, true);
    } else if (location.hash === '#quiz') {
      openQuiz();
    }
  }

  /* ====================================================================
     MODAL plumbing (focus trap + scroll lock + ESC)
     ==================================================================== */
  let lastFocused = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(sel) {
    const m = $(sel);
    if (!m) return;
    lastFocused = document.activeElement;
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusable = m.querySelector(FOCUSABLE);
    if (focusable) setTimeout(() => focusable.focus(), 50);
    m._trap = trapFocus(m);
    announce((m.getAttribute('aria-label') || 'Dialog') + ' opened');
  }
  function closeModal(m) {
    m.setAttribute('aria-hidden', 'true');
    if (m._trap) { m._trap(); m._trap = null; }
    if (m.id === 'product-modal') clearProductHash();
    if (!$$('.modal[aria-hidden="false"]').length) document.body.style.overflow = '';
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  }
  function closeAllModals() { $$('.modal[aria-hidden="false"]').forEach(closeModal); }

  /* Keep Tab focus inside the modal while it's open; returns a cleanup fn. */
  function trapFocus(m) {
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = $$(FOCUSABLE, m).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    m.addEventListener('keydown', onKey);
    return () => m.removeEventListener('keydown', onKey);
  }

  /* Polite screen-reader announcement */
  function announce(msg) {
    const live = $('#sr-live');
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
  }

  /* ====================================================================
     QUOTE BASKET — collect products into a pre-filled quote request
     ==================================================================== */
  const quote = { ids: store.get('quote', []) };

  function addToQuote(id) {
    if (!PRODUCTS.some((p) => p.id === id)) return;
    if (!quote.ids.includes(id)) {
      quote.ids.push(id);
      store.set('quote', quote.ids);
      const p = PRODUCTS.find((x) => x.id === id);
      toast(`${p.name} added to your quote request`);
      track('add_to_quote', { id });
    }
    renderQuote(true);
  }
  function removeFromQuote(id) {
    quote.ids = quote.ids.filter((x) => x !== id);
    store.set('quote', quote.ids);
    renderQuote();
  }
  function clearQuote() { quote.ids = []; store.set('quote', []); renderQuote(); }

  function renderQuote(prefill) {
    const basket = $('#quote-basket');
    const list = $('#quote-list');
    if (!basket || !list) return;
    const items = quote.ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
    basket.hidden = items.length === 0;
    list.innerHTML = items.map((p) => `
      <li class="quote-chip">
        <img src="${esc(p.image)}" alt="" onerror="this.style.visibility='hidden'">
        <span class="quote-chip__name">${esc(p.name)}</span>
        <span class="quote-chip__price">${money(p.price)}</span>
        <button type="button" class="quote-chip__remove" data-quote-remove="${esc(p.id)}" aria-label="Remove ${esc(p.name)} from quote">${icon('close')}</button>
      </li>`).join('');

    // keep the message + subject in sync with the selection
    const msg = $('#cf-message');
    const subject = $('#cf-subject');
    if (items.length) {
      const names = items.map((p) => `${p.name} (${money(p.price)})`).join(', ');
      const line = `I'd like a quote for: ${names}.`;
      if (msg && (!msg.value || msg.dataset.auto === '1')) { msg.value = line; msg.dataset.auto = '1'; }
      if (subject) subject.value = 'A custom quote';
    } else if (msg && msg.dataset.auto === '1') {
      msg.value = ''; delete msg.dataset.auto;
    }

    if (prefill) {
      const contact = $('#contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ====================================================================
     COOKIE CONSENT + ANALYTICS (analytics loads only after consent)
     ==================================================================== */
  function track(event, data) {
    // central analytics hook — safe no-op until consent + provider configured
    if (window.__consent !== 'accepted') return;
    if (typeof window.gtag === 'function') window.gtag('event', event, data || {});
    (window.dataLayer = window.dataLayer || []).push({ event, ...data });
  }

  function initAnalytics() {
    const a = cfg.analytics || {};
    window.__consent = 'accepted';
    if (a.provider === 'ga4' && a.id) {
      const s = document.createElement('script');
      s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(a.id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', a.id);
    } else if (a.provider === 'plausible' && a.id) {
      const s = document.createElement('script');
      s.defer = true; s.dataset.domain = a.id; s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
    // 'stub' (default): no external script; track() still records to dataLayer.
  }

  function initCookies() {
    const c = cfg.cookies;
    const banner = $('#cookie-banner');
    if (!c || !c.show || !banner) { banner?.remove(); maybeInitAnalyticsFromStored(); return; }
    const choice = localStorage.getItem('cookie-consent');
    if (choice === 'accepted') { window.__consent = 'accepted'; initAnalytics(); return; }
    if (choice === 'declined') { window.__consent = 'declined'; return; }

    $('#cookie-text').innerHTML = `${esc(c.message)} ${c.policyLabel ? `<a href="${esc(c.policyHref)}" style="text-decoration:underline">${esc(c.policyLabel)}</a>` : ''}`;
    $('#cookie-accept').textContent = c.acceptLabel;
    $('#cookie-decline').textContent = c.declineLabel;
    banner.hidden = false;
    document.body.classList.add('has-cookie');
    const decide = (val) => {
      localStorage.setItem('cookie-consent', val);
      window.__consent = val;
      banner.hidden = true;
      document.body.classList.remove('has-cookie');
      if (val === 'accepted') initAnalytics();
    };
    $('#cookie-accept').addEventListener('click', () => decide('accepted'));
    $('#cookie-decline').addEventListener('click', () => decide('declined'));
  }
  function maybeInitAnalyticsFromStored() {
    if (localStorage.getItem('cookie-consent') === 'accepted') { window.__consent = 'accepted'; initAnalytics(); }
  }

  /* ====================================================================
     THEME toggle
     ==================================================================== */
  function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.setAttribute('data-theme', 'dark');
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('theme', cur);
  }

  /* ====================================================================
     Toast
     ==================================================================== */
  function toast(msg) {
    const region = $('#toast-region');
    const t = el(`<div class="toast">${icon('check')}<span>${esc(msg)}</span></div>`);
    region.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; setTimeout(() => t.remove(), 300); }, 3200);
  }

  /* ====================================================================
     Scroll behaviours: header shadow, reveal, back-to-top, active nav
     ==================================================================== */
  function initScroll() {
    const header = $('#site-header');
    const toTop = $('#to-top');
    const onScroll = () => {
      const y = window.scrollY;
      header.setAttribute('data-scrolled', y > 8);
      toTop.setAttribute('data-visible', y > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // reveal on intersection
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      $$('[data-reveal]').forEach((n) => io.observe(n));
    } else {
      $$('[data-reveal]').forEach((n) => n.classList.add('is-visible'));
    }

    // active section in nav via scroll-spy
    const sections = $$('main section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            $$('.nav__link').forEach((l) =>
              l.setAttribute('aria-current', l.getAttribute('href') === '#' + e.target.id));
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* Animate stat counters when revealed */
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const node = e.target;
        const raw = node.getAttribute('data-count');
        const m = raw.match(/([\d,.]+)/);
        if (!m) return;
        const target = parseFloat(m[1].replace(/,/g, ''));
        const suffix = raw.slice(m.index + m[1].length);
        const prefix = raw.slice(0, m.index);
        const isInt = Number.isInteger(target);
        let start = 0; const dur = 1200; const t0 = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          const val = target * eased;
          node.textContent = prefix + (isInt ? Math.round(val).toLocaleString('en-GB') : val.toFixed(1)) + suffix;
          if (k < 1) requestAnimationFrame(tick); else node.textContent = raw;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((n) => io.observe(n));
  }

  /* ====================================================================
     Global event delegation
     ==================================================================== */
  function initEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action], [data-compare], [data-fave], [data-share], [data-faves-only], [data-product-request], [data-quote-remove], [data-resource], [data-product], [data-category], [data-filter], [data-quiz-option], [data-quiz-next], [data-quiz-back], [data-quiz-restart], [data-close-modal], [data-close-drawer], [data-modal-close]');
      if (!t) return;

      if (t.matches('[data-action="open-quiz"]') || t.dataset.action === 'open-quiz') { e.preventDefault(); openQuiz(); return; }
      if (t.hasAttribute('data-resource')) { openArticle(Number(t.getAttribute('data-resource'))); return; }
      if (t.hasAttribute('data-product-request')) { addToQuote(t.getAttribute('data-product-request')); /* fall through to close-modal below */ }
      if (t.hasAttribute('data-quote-remove')) { e.preventDefault(); removeFromQuote(t.getAttribute('data-quote-remove')); return; }
      if (t.hasAttribute('data-fave')) { e.preventDefault(); e.stopPropagation(); toggleFave(t.getAttribute('data-fave')); return; }
      if (t.hasAttribute('data-share')) { e.preventDefault(); e.stopPropagation(); shareProduct(t.getAttribute('data-share')); return; }
      if (t.hasAttribute('data-compare')) { e.preventDefault(); e.stopPropagation(); toggleCompare(t.getAttribute('data-compare')); return; }
      if (t.hasAttribute('data-faves-only')) {
        catalogState.favesOnly = !catalogState.favesOnly;
        if (catalogState.favesOnly) catalogState.category = 'All';
        renderCatalog(); return;
      }
      if (t.hasAttribute('data-product')) { openProduct(t.getAttribute('data-product')); return; }
      if (t.hasAttribute('data-category')) {
        catalogState.favesOnly = false;
        catalogState.category = t.getAttribute('data-category');
        $$('#catalog-filters .chip').forEach((c) => c.setAttribute('aria-pressed', c === t));
        applyCatalogFilter(); return;
      }
      if (t.hasAttribute('data-filter')) { // from mega menu
        catalogState.category = t.getAttribute('data-filter');
        renderCatalog();
        return;
      }
      if (t.hasAttribute('data-quiz-option')) { quizSelect(t.getAttribute('data-quiz-option')); return; }
      if (t.hasAttribute('data-quiz-next')) { quiz.step++; renderQuizStep(); return; }
      if (t.hasAttribute('data-quiz-back')) { quiz.step = Math.max(-1, quiz.step - 1); renderQuizStep(); return; }
      if (t.hasAttribute('data-quiz-restart')) { quiz.step = -1; quiz.answers = {}; renderQuizStep(); return; }
      if (t.hasAttribute('data-close-modal') || t.hasAttribute('data-modal-close')) {
        const m = t.closest('.modal'); if (m) closeModal(m);
      }
      if (t.hasAttribute('data-close-drawer')) { closeDrawer(); }
    });

    // keyboard activation for card "buttons"
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-product]')) {
        e.preventDefault(); openProduct(e.target.getAttribute('data-product'));
      }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-resource]')) {
        e.preventDefault(); openArticle(Number(e.target.getAttribute('data-resource')));
      }
      if (e.key === 'Escape') { closeAllModals(); closeDrawer(); }
    });

    // modal backdrop + close buttons
    $$('.modal').forEach((m) => {
      $('.modal__backdrop', m)?.addEventListener('click', () => closeModal(m));
      $('.modal__close', m)?.addEventListener('click', () => closeModal(m));
    });

    // theme
    $('#theme-toggle')?.addEventListener('click', toggleTheme);

    // mobile drawer
    $('#nav-toggle')?.addEventListener('click', toggleDrawer);

    // search
    const search = $('#catalog-search');
    if (search) {
      let to;
      search.addEventListener('input', (e) => {
        clearTimeout(to);
        to = setTimeout(() => { catalogState.query = e.target.value; applyCatalogFilter(); }, 140);
      });
    }

    // contact + newsletter forms (demo: no backend)
    $('#contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      track('lead_submit', { products: quote.ids.slice() });
      e.target.reset();
      clearQuote();
      toast('Thanks! We’ll be in touch shortly.');
    });
    $('#newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault(); e.target.reset(); track('newsletter_signup'); toast('You’re subscribed — welcome aboard!');
    });

    // quote basket clear
    $('#quote-clear')?.addEventListener('click', clearQuote);

    // back to top
    $('#to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // compare tray
    $('#compare-open')?.addEventListener('click', openCompare);
    $('#compare-clear')?.addEventListener('click', clearCompare);
  }

  function toggleDrawer() {
    const d = $('#mobile-drawer');
    const open = d.getAttribute('data-open') === 'true';
    d.setAttribute('data-open', String(!open));
    $('#nav-toggle').innerHTML = !open ? icon('close') : icon('menu');
    document.body.style.overflow = !open ? 'hidden' : '';
  }
  function closeDrawer() {
    const d = $('#mobile-drawer');
    if (d.getAttribute('data-open') === 'true') {
      d.setAttribute('data-open', 'false');
      $('#nav-toggle').innerHTML = icon('menu');
      document.body.style.overflow = '';
    }
  }

  /* ====================================================================
     Boot
     ==================================================================== */
  function init() {
    initTheme();
    renderAnnouncement();
    renderHeader();
    renderHero();
    renderTrust();
    renderFeatures();
    renderCatalog();
    renderPricing();
    renderTestimonials();
    renderResources();
    renderFaq();
    renderCtaBand();
    renderContact();
    renderRecentlyViewed();
    renderFooter();
    updateFaveCount();
    $('#nav-toggle').innerHTML = icon('menu');
    $('#theme-toggle').innerHTML = icon('sun') + icon('moon');
    $('#to-top').innerHTML = icon('chevronUp');
    renderThemeSwitcher();
    renderCompareTray();
    renderQuote();
    injectStructuredData();
    initEvents();
    initScroll();
    initCounters();
    initShortcuts();
    initCookies();

    // routing: handle initial hash + future changes (deep links / share / back button)
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
