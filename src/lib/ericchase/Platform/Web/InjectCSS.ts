export function InjectCSS(styles: string) {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(styles);
  document.adoptedStyleSheets.push(stylesheet);
  return stylesheet;
}
