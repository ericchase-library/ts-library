import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Directory_Delete_Async(path: string, recursive = false): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  try {
    if (recursive === false) {
      await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rmdir(path));
    } else {
      await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rm(path, { recursive: true, force: true }));
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
  return NODE_FS.existsSync(path) === false;
}
