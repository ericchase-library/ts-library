import { HasMethod, HasProperty } from "../Utility/Guard.js";
export function Compat_Blob(blob) {
  return {
    get size() {
      return HasProperty(blob, "size") ? blob.size : undefined;
    },
    get type() {
      return HasProperty(blob, "type") ? blob.type : undefined;
    },
    arrayBuffer() {
      return HasMethod(blob, "arrayBuffer") ? blob.arrayBuffer() : undefined;
    },
    bytes() {
      if (HasMethod(blob, "bytes")) {
        return blob.bytes() ?? undefined;
      }
      if (HasMethod(blob, "arrayBuffer")) {
        return (async () => {
          return new Uint8Array(await blob.arrayBuffer());
        })();
      }
    },
    slice() {
      if (HasMethod(blob, "slice")) {
        return blob.slice() ?? undefined;
      }
    },
    stream() {
      if (HasMethod(blob, "stream")) {
        return blob.stream() ?? undefined;
      }
    },
    text() {
      if (HasMethod(blob, "text")) {
        return blob.text() ?? undefined;
      }
    }
  };
}
