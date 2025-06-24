export function NodePlatform_Path_StartsWith(path: string, compare_to_path: string): boolean {
  if (compare_to_path.length > path.length) {
    return false;
  }

  for (let i = 0; i < compare_to_path.length; i++) {
    if (compare_to_path[i] === '/' || compare_to_path[i] === '\\') {
      if (path[i] === '/' || path[i] === '\\') {
        continue;
      }
    }
    if (compare_to_path[i] === path[i]) {
      continue;
    }
    return false;
  }

  return true;
}
