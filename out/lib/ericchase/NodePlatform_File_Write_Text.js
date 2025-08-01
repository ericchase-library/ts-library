import { NODE_FS, NODE_PATH } from "./NodePlatform.js";
import { Async_NodePlatform_Directory_Create } from "./NodePlatform_Directory_Create.js";
export async function Async_NodePlatform_File_Write_Text(path, text, recursive) {
  path = NODE_PATH.normalize(path);
  if (recursive === true) {
    await Async_NodePlatform_Directory_Create(NODE_PATH.parse(path).dir, true);
  }
  try {
    await NODE_FS.writeFile(path, text);
    return { value: true };
  } catch (error) {
    return { error, value: false };
  }
}
