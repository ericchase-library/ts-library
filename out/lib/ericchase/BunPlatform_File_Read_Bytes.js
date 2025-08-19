import { NODE_PATH } from './NodePlatform.js';
export async function Async_BunPlatform_File_Read_Bytes(path) {
  path = NODE_PATH.normalize(path);
  try {
    return { value: Uint8Array.from(await Bun.file(path).bytes()) };
  } catch (error) {
    return { error };
  }
}
