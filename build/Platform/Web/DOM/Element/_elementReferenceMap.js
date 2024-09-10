const tagNameToElementReferenceMap = new Map();
export function GetElementReference(tagName) {
  const ref = tagNameToElementReferenceMap.get(tagName) || document.createElement(tagName).constructor;
  if (!tagNameToElementReferenceMap.has(tagName)) {
    tagNameToElementReferenceMap.set(tagName, ref);
  }
  return ref;
}
