export function InjectCSS(styles) {
  const stylesheet = new CSSStyleSheet;
  stylesheet.replaceSync(styles);
  document.adoptedStyleSheets.push(stylesheet);
  return stylesheet;
}
