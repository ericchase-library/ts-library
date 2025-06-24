import { NODE_PATH } from './NodePlatform.js';
import { NodePlatform_Path_CountSegments } from './NodePlatform_Path_CountSegments.js';
import { NodePlatform_Path_Slice } from './NodePlatform_Path_Slice.js';

export function NodePlatform_Path_GetDirName(path: string): string {
  /**
   * Returns the path after removing the rightmost segment (trailing slash included).
   * If the path contains only one segment, returns . for relative paths and the entire segment for absolute paths.
   */
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return '.' + NODE_PATH.sep;
  }
  if (segment_count === 1) {
    // absolute path mac/linux
    if (['/', '\\'].includes(path)) {
      return path;
    }
    // absolute path windows
    if (path.endsWith(':')) {
      return path;
    }
    const rightmost_character = path[path.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // return . with existing trailing slash
      return '.' + rightmost_character;
    }
    // return . with platform specific trailing slash
    return '.' + NODE_PATH.sep;
  }
  // return path excluding rightmost segment
  return NodePlatform_Path_Slice(path, 0, -1);
}
