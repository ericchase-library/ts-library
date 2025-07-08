import { Core_Stream_Uint8_Compare_Async } from './Core_Stream_Uint8_Compare_Async.js';
import { NODE_PATH } from './NodePlatform.js';

export function BunPlatform_File_Compare_Async(frompath: string, topath: string): Promise<boolean> {
  frompath = NODE_PATH.normalize(frompath);
  topath = NODE_PATH.normalize(topath);
  return Core_Stream_Uint8_Compare_Async(Bun.file(frompath).stream(), Bun.file(topath).stream());
}
