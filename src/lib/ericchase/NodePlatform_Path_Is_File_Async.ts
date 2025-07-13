import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Path_Is_File_Async(path: string): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  try {
    return (await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path))).isFile();
  } catch (error) {}
  return false;
}
