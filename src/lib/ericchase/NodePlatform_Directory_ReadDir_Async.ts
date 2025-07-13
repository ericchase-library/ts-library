import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Directory_ReadDir_Async(path: string, recursive = true): Promise<NODE_FS.Dirent[]> {
  path = NODE_PATH.normalize(path);
  try {
    return await Core_Error_Fix_Call_Stack_Async(
      Error().stack,
      NODE_FS.promises.readdir(path, {
        recursive,
        withFileTypes: true,
      }),
    );
  } catch (error: any) {
    throw error;
    // switch (error.code) {
    //   default:
    //     throw error;
    // }
  }
}
