import { NODE_PATH } from './NodePlatform.js';
import { NodePlatform_Path_Get_Stats_SymbolicLink_Async } from './NodePlatform_Path_Get_Stats_SymbolicLink_Async.js';

export async function NodePlatform_Path_Is_SymbolicLink_Async(path: string): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  return (await NodePlatform_Path_Get_Stats_SymbolicLink_Async(path)).isSymbolicLink();
}
