import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Directory_Delete_Async(path: string, recursive = false): Promise<boolean> {
  path = NODE_PATH.normalize(path);

  // check if path exists
  try {
    await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path));
    // exists, continue
  } catch {
    // does not exist, deletion not necessary
    return true;
  }

  // check if path is a directory
  await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.readdir(path));

  if (recursive === false) {
    await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rmdir(path));
  } else {
    await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rm(path, { recursive: true, force: true }));
  }

  // check if path exists
  try {
    await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.stat(path));
    // exists, deletion failed
    return false;
  } catch {
    // does not exist, deletion succeeded
  }

  return true;
}
