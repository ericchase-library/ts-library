import { NODE_PATH } from './NodePlatform.js';

export function BunPlatform_File_Read_Text_Async(path: string): Promise<string> {
  path = NODE_PATH.normalize(path);
  return Bun.file(path).text();
}
