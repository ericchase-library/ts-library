import { GetElementReference } from './_elementReferenceMap.js';
export function $(tagName, selector, source = document.documentElement) {
  const element = source.querySelector(selector);
  if (element instanceof GetElementReference(tagName)) {
    return element;
  }
  throw `Query: \`${selector}\`. Element not of type: \`${tagName}\`. ${element}`;
}
export const QuerySelector = $;
