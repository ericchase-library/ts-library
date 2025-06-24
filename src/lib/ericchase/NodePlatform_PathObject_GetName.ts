import { Class_NodePlatform_PathObject } from './NodePlatform_PathObject.js';

export function NodePlatform_PathObject_GetName(path_object: Class_NodePlatform_PathObject): string {
  /**
   * Returns all characters in the basename that appear right of the rightmost dot, including the dot.
   * If the basename has no dots, returns empty string.
   * If the basename is '.' or '..', returns empty string.
   */
  const basename = path_object.segments[path_object.segments.length - 1];
  switch (basename) {
    case '':
    case '.':
    case '..':
      return '';
  }
  const index__rightmost_dot = basename.lastIndexOf('.');
  if (index__rightmost_dot === -1) {
    return basename;
  } else {
    return basename.slice(0, index__rightmost_dot);
  }
}
