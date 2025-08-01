import { NODE_PATH } from "./NodePlatform.js";
export async function Async_BunPlatform_File_Write_Text(path, text) {
  path = NODE_PATH.normalize(path);
  try {
    await Bun.write(path, text);
    return { value: true };
  } catch (error) {
    return { error, value: false };
  }
}
