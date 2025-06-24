import { Class_NodePlatform_PathObject } from './NodePlatform_PathObject.js';

export function NodePlatform_PathObject_GetBaseName(path_object: Class_NodePlatform_PathObject): string {
  return path_object.segments[path_object.segments.length - 1];
}
