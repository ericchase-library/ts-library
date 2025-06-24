import { NodePlatform_Path_GetBaseName } from './NodePlatform_Path_GetBaseName.js';

export function NodePlatform_Path_GetName(path: string): string {
  /**
   * Returns all characters in the basename that appear left of the rightmost dot, excluding the dot.
   * If the basename has no dots, returns the entire string.
   * If the basename is '.' or '..', returns the entire string.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  if (['.', '..'].includes(basename)) {
    return basename;
  }
  const index__rightmost_dot = basename.lastIndexOf('.');
  if (index__rightmost_dot === -1) {
    return basename;
  }
  return basename.slice(0, index__rightmost_dot);
}
