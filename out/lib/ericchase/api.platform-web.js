import { Core_Stream_Uint8_Async_ReadSome } from "./api.core.js";
import { ClassCompatBlob, ClassCompatDataTransfer, ClassCompatDataTransferItem, ClassCompatFile, ClassDomAttributeObserver, ClassDomCharacterDataObserver, ClassDomChildListObserver, ClassDomElementAddedObserver, ClassNodeListReference, ClassNodeReference } from "./platform-web.js";
export function WebPlatform_Blob_Async_ReadSome(blob, count) {
  const stream = WebPlatform_Blob_ClassCompat_Blob(blob).stream();
  if (stream !== undefined) {
    return Core_Stream_Uint8_Async_ReadSome(stream, count);
  }
  return Promise.resolve(new Uint8Array);
}
export function WebPlatform_Blob_ClassCompat_Blob(blob) {
  return new ClassCompatBlob(blob);
}
export function WebPlatform_CSS_ToAdjustedEm(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return 16 / fontSizePx * em;
}
export function WebPlatform_CSS_ToRelativeEm(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * em;
}
export function WebPlatform_CSS_ToRelativePx(px, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * px;
}
export async function* WebPlatform_DataTransfer_AsyncGen_GetEntries(dataTransfer) {
  const entries = [];
  for (const item of dataTransfer.items) {
    const entry = WebPlatform_DataTransferItem_ClassCompat_DataTransferItem(item).getAsEntry();
    if (entry !== undefined) {
      entries.push(entry);
    }
  }
  for (let index = 0;index < entries.length; index++) {
    const entry = entries[index];
    yield entry;
    if (entry.isDirectory === true) {
      entries.push(...await WebPlatform_FileSystemEntry_Async_ReadDirectoryEntries(entry));
    }
  }
}
export async function* WebPlatform_DataTransfer_AsyncGen_GetFiles(dataTransfer) {
  for await (const entry of WebPlatform_DataTransfer_AsyncGen_GetEntries(dataTransfer)) {
    if (entry.isFile === true) {
      yield await WebPlatform_FileSystemEntry_Async_GetFile(entry);
    }
  }
}
export function WebPlatform_DataTransfer_ClassCompat_DataTransfer(dataTransfer) {
  return new ClassCompatDataTransfer(dataTransfer);
}
export function WebPlatform_DataTransferItem_ClassCompat_DataTransferItem(item) {
  return new ClassCompatDataTransferItem(item);
}
export function WebPlatform_DOM_Class_AttributeObserver({ options = { attributeOldValue: true, subtree: true }, source = document.documentElement }) {
  return new ClassDomAttributeObserver({ options, source });
}
export function WebPlatform_DOM_Class_CharacterDataObserver({ options = { characterDataOldValue: true, subtree: true }, source = document.documentElement }) {
  return new ClassDomCharacterDataObserver({ options, source });
}
export function WebPlatform_DOM_Class_ChildListObserver({ options = { subtree: true }, source = document.documentElement }) {
  return new ClassDomChildListObserver({ options, source });
}
export function WebPlatform_DOM_Class_ElementAddedObserver({ includeExistingElements = true, options = { subtree: true }, selector, source = document.documentElement }) {
  return new ClassDomElementAddedObserver({ includeExistingElements, options, selector, source });
}
export function WebPlatform_DOM_InjectCSS(styles) {
  const stylesheet = new CSSStyleSheet;
  stylesheet.replaceSync(styles);
  document.adoptedStyleSheets.push(stylesheet);
  return stylesheet;
}
export function WebPlatform_DOM_InjectScript(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
export function WebPlatform_File_ClassCompat_File(file) {
  return new ClassCompatFile(file);
}
export function WebPlatform_FileSystemEntry_Async_GetFile(entry) {
  return new Promise((resolve, reject) => {
    entry.file((file) => {
      resolve(file);
    }, (error) => {
      reject(error);
    });
  });
}
export async function WebPlatform_FileSystemEntry_Async_ReadDirectoryEntries(entry) {
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
export function WebPlatform_HTMLInputElement_WebkitDirectoryIsSupported() {
  return WebPlatform_Utility_DeviceIsMobile() ? false : true;
}
export function WebPlatform_Node_Class_NodeListReference(nodes) {
  return new ClassNodeListReference(nodes);
}
export function WebPlatform_Node_Class_NodeReference(node) {
  return new ClassNodeReference(node);
}
export function WebPlatform_Node_SelectElement(selector) {
  return WebPlatform_Node_Class_NodeReference(document.querySelector(selector));
}
export function WebPlatform_Node_SelectElements(...selectors) {
  return WebPlatform_Node_Class_NodeListReference(document.querySelectorAll(selectors.join(",")));
}
export function WebPlatform_Utility_DeviceIsMobile() {
  return /android|iphone|mobile/i.test(window.navigator.userAgent);
}
export function WebPlatform_Utility_Download(data, filename) {
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
export function WebPlatform_Utility_OpenWindow(url, onLoad, onUnload) {
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
