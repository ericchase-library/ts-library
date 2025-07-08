import { NODE_PATH } from './NodePlatform.js';

export function BunPlatform_File_ReadText_Async(path: string): Promise<string> {
  path = NODE_PATH.normalize(path);
  return Bun.file(path).text();
}
