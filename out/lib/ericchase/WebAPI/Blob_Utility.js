import { U8StreamReadSome } from "../Algorithm/Stream.js";
import { U8 } from "../Algorithm/Uint8Array.js";
import { Compat_Blob } from "./Blob.js";
export function ReadSome(blob, count) {
  const stream = Compat_Blob(blob).stream();
  return stream ? U8StreamReadSome(stream ?? U8(), count) : Promise.resolve(U8());
}
