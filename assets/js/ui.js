(() => {
  const icon = (name, className = '') => `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

  function heading(eyebrow, title, note, actions = '') {
    return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="heading-note">${note}</p></div><div class="heading-actions">${actions}</div></div>`;
  }
  Sora.icon = icon;
  Sora.heading = heading;
})();
