import { BunPlatform_File_Compare_Async } from './BunPlatform_File_Compare_Async.js';
import { BunPlatform_File_Delete_Async } from './BunPlatform_File_Delete_Async.js';
import { NODE_PATH } from './NodePlatform.js';

export async function BunPlatform_File_Move_Async(frompath: string, topath: string, overwrite = false): Promise<boolean> {
  frompath = NODE_PATH.normalize(frompath);
  topath = NODE_PATH.normalize(topath);
  if (frompath === topath) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(topath).exists()) === true) {
    return false;
  }
  await Bun.write(Bun.file(topath), Bun.file(frompath));
  if ((await BunPlatform_File_Compare_Async(frompath, topath)) === false) {
    return false;
  }
  return BunPlatform_File_Delete_Async(frompath);
}
