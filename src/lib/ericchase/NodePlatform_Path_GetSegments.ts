export function NodePlatform_Path_GetSegments(path: string): string[] {
  if (path.length === 0) {
    return [];
  }
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  // Slashes ARE removed from segments.
  const array__segments: string[] = [];
  let index__start = 0;
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      array__segments.push(path.slice(index__start, i));
      index__start = i;
    }
  }
  // add remaining segment
  array__segments.push(path.slice(index__start));
  // remove trailing slashes
  for (let i = 0; i < array__segments.length; i++) {
    if (array__segments[i].length > 1) {
      if (['/', '\\'].includes(array__segments[i][array__segments[i].length - 1])) {
        array__segments[i] = array__segments[i].slice(0, -1);
      }
    }
  }
  return array__segments;
}
