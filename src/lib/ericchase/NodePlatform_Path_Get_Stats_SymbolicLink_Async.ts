import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Path_Get_Stats_SymbolicLink_Async(path: string): Promise<NODE_FS.Stats> {
  path = NODE_PATH.normalize(path);
  return await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.lstat(path));
}
