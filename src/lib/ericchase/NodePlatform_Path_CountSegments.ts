export function NodePlatform_Path_CountSegments(path: string): number {
  if (path.length === 0) {
    return 0;
  }
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  // Slashes ARE removed from segments.
  let count__segments = 1;
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      ++count__segments;
    }
  }
  return count__segments;
}
