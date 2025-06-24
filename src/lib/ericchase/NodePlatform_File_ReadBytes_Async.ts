import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS } from './NodePlatform.js';
import { NodePlatform_Path_Join } from './NodePlatform_Path_Join.js';

export async function NodePlatform_File_ReadBytes_Async(path: string): Promise<Uint8Array<ArrayBuffer>> {
  return Uint8Array.from(await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), {})));
}
