import { NODE_PATH } from './NodePlatform.js';

export async function* BunPlatform_Glob_Gen_Scan_Async(dirpath: string, pattern: string, options?: { absolutepaths?: boolean; onlyfiles?: boolean }): AsyncGenerator<string> {
  dirpath = NODE_PATH.normalize(dirpath);
  for await (const value of new Bun.Glob(pattern).scan({
    absolute: options?.absolutepaths ?? false,
    cwd: dirpath,
    dot: true,
    onlyFiles: options?.onlyfiles ?? true,
  })) {
    yield value;
  }
}
