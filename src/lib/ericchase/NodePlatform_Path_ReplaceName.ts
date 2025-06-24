import { NodePlatform_Path_GetExtension } from './NodePlatform_Path_GetExtension.js';
import { NodePlatform_Path_ReplaceBaseName } from './NodePlatform_Path_ReplaceBaseName.js';

export function NodePlatform_Path_ReplaceName(path: string, value: string): string {
  /**
   * Replaces the name portion of basename of `path` with `value` (keeps existing trailing slash).
   */
  return NodePlatform_Path_ReplaceBaseName(path, value + NodePlatform_Path_GetExtension(path));
}
