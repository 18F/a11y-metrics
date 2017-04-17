(() => {
  // Set TARGETS to the output of get-contrast-targets.js.
  const TARGETS = [{"selector":"#search > .results > .container > div:nth-of-type(1) > .filter-container.columns.three > .filter-block > .filter.filter-schedule > .filter-more-info","summary":"Fix any of the following:\n  Element has insufficient color contrast of 4.45 (foreground color: #17779f, background color: #f1f1f1, font size: 8.4pt, font weight: normal)"},{"selector":"#search > .results > .container > div:nth-of-type(1) > .filter-container.columns.three > .filter-block > .filter.contract-year > .fieldset-inputs > .filter-more-info > .tooltipstered > a","summary":"Fix any of the following:\n  Element has insufficient color contrast of 4.45 (foreground color: #17779f, background color: #f1f1f1, font size: 8.4pt, font weight: normal)"}];

  const style = document.createElement('style');

  style.textContent = `
  @keyframes a11yHighlight {
    from {
      border-color: rgba(255, 0, 0, 0.25);
    }

    to {
      border-color: rgba(255, 0, 0, 1.0);
    }
  }
  `;

  document.head.appendChild(style);

  TARGETS.forEach(({ selector, summary }) => {
    const el = document.querySelector(selector);

    if (!el) return;

    let { top, left, width, height } = el.getBoundingClientRect();
    const border = 2;
    const padding = 2;
    const overlay = document.createElement('div');

    top += window.scrollY;
    left += window.scrollX;

    top -= (border + padding);
    left -= (border + padding);
    width += 2 * (border + padding);
    height += 2 * (border + padding);

    overlay.setAttribute('title', summary);
    overlay.setAttribute('style',
      `
      animation-duration: 0.5s;
      animation-name: a11yHighlight;
      animation-iteration-count: infinite;
      animation-direction: alternate;
      position: absolute;
      box-sizing: border-box;
      border: ${border}px solid red;
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${height}px;
      `);

    document.body.appendChild(overlay);
  });
})();
