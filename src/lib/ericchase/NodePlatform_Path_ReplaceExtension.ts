import { NodePlatform_Path_GetName } from './NodePlatform_Path_GetName.js';
import { NodePlatform_Path_ReplaceBaseName } from './NodePlatform_Path_ReplaceBaseName.js';

export function NodePlatform_Path_ReplaceExtension(path: string, value: string): string {
  /**
   * Replaces the extension portion of basename of `path` with `value` (keeps existing trailing slash).
   */
  // add dot separator if needed
  if (value[0] !== '.') {
    value = '.' + value;
  }
  const name = NodePlatform_Path_GetName(path);
  // absolute path mac/linux
  if (['/', '\\'].includes(name)) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  // absolute path windows
  if (name.endsWith(':')) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  return NodePlatform_Path_ReplaceBaseName(path, name + value);
}
