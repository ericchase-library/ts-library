import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_Directory_Create_Async(path: string, recursive = true): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  try {
    if (NODE_PATH.resolve(process.cwd()) !== NODE_PATH.resolve(path)) {
      await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.mkdir(path, { recursive }));
    }
  } catch (error: any) {
    switch (error.code) {
      case 'EEXIST':
        break;
      default:
        throw error;
    }
  }
  return (await NODE_FS.promises.stat(path)).isDirectory();
}
