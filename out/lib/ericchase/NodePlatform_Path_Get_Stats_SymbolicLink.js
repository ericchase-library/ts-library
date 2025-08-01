import { NODE_FS, NODE_PATH } from "./NodePlatform.js";
export async function Async_NodePlatform_Path_Get_Stats_SymbolicLink(path) {
  path = NODE_PATH.normalize(path);
  try {
    return { value: await NODE_FS.lstat(path) };
  } catch (error) {
    return { error };
  }
}
