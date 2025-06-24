import { NodePlatform_Path_GetStats_Async } from './NodePlatform_Path_GetStats_Async.js';

export async function NodePlatform_Path_IsSymbolicLink_Async(path: string): Promise<boolean> {
  return (await NodePlatform_Path_GetStats_Async(path)).isSymbolicLink();
}
