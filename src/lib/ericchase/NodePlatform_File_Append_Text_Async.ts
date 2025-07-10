import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
import { NODE_FS, NODE_PATH } from './NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from './NodePlatform_Directory_Create_Async.js';

export async function NodePlatform_File_Append_Text_Async(path: string, text: string): Promise<void> {
  path = NODE_PATH.normalize(path);
  const { dir } = NODE_PATH.parse(path);
  await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_Directory_Create_Async(dir, true));
  return await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.appendFile(path, text));
}
