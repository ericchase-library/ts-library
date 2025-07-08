import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export async function NodePlatform_File_ReadBytes_Async(path: string): Promise<Uint8Array<ArrayBuffer>> {
  path = NODE_PATH.normalize(path);
  return Uint8Array.from(await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.readFile(path, {})));
}
