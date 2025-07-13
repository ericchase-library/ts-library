import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Directory_Create_Async(path: string, recursive = true): Promise<boolean> {
  path = NODE_PATH.normalize(path);

  // check if path exists
  try {
    if ((await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path))).isDirectory() === true) {
      return true;
    }
  } catch {}

  await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.mkdir(path, { recursive }));

  // check if path exists
  try {
    return (await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path))).isDirectory();
  } catch {}

  return false;
}
