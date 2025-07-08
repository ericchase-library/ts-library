import { NODE_PATH } from './NodePlatform.js';

export async function BunPlatform_File_Delete_Async(path: string): Promise<boolean> {
  path = NODE_PATH.normalize(path);
  try {
    await Bun.file(path).delete();
  } catch (error: any) {
    switch (error.code) {
      case 'ENOENT':
        break;
      // @ts-ignore
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: we want the fallthrough
      default:
        throw error;
    }
  }
  return (await Bun.file(path).exists()) === false;
}
