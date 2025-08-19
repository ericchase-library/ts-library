import { NODE_FS, NODE_PATH } from './NodePlatform.js';
import { Async_NodePlatform_Path_Is_Directory } from './NodePlatform_Path_Is_Directory.js';
import { Async_NodePlatform_Path_Is_SymbolicLink } from './NodePlatform_Path_Is_SymbolicLink.js';
export async function Async_NodePlatform_Directory_Create(path, recursive) {
  path = NODE_PATH.normalize(path);
  try {
    if ((await Async_NodePlatform_Path_Is_SymbolicLink(path)) === false) {
      await NODE_FS.mkdir(path, { recursive });
    }
    return { value: (await Async_NodePlatform_Path_Is_Directory(path)) === true };
  } catch (error) {
    return { error, value: (await Async_NodePlatform_Path_Is_Directory(path)) === true };
  }
}
