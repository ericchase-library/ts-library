import { NODE_PATH } from './NodePlatform.js';

export function BunPlatform_File_ReadBytes_Async(path: string): Promise<Uint8Array> {
  path = NODE_PATH.normalize(path);
  return Bun.file(path).bytes();
}
