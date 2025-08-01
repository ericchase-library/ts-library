import { Async_Core_Stream_Uint8_Compare } from "./Core_Stream_Uint8_Compare.js";
import { NODE_PATH } from "./NodePlatform.js";
export async function Async_BunPlatform_File_Compare(from_path, to_path) {
  from_path = NODE_PATH.normalize(from_path);
  to_path = NODE_PATH.normalize(to_path);
  try {
    return { value: await Async_Core_Stream_Uint8_Compare(Bun.file(from_path).stream(), Bun.file(to_path).stream()) };
  } catch (error) {
    return { error, value: false };
  }
}
