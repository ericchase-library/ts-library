import { NodePlatform_Path_CountSegments } from './NodePlatform_Path_CountSegments.js';
import { NodePlatform_Path_Slice } from './NodePlatform_Path_Slice.js';

export function NodePlatform_Path_ReplaceBaseName(path: string, value: string): string {
  /**
   * Replaces the basename of `path` with `value` (keeps existing trailing slash).
   */
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return value;
  }
  if (segment_count === 1) {
    // absolute path mac/linux
    if (['/', '\\'].includes(path)) {
      return value;
    }
    // absolute path windows
    if (path.endsWith(':')) {
      return value;
    }
    const rightmost_character = path[path.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // keep trailing slash
      return value + rightmost_character;
    }
    return value;
  }
  let rightmost_segment = NodePlatform_Path_Slice(path, -1);
  const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
  if (['/', '\\'].includes(rightmost_character)) {
    // keep trailing slash
    return NodePlatform_Path_Slice(path, 0, -1) + value + rightmost_character;
  }
  return NodePlatform_Path_Slice(path, 0, -1) + value;
}
