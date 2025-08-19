import { NODE_FS, NODE_PATH } from './NodePlatform.js';
export async function Async_NodePlatform_Path_Exists(path) {
  path = NODE_PATH.normalize(path);
  try {
    await NODE_FS.stat(path);
    return { value: true };
  } catch (error) {
    return { error, value: false };
  }
}
