import { NODE_FS, NODE_FS_SYNC, NODE_PATH, NodePlatform_Result } from './NodePlatform.js';
import { Async_NodePlatform_Path_Is_SymbolicLink } from './NodePlatform_Path_Is_SymbolicLink.js';

export async function Async_NodePlatform_Directory_ReadDir(path: string, recursive: boolean): Promise<NodePlatform_Result<NODE_FS_SYNC.Dirent<string>[]>> {
  path = NODE_PATH.normalize(path);
  try {
    if ((await Async_NodePlatform_Path_Is_SymbolicLink(path)) === false) {
      return { value: await NODE_FS.readdir(path, { recursive, withFileTypes: true }) };
    }
    return {};
  } catch (error) {
    return { error };
  }
}
