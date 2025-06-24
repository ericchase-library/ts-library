import { NodePlatform_Path_GetBaseName } from './NodePlatform_Path_GetBaseName.js';

export function NodePlatform_Path_GetExtension(path: string): string {
  /**
   * Returns all characters in the basename that appear right of the rightmost dot, including the dot.
   * If the basename has no dots, returns empty string.
   * If the basename is '.' or '..', returns empty string.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  if (['.', '..'].includes(basename)) {
    return '';
  }
  const index__rightmost_dot = basename.lastIndexOf('.');
  if (index__rightmost_dot === -1) {
    return '';
  }
  return basename.slice(index__rightmost_dot);
}
