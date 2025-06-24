import { NODE_PATH } from './NodePlatform.js';

export function NodePlatform_Path_Join(...paths: string[]): string {
  return NODE_PATH.win32.join(...paths).replaceAll('\\', NODE_PATH.sep);
}
