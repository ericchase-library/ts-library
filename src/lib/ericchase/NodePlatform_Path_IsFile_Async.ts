import { NODE_PATH } from './NodePlatform.js';
import { NodePlatform_Path_GetStats_Async } from './NodePlatform_Path_GetStats_Async.js';

export async function NodePlatform_Path_IsFile_Async(path: string): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  return (await NodePlatform_Path_GetStats_Async(path)).isFile();
}
