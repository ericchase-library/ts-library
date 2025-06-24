import { NodePlatform_Path_Slice } from './NodePlatform_Path_Slice.js';

export function NodePlatform_Path_GetBaseName(path: string): string {
  /**
   * Returns the rightmost segment of the path (trailing slash excluded).
   */
  const rightmost_segment = NodePlatform_Path_Slice(path, -1);

  // if segment contains more than 1 character
  if (rightmost_segment.length > 1) {
    const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // remove trailing slash
      return rightmost_segment.slice(0, -1);
    }
  }

  return rightmost_segment;
}
