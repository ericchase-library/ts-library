import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS } from './NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from './NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Path_GetDirName } from './NodePlatform_Path_GetDirName.js';
import { NodePlatform_Path_Join } from './NodePlatform_Path_Join.js';

export async function NodePlatform_File_AppendBytes_Async(path: string, bytes: Uint8Array): Promise<void> {
  await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_Directory_Create_Async(NodePlatform_Path_GetDirName(path)));
  return await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), bytes));
}
