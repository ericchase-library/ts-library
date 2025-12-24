// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}

// src/lib/ericchase/WebPlatform_Utility_Ancestor_Node.ts
function WebPlatform_Utility_Get_Ancestor_List(node) {
  const list = [];
  let parent = node.parentNode;
  while (parent !== null) {
    list.push(parent);
    parent = parent.parentNode;
  }
  return list.toReversed();
}
function WebPlatform_Utility_Get_Closest_Common_Ancestor(...nodes) {
  if (nodes.length > 0) {
    const ancestor_lists = [];
    for (const node of nodes) {
      ancestor_lists.push(WebPlatform_Utility_Get_Ancestor_List(node));
    }
    let inner_list_min_length = ancestor_lists[0].length;
    for (let i = 1; i < ancestor_lists.length; i++) {
      if (ancestor_lists[i].length < inner_list_min_length) {
        inner_list_min_length = ancestor_lists[i].length;
      }
    }
    let current_common_ancestor = undefined;
    for (let inner_list_i = 0; inner_list_i < inner_list_min_length; inner_list_i++) {
      let is_common = true;
      for (let ancestor_lists_i = 1; ancestor_lists_i < ancestor_lists.length; ancestor_lists_i++) {
        if (ancestor_lists[0][inner_list_i] !== ancestor_lists[ancestor_lists_i][inner_list_i]) {
          is_common = false;
          break;
        }
      }
      if (is_common === true) {
        current_common_ancestor = ancestor_lists[0][inner_list_i];
      }
    }
    return current_common_ancestor;
  }
}

// src/test-web-platform/WebPlatform_Utility_Get_Closest_Common_Ancestor.module.ts
var target1 = WebPlatform_Node_Reference_Class(document.querySelector('#target-1')).as(HTMLDivElement);
var target2 = WebPlatform_Node_Reference_Class(document.querySelector('#target-2')).as(HTMLDivElement);
var target3 = WebPlatform_Node_Reference_Class(document.querySelector('#target-3')).as(HTMLDivElement);
console.log(WebPlatform_Utility_Get_Closest_Common_Ancestor(target1, target2, target3));
console.log(WebPlatform_Utility_Get_Closest_Common_Ancestor(target2, target3));
