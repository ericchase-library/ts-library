import { GetElementReference } from './_elementReferenceMap.js';
export function $$(tagName, selector, source = document.documentElement, includeSourceInMatch = false) {
  const elements = [];
  if (includeSourceInMatch === true && source instanceof GetElementReference(tagName) && source.matches(selector)) {
    elements.push(source);
  }
  elements.push(...source.querySelectorAll(selector));
  for (const element of elements) {
    if (!(element instanceof GetElementReference(tagName))) {
      throw `Query: \`${selector}\`. Element not of type: \`${tagName}\`. ${element}`;
    }
  }
  return elements;
}
export const QuerySelectorAll = $$;
