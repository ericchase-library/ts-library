import node_path from 'node:path';
export function NormalizePath(path) {
  return node_path.normalize(path);
}
export function ParsePath(path) {
  return node_path.parse(path);
}
export const PathSeparator = node_path.sep;
