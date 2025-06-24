import { NODE_PATH } from './NodePlatform.js';

export class Class_NodePlatform_PathObject {
  flag_leading_dot = false;
  flag_trailing_slash: boolean | undefined = undefined;
  segments: string[] = [];

  /**
   * Check to see if the path contains a trailing slash.
   */
  has_trailing_slash(): boolean {
    if (this.segments.length === 2 && this.segments[0] === '' && this.segments[1] === '') {
      return false;
    }
    return this.segments.length > 1 && this.segments[this.segments.length - 1].length === 0;
  }

  /**
   * Sets a flag to `true` that will instruct the next `str()` call to prefix the path with a `.` (dot). During the next call to `str()`, the internal flag will be reset to `false`.
   */
  dot(): this {
    this.flag_leading_dot = true;
    return this;
  }
  /**
   * Sets a flag to the value of `force` that will instruct the next `str()` call to either add or remove a trailing path separator (slash) from the end of the path. During the next call to `str()`, the internal flag will be reset to `undefined`, which corresponds to doing nothing.
   * @param force If `true`, adds a trailing slash. If `false`, removes a trailing slash if it exists. Default `true`.
   */
  slash(force = true): this {
    this.flag_trailing_slash = force;
    return this;
  }
  /**
   * Converts the path segments of this path object into a string.
   * @param separator Determines which path separator to use when joining segments (`/` or `\`). Default is platform specific.
   */
  str(separator: '/' | '\\' = NODE_PATH.sep): string {
    if (this.flag_leading_dot === true) {
      if (this.segments[0] === '') {
        this.segments[0] = '.';
      } else if (this.segments[0] !== '.') {
        this.segments.unshift('.');
      }
    }
    this.flag_leading_dot = false;
    switch (this.flag_trailing_slash) {
      case true:
        // an empty segment will add a slash
        if (this.segments[this.segments.length - 1] !== '') {
          this.segments.push('');
        }
        break;
      case false:
        if (this.segments.length === 2) {
          if (this.segments[0] === '' && this.segments[1] === '') {
            // path is a slash, so do nothing
          } else {
            this.segments.pop();
          }
        }
        if (this.segments.length > 2 && this.segments[this.segments.length - 1] === '') {
          this.segments.pop();
        }
        break;
    }
    this.flag_trailing_slash = undefined;
    return this.segments.join(separator);
  }

  /**
   * Replaces the path object's segments with the new segments from `pathlike`.
   * @param pathlike New segments to use for this path object.
   */
  overwrite(...pathlike: string[]): void {
    // use \ for stability and consistency
    for (let i = 0; i < pathlike.length; i++) {
      pathlike[i] = pathlike[i].replaceAll('/', '\\');
    }
    // use win32 for stability and consistency
    this.segments = NODE_PATH.win32.join(...pathlike).split('\\');
  }

  /**
   * Appends new segments to the end of the path.
   * @param pathlike Segments to insert at the end of the path.
   */
  push(...pathlike: string[]): void {
    this.overwrite(...this.segments, ...pathlike);
  }
  /**
   * Removes the last `count` segments from the path and returns them as a new path object.
   * If the path is empty, an empty array is returned.
   * @param count Number of segments to remove from the end of the path.
   */
  pop(count = 0): Class_NodePlatform_PathObject {
    if (count < 0) {
      count = 0;
    } else if (count > this.segments.length) {
      count = this.segments.length;
    }
    const removed: string[] = [];
    for (let i = 0; i < count; i++) {
      const segment = this.segments.pop();
      if (segment !== undefined) {
        removed.unshift(segment);
      }
    }
    return NodePlatform_PathObject(...removed);
  }

  /**
   * Prepends new segments to the start of the path.
   * @param pathlike Segments to insert at the start of the path.
   */
  unshift(...pathlike: string[]): void {
    this.overwrite(...pathlike, ...this.segments);
  }
  /**
   * Removes the first `count` segments from the path and returns them as a new path object.
   * If the path is empty, an empty array is returned.
   * @param count Number of segments to remove from the start of the path.
   */
  shift(count = 0): Class_NodePlatform_PathObject {
    if (count < 0) {
      count = 0;
    } else if (count > this.segments.length) {
      count = this.segments.length;
    }
    const removed: string[] = [];
    for (let i = 0; i < count; i++) {
      const segment = this.segments.shift();
      if (segment !== undefined) {
        removed.push(segment);
      }
    }
    return NodePlatform_PathObject(...removed);
  }

  /**
   * Allows controlled replacement of the path segment at `index` with a new pathlike segment. If the segment returned from `fn` is modified, the path is processed as if calling `overwrite()`.
   * @param index Index of segment to update and replace.
   * @param fn Function that operates on the chosen path segment.
   */
  update_segment(index: number, fn: (segment: string) => string): void {
    if (index < 0) {
      index += this.segments.length;
    }
    if (index >= 0 && index < this.segments.length) {
      const replacement = fn(this.segments[index]);
      if (replacement !== this.segments[index]) {
        this.overwrite(...this.segments.slice(0, index), replacement, ...this.segments.slice(index + 1));
      }
    }
  }

  /**
   * Returns a section of the path object as a new path object. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array.
   * @param start
   * The beginning index of the specified portion of the array. If start is undefined, then the slice begins at index 0.
   * @param end
   * The end index of the specified portion of the array. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the array.
   */
  slice(start?: number, end?: number): Class_NodePlatform_PathObject {
    const o = new Class_NodePlatform_PathObject();
    o.segments = this.segments.slice(start, end);
    return o;
  }

  /**
   * Returns true if the segments of `pathlike` are the same as the corresponding segments at the start of this path object. Otherwise returns false.
   * @param pathlike Segments to compare with path object.
   */
  startsWith(...pathlike: string[]): boolean {
    const query_segments = NodePlatform_PathObject(...pathlike).segments;
    if (query_segments.length > this.segments.length) {
      return false;
    }
    for (let i = 0; i < query_segments.length; i++) {
      if (query_segments[i] === this.segments[i]) {
        continue;
      }
      return false;
    }
    return true;
  }

  /**
   * Returns true if the segments of `pathlike` are the same as the corresponding segments at the end of this path object. Otherwise returns false.
   * @param pathlike Segments to compare with path object.
   */
  endsWith(...pathlike: string[]): boolean {
    const query_segments = NodePlatform_PathObject(...pathlike).segments;
    if (query_segments.length > this.segments.length) {
      return false;
    }
    for (let i = 0; i < query_segments.length; i++) {
      if (query_segments[query_segments.length - i] === this.segments[this.segments.length - i]) {
        continue;
      }
      return false;
    }
    return true;
  }
}

export function NodePlatform_PathObject(...pathlike: string[]): Class_NodePlatform_PathObject {
  const o = new Class_NodePlatform_PathObject();
  o.push(...pathlike);
  return o;
}
