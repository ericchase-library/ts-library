export function WebPlatform_Utility_Shadow_QuerySelector_Chain(source, ...selectors) {
  if (selectors.length > 0) {
    for (const selector of selectors) {
      if (source instanceof Document || source instanceof DocumentFragment || source instanceof ShadowRoot) {
        const match = source.querySelector(selector);
        if (match !== null) {
          source = match;
          continue;
        }
      } else if (source instanceof Element) {
        if (source.shadowRoot !== null) {
          const match = source.shadowRoot.querySelector(selector);
          if (match !== null) {
            source = match;
            continue;
          }
        }
        const match = source.querySelector(selector);
        if (match !== null) {
          source = match;
          continue;
        }
      }
      return;
    }
    if (source instanceof Document || source instanceof DocumentFragment || source instanceof Element) {
      return source;
    }
  }
  return;
}
