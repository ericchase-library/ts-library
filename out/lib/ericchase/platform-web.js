import { Core } from "./core.js";

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
      list.push(datatransferitem__classcompat_datatransferitem(item));
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
function css__toadjustedem(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return 16 / fontSizePx * em;
}
function css__torelativeem(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * em;
}
function css__torelativepx(px, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * px;
}
function dom__class_attributeobserver({
  options = { attributeOldValue: true, subtree: true },
  source = document.documentElement
}) {
  return new ClassDomAttributeObserver({ options, source });
}
function dom__class_characterdataobserver({ options = { characterDataOldValue: true, subtree: true }, source = document.documentElement }) {
  return new ClassDomCharacterDataObserver({ options, source });
}
function dom__class_childlistobserver({ options = { subtree: true }, source = document.documentElement }) {
  return new ClassDomChildListObserver({ options, source });
}
function dom__class_elementaddedobserver({ includeExistingElements = true, options = { subtree: true }, selector, source = document.documentElement }) {
  return new ClassDomElementAddedObserver({ includeExistingElements, options, selector, source });
}
function dom__injectcss(styles) {
  const stylesheet = new CSSStyleSheet;
  stylesheet.replaceSync(styles);
  document.adoptedStyleSheets.push(stylesheet);
  return stylesheet;
}
function dom__injectscript(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
function blob__classcompat_blob(blob) {
  return new ClassCompatBlob(blob);
}
function blob__async_readsome(blob, count) {
  const stream = blob__classcompat_blob(blob).stream();
  if (stream !== undefined) {
    return Core.Stream.Uint8.Async_ReadSome(stream, count);
  }
  return Promise.resolve(new Uint8Array);
}
function datatransfer__classcompat_datatransfer(dataTransfer) {
  return new ClassCompatDataTransfer(dataTransfer);
}
async function* datatransfer__asyncgen_getentries(dataTransfer) {
  const entries = [];
  for (const item of dataTransfer.items) {
    const entry = datatransferitem__classcompat_datatransferitem(item).getAsEntry();
    if (entry !== undefined) {
      entries.push(entry);
    }
  }
  for (let index = 0;index < entries.length; index++) {
    const entry = entries[index];
    yield entry;
    if (entry.isDirectory === true) {
      entries.push(...await filesystementry__async_readdirectoryentries(entry));
    }
  }
}
async function* datatransfer__asyncgen_getfiles(dataTransfer) {
  for await (const entry of datatransfer__asyncgen_getentries(dataTransfer)) {
    if (entry.isFile === true) {
      yield await filesystementry__async_getfile(entry);
    }
  }
}
function datatransferitem__classcompat_datatransferitem(item) {
  return new ClassCompatDataTransferItem(item);
}
function file__classcompat_file(file) {
  return new ClassCompatFile(file);
}
function filesystementry__async_getfile(entry) {
  return new Promise((resolve, reject) => {
    entry.file((file) => {
      resolve(file);
    }, (error) => {
      reject(error);
    });
  });
}
async function filesystementry__async_readdirectoryentries(entry) {
  const reader = entry.createReader();
  const allentries = [];
  let done = false;
  while (done === false) {
    const entries = await new Promise((resolve, reject) => {
      reader.readEntries((entries) => {
        resolve(entries);
      }, (error) => {
        reject(error);
      });
    });
    if (entries.length === 0) {
      break;
    }
    allentries.push(...entries);
  }
  return allentries;
}
function htmlinputelement__webkitdirectoryissupported() {
  return utility__deviceismobile() ? false : true;
}
function node__class_nodereference(node) {
  return new ClassNodeReference(node);
}
function node__class_nodelistreference(nodes) {
  return new ClassNodeReferenceList(nodes);
}
function node__selectelement(selector) {
  return node__class_nodereference(document.querySelector(selector));
}
function node__selectelements(...selectors) {
  return node__class_nodelistreference(document.querySelectorAll(selectors.join(",")));
}
function utility__deviceismobile() {
  return /android|iphone|mobile/i.test(window.navigator.userAgent);
}
function utility__download(data, filename) {
  const dataurl = (() => {
    if (data.blob !== undefined) {
      return URL.createObjectURL(data.blob);
    }
    if (data.bytes !== undefined) {
      return URL.createObjectURL(new Blob([data.bytes], { type: "application/octet-stream;charset=utf-8" }));
    }
    if (data.json !== undefined) {
      return URL.createObjectURL(new Blob([data.json], { type: "application/json;charset=utf-8" }));
    }
    if (data.text !== undefined) {
      return URL.createObjectURL(new Blob([data.text], { type: "text/plain;charset=utf-8" }));
    }
    if (data.url !== undefined) {
      return data.url;
    }
  })();
  if (dataurl !== undefined) {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", filename);
    anchor.setAttribute("href", dataurl);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
function utility__openwindow(url, onLoad, onUnload) {
  const proxy = window.open(url, "_blank");
  if (proxy) {
    if (onLoad) {
      proxy.addEventListener("load", (event) => {
        onLoad(proxy, event);
      });
    }
    if (onUnload) {
      proxy.addEventListener("unload", (event) => {
        onUnload(proxy, event);
      });
    }
  }
}
export var WebPlatform;
((WebPlatform) => {
  let CSS;
  ((CSS) => {
    CSS.ToAdjustedEm = css__toadjustedem;
    CSS.ToRelativeEm = css__torelativeem;
    CSS.ToRelativePx = css__torelativepx;
  })(CSS = WebPlatform.CSS ||= {});
  let DOM;
  ((DOM) => {
    DOM.Class_AttributeObserver = dom__class_attributeobserver;
    DOM.Class_CharacterDataObserver = dom__class_characterdataobserver;
    DOM.Class_ChildListObserver = dom__class_childlistobserver;
    DOM.Class_ElementAddedObserver = dom__class_elementaddedobserver;
    DOM.InjectCSS = dom__injectcss;
    DOM.InjectScript = dom__injectscript;
  })(DOM = WebPlatform.DOM ||= {});
  let Blob;
  ((Blob) => {
    Blob.ClassCompat_Blob = blob__classcompat_blob;
    Blob.Async_ReadSome = blob__async_readsome;
  })(Blob = WebPlatform.Blob ||= {});
  let DataTransfer;
  ((DataTransfer) => {
    DataTransfer.AsyncGen_GetEntries = datatransfer__asyncgen_getentries;
    DataTransfer.AsyncGen_GetFiles = datatransfer__asyncgen_getfiles;
    DataTransfer.ClassCompat_DataTransfer = datatransfer__classcompat_datatransfer;
  })(DataTransfer = WebPlatform.DataTransfer ||= {});
  let DataTransferItem;
  ((DataTransferItem) => {
    DataTransferItem.ClassCompat_DataTransferItem = datatransferitem__classcompat_datatransferitem;
  })(DataTransferItem = WebPlatform.DataTransferItem ||= {});
  let File;
  ((File) => {
    File.ClassCompat_File = file__classcompat_file;
  })(File = WebPlatform.File ||= {});
  let FileSystemEntry;
  ((FileSystemEntry) => {
    FileSystemEntry.Async_GetFile = filesystementry__async_getfile;
    FileSystemEntry.Async_ReadDirectoryEntries = filesystementry__async_readdirectoryentries;
  })(FileSystemEntry = WebPlatform.FileSystemEntry ||= {});
  let HTMLInputElement;
  ((HTMLInputElement) => {
    HTMLInputElement.WebkitDirectoryIsSupported = htmlinputelement__webkitdirectoryissupported;
  })(HTMLInputElement = WebPlatform.HTMLInputElement ||= {});
  let Node;
  ((Node) => {
    Node.Class_NodeReference = node__class_nodereference;
    Node.Class_NodeListReference = node__class_nodelistreference;
    Node.SelectElement = node__selectelement;
    Node.SelectElements = node__selectelements;
  })(Node = WebPlatform.Node ||= {});
  let Utility;
  ((Utility) => {
    Utility.DeviceIsMobile = utility__deviceismobile;
    Utility.Download = utility__download;
    Utility.OpenWindow = utility__openwindow;
  })(Utility = WebPlatform.Utility ||= {});
})(WebPlatform ||= {});
