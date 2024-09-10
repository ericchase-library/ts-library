export class CNodeRef {
  node;
  constructor(node) {
    if (node === null) {
      throw new ReferenceError('Reference is null.');
    }
    if (node === undefined) {
      throw new ReferenceError('Reference is undefined.');
    }
    this.node = node;
  }
  as(constructor) {
    if (this.node instanceof constructor) return this.node;
    throw new TypeError(`Reference node is not ${constructor}`);
  }
  is(constructor) {
    return this.node instanceof constructor;
  }
  passAs(constructor, fn) {
    if (this.node instanceof constructor) {
      fn(this.node);
    }
  }
  tryAs(constructor) {
    if (this.node instanceof constructor) {
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
    return this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    return this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
export function NodeRef(node) {
  return new CNodeRef(node);
}

export class CNodeListRef extends Array {
  constructor(nodes) {
    if (nodes === null) {
      throw new ReferenceError('Reference list is null.');
    }
    if (nodes === undefined) {
      throw new ReferenceError('Reference list is undefined.');
    }
    super();
    for (const node of Array.from(nodes)) {
      try {
        this.push(new CNodeRef(node));
      } catch (_) {}
    }
  }
  as(constructor) {
    return this.filter((ref) => ref.is(constructor)).map((ref) => ref.as(constructor));
  }
  passEachAs(constructor, fn) {
    for (const ref of this) {
      ref.passAs(constructor, fn);
    }
  }
}
export function NodeListRef(nodes) {
  return new CNodeListRef(nodes);
}
