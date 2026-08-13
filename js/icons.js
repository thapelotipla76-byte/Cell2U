/* Cell2U inline icon set — no external icon dependency required. */
(function () {
  const paths = {
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    heart: '<path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    shield: '<path d="M12 22s8-3.7 8-10V5l-8-3-8 3v7c0 6.3 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M20 11a8.1 8.1 0 0 0-14.6-3L3 11"/><path d="M3 5v6h6M4 13a8.1 8.1 0 0 0 14.6 3L21 13"/><path d="M21 19v-6h-6"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1 8 4.5-2.5 4.5 2.5-1-8"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 1-2ZM20 14h-3v5h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-1-2Z"/>',
    watch: '<circle cx="12" cy="12" r="6"/><path d="M9 2h6l1 4M9 22h6l1-4M12 9v3l2 1"/>',
    plug: '<path d="M8 3v5M16 3v5M6 8h12v2a6 6 0 0 1-12 0V8ZM12 16v5"/>',
    tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M10 18h4"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8H8.5a2.5 2.5 0 1 1 2.5-2.5V8ZM12 8h3.5A2.5 2.5 0 1 0 13 5.5V8Z"/>',
    box: '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    message: '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3-.6L4 20l1.6-4A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrowUp: '<path d="m18 15-6-6-6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
    sparkles: '<path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/>',
    smartphone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
    headphonesAlt: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 1-2ZM20 14h-3v5h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-1-2Z"/>'
  };

  window.icon = function (name, className) {
    const body = paths[name] || paths.sparkles;
    return `<svg class="icon ${className || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  };

  window.renderIcons = function (root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      el.outerHTML = window.icon(el.getAttribute('data-icon'), el.getAttribute('class') || '');
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.renderIcons(document);
  });
})();

// Icon names used by this storefront include: zap, search, heart, cart, menu, x, truck,
// lock, shield, refresh, award, card, star, phone, headphones, watch, plug, tablet, gift,
// box, mail, message, clock, map, check, arrowUp, arrowRight, arrowLeft, plus, minus, sliders,
// sparkles, smartphone, and headphonesAlt.
