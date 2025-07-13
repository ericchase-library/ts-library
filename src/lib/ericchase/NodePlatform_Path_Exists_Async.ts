import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Path_Exists_Async(path: string): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  try {
    await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path));
    return true;
  } catch {}
  return false;
}
