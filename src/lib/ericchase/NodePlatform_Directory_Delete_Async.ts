import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS } from './NodePlatform.js';
import { NodePlatform_Path_Join } from './NodePlatform_Path_Join.js';

export async function NodePlatform_Directory_Delete_Async(path: string, recursive = false): Promise<boolean> {
  try {
    if (recursive === false) {
      await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rmdir(NodePlatform_Path_Join(path)));
    } else {
      await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rm(NodePlatform_Path_Join(path), { recursive: true, force: true }));
    }
  } catch (error: any) {
    switch (error.code) {
      case 'ENOENT':
      case 'ENOTEMPTY':
        break;
      // @ts-ignore
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: we want the fallthrough
      case 'EFAULT':
        error.message += '\nPossible Causes: Directory not empty, set parameter `recursive` to `true`';
      default:
        throw error;
    }
  }
  return NODE_FS.existsSync(NodePlatform_Path_Join(path)) === false;
}
