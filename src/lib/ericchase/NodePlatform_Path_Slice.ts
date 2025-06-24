export function NodePlatform_Path_Slice(path: string, start?: number, end?: number): string {
  // Trailing slashes are not removed during slicing.
  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  /**
   * `start` (Optional)
   *  Zero-based index at which to start extraction, converted to an integer.
   *   - Negative index counts back from the end of the array:
   *   - If -array.length <= start < 0, start + array.length is used.
   *   - If start < -array.length or start is omitted, 0 is used.
   *   - If start >= array.length, an empty array is returned.
   *
   * `end` (Optional)
   *  Zero-based index at which to end extraction, converted to an integer. slice() extracts up to but not including end.
   *   - Negative index counts back from the end of the array
   *   - If -array.length <= end < 0, end + array.length is used.
   *   - If end < -array.length, 0 is used.
   *   - If end >= array.length or end is omitted or undefined, array.length is used, causing all elements until the end to be extracted.
   *   - If end implies a position before or at the position that start implies, an empty array is returned.
   */
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  const array__segment_indices: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      array__segment_indices.push(i);
    }
  }

  start ??= 0;
  if (start < -1 * array__segment_indices.length) {
    start = 0;
  } else if (-1 * array__segment_indices.length <= start && start < 0) {
    start = start + array__segment_indices.length;
  }

  end ??= array__segment_indices.length;
  if (end < -1 * array__segment_indices.length) {
    end = 0;
  } else if (-1 * array__segment_indices.length <= end && end < 0) {
    end = end + array__segment_indices.length;
  } else if (end > array__segment_indices.length) {
    end = array__segment_indices.length;
  }

  if (start >= array__segment_indices.length) {
    return ''; // use empty array
  }
  if (end <= start) {
    return ''; // use empty array
  }

  const index__end = array__segment_indices.at(end);
  return path.slice(array__segment_indices.at(start), index__end ? index__end : undefined);
}
