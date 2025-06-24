import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS } from './NodePlatform.js';
import { NodePlatform_Path_Join } from './NodePlatform_Path_Join.js';

export async function NodePlatform_Directory_ReadDir_Async(path: string, recursive = true): Promise<NODE_FS.Dirent[]> {
  try {
    return await Core_Error_Fix_Call_Stack_Async(
      Error().stack,
      NODE_FS.promises.readdir(NodePlatform_Path_Join(path), {
        recursive,
        withFileTypes: true,
      }),
    );
  } catch (error: any) {
    switch (error.code) {
      default:
        throw error;
    }
  }
}
