import { NODE_FS, NODE_PATH } from "./NodePlatform.js";
import { Async_NodePlatform_Path_Is_SymbolicLink } from "./NodePlatform_Path_Is_SymbolicLink.js";
export async function Async_NodePlatform_Directory_ReadDir(path, recursive) {
  path = NODE_PATH.normalize(path);
  try {
    if (await Async_NodePlatform_Path_Is_SymbolicLink(path) === false) {
      return { value: await NODE_FS.readdir(path, { encoding: "utf8", recursive, withFileTypes: true }) };
    }
    return {};
  } catch (error) {
    return { error };
  }
}
