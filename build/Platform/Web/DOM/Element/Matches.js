import { GetElementReference } from './_elementReferenceMap.js';
export function Matches(tagName, selector, source) {
  return source instanceof GetElementReference(tagName) && source.matches(selector);
}
