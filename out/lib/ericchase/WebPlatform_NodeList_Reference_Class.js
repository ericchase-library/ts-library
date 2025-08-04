import { WebPlatform_Node_Reference_Class } from "./WebPlatform_Node_Reference_Class.js";

export class Class_WebPlatform_NodeList_Reference_Class extends Array {
  constructor(nodes) {
    if (nodes === null) {
      throw new ReferenceError("Reference list is null.");
    }
    if (nodes === undefined) {
      throw new ReferenceError("Reference list is undefined.");
    }
    super();
    for (const node of Array.from(nodes)) {
      try {
        this.push(WebPlatform_Node_Reference_Class(node));
      } catch (_) {}
    }
  }
  as(constructor_ref) {
    return this.filter((ref) => ref.is(constructor_ref)).map((ref) => ref.as(constructor_ref));
  }
  passEachAs(constructor_ref, fn) {
    for (const ref of this) {
      ref.passAs(constructor_ref, fn);
    }
  }
}
export function WebPlatform_NodeList_Reference_Class(nodes) {
  return new Class_WebPlatform_NodeList_Reference_Class(nodes);
}
export function WebPlatform_Node_QuerySelectorAll(...selectors) {
  return WebPlatform_NodeList_Reference_Class(document.querySelectorAll(selectors.join(",")));
}
