import { NODE_PATH } from './NodePlatform.js';

export function NodePlatform_Path_ResolveStandard(...paths: string[]): string {
  // return Core.Map.GetOrDefault(PATH__RESOLVE_CACHE, path, () => {
  return NODE_PATH.resolve(...paths).replaceAll('\\', '/');
  // });
}
