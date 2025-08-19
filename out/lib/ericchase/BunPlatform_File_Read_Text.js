import { NODE_PATH } from './NodePlatform.js';
export async function Async_BunPlatform_File_Read_Text(path) {
  path = NODE_PATH.normalize(path);
  try {
    return { value: await Bun.file(path).text() };
  } catch (error) {
    return { error };
  }
}
