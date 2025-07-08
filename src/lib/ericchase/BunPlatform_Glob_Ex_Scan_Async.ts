import { BunPlatform_Glob_Gen_Scan_Async } from './BunPlatform_Glob_Scan_Async_Generator.js';
import { NODE_PATH } from './NodePlatform.js';

export async function BunPlatform_Glob_Ex_Scan_Async(dirpath: string, include_patterns: string[], exclude_patterns: string[], options?: { absolutepaths?: boolean; onlyfiles?: boolean }): Promise<Set<string>> {
  dirpath = NODE_PATH.normalize(dirpath);
  const included: string[] = [];
  for (const pattern of include_patterns) {
    included.push(...(await Array.fromAsync(BunPlatform_Glob_Gen_Scan_Async(dirpath, pattern, options))));
  }
  const excluded: string[] = [];
  for (const pattern of exclude_patterns) {
    excluded.push(...(await Array.fromAsync(BunPlatform_Glob_Gen_Scan_Async(dirpath, pattern, options))));
  }
  return new Set(included).difference(new Set(excluded));
}
