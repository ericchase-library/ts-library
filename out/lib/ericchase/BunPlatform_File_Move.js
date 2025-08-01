import { Async_BunPlatform_File_Copy } from "./BunPlatform_File_Copy.js";
import { Async_NodePlatform_File_Delete } from "./NodePlatform_File_Delete.js";
export async function Async_BunPlatform_File_Move(from_path, to_path, overwrite) {
  if ((await Async_BunPlatform_File_Copy(from_path, to_path, overwrite)).value === true) {
    return { value: (await Async_NodePlatform_File_Delete(from_path)).value };
  }
  return { value: false };
}
