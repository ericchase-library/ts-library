import { NODE_PATH } from './NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from './NodePlatform_Directory_Create_Async.js';

export async function BunPlatform_File_WriteText_Async(path: string, text: string, createpath = true): Promise<number> {
  path = NODE_PATH.normalize(path);
  const { dir } = NODE_PATH.parse(path);
  if (createpath === true) {
    await NodePlatform_Directory_Create_Async(dir);
  }
  return Bun.write(path, text);
}
