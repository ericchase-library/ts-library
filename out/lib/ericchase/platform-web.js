import { WebPlatform_DataTransferItem_ClassCompat_DataTransferItem } from "./api.platform-web.js";

class ClassCompatBlob {
  blob;
  constructor(blob) {
    this.blob = blob;
  }
  get size() {
    return this.blob.size ?? undefined;
  }
  get type() {
    return this.blob.type ?? undefined;
  }
  async arrayBuffer() {
    return await this.blob.arrayBuffer?.() ?? undefined;
  }
  async bytes() {
    return await this.blob.bytes?.() ?? await this.blob.arrayBuffer?.().then((buffer) => buffer ? new Uint8Array(buffer) : undefined) ?? undefined;
  }
  slice() {
    return this.blob.slice?.() ?? undefined;
  }
  stream() {
    return this.blob.stream?.() ?? undefined;
  }
  async text() {
    return await this.blob.text?.() ?? undefined;
  }
}

class ClassCompatDataTransfer {
  dataTransfer;
  constructor(dataTransfer) {
    this.dataTransfer = dataTransfer;
  }
  items() {
    const list = [];
    for (const item of this.dataTransfer.items) {
      list.push(WebPlatform_DataTransferItem_ClassCompat_DataTransferItem(item));
    }
    return list;
  }
}

class ClassCompatDataTransferItem {
  item;
  constructor(item) {
    this.item = item;
  }
  getAsEntry() {
    if (this.item.kind === "file") {
      return this.item.getAsEntry?.() ?? this.item.webkitGetAsEntry?.() ?? undefined;
    }
  }
  getAsFile() {
    if (this.item.kind === "file") {
      return this.item.getAsFile?.() ?? undefined;
    }
  }
  getAsString(callback) {
    if (this.item.kind === "string") {
      this.item.getAsString?.(callback);
    }
  }
}

class ClassCompatFile {
  file;
  constructor(file) {
    this.file = file;
  }
  get relativePath() {
    return this.file.relativePath ?? this.file.webkitRelativePath ?? undefined;
  }
}

class ClassDomAttributeObserver {
  constructor({
    source = document.documentElement,
    options = { attributeOldValue: true, subtree: true }
  }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(source, {
      attributes: true,
      attributeFilter: options.attributeFilter,
      attributeOldValue: options.attributeOldValue ?? true,
      subtree: options.subtree ?? true
    });
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  subscriptionSet = new Set;
  send(record) {
    for (const callback of this.subscriptionSet) {
      callback(record, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
}

class ClassDomCharacterDataObserver {
  constructor({ source = document.documentElement, options = { characterDataOldValue: true, subtree: true } }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(source, {
      characterData: true,
      characterDataOldValue: options.characterDataOldValue ?? true,
      subtree: options.subtree ?? true
    });
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  subscriptionSet = new Set;
  send(record) {
    for (const callback of this.subscriptionSet) {
      callback(record, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
}

class ClassDomChildListObserver {
  constructor({ source = document.documentElement, options = { subtree: true } }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(source, {
      childList: true,
      subtree: options.subtree ?? true
    });
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  subscriptionSet = new Set;
  send(record) {
    for (const callback of this.subscriptionSet) {
      callback(record, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
}

class ClassDomElementAddedObserver {
  constructor({ source = document.documentElement, options = { subtree: true }, selector, includeExistingElements = true }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        if (record.target instanceof Element && record.target.matches(selector)) {
          this.send(record.target);
        }
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
          if (treeWalker.currentNode.matches(selector)) {
            this.send(treeWalker.currentNode);
          }
        }
      }
    });
    this.mutationObserver.observe(source, {
      childList: true,
      subtree: options.subtree ?? true
    });
    if (includeExistingElements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.matches(selector)) {
          this.send(treeWalker.currentNode);
        }
      }
    }
  }
  disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    let abort = false;
    for (const element of this.matchSet) {
      callback(element, () => {
        this.subscriptionSet.delete(callback);
        abort = true;
      });
      if (abort)
        return () => {};
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  matchSet = new Set;
  subscriptionSet = new Set;
  send(element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        callback(element, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}

class ClassNodeReference {
  node;
  constructor(node) {
    if (node === null) {
      throw new ReferenceError("Reference is null.");
    }
    if (node === undefined) {
      throw new ReferenceError("Reference is undefined.");
    }
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref)
      return this.node;
    throw new TypeError(`Reference node is not ${constructor_ref}`);
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

class ClassNodeReferenceList extends Array {
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
        this.push(new ClassNodeReference(node));
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

export {
  ClassCompatBlob,
  ClassCompatDataTransfer,
  ClassCompatDataTransferItem,
  ClassCompatFile,
  ClassDomAttributeObserver,
  ClassDomCharacterDataObserver,
  ClassDomChildListObserver,
  ClassDomElementAddedObserver,
  ClassNodeReference,
  ClassNodeReferenceList
};
