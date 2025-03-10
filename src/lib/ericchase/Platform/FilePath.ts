import { default as node_path } from 'node:path';

export class CPath {
  segments: string[] = [];
  constructor(...paths: (CPath | string)[]) {
    for (const path of paths) {
      if (path instanceof CPath) {
        this.segments.push(...path.segments);
      } else {
        this.segments.push(...path.split(/[\\\/]/));
      }
    }
  }
  // Gets the rightmost segment of the path.
  get basename() {
    return this.segments[this.segments.length - 1];
  }
  set basename(value: string) {
    this.segments[this.segments.length - 1] = value;
  }
  // Gets all characters in the basename that appear left of the final dot. If
  // the basename starts with a dot and has no other dots, returns the entire
  // segment.
  get name() {
    return this.basename.indexOf('.') > 0 //
      ? this.basename.slice(0, this.basename.lastIndexOf('.'))
      : this.basename;
  }
  set name(value: string) {
    this.basename = value + this.ext;
  }
  // Gets all characters in the basename that appear right of final dot,
  // including the dot. If the basename starts with a dot and has no other
  // dots, returns empty string. If the basename has no dots, returns an empty
  // string.
  get ext() {
    return this.basename.indexOf('.') > 0 //
      ? this.basename.slice(this.basename.lastIndexOf('.'))
      : '';
  }
  set ext(value: string) {
    if (value[0] !== '.') {
      this.basename = `${this.name}.${value}`;
    } else {
      this.basename = this.name + value;
    }
  }

  // Joins path segments with platform-specific separators.
  get raw() {
    return node_path.join(...this.segments);
  }
  // Joins path segments with standard forward slash / separators
  get standard() {
    return this.segments.join('/');
  }

  // Returns a relative path between this path and other.
  getRelative(other: CPath | string) {
    if (other instanceof CPath) {
      return node_path.relative(this.standard, other.standard);
    }
    return node_path.relative(this.standard, Path(other).standard);
  }

  // String method counterparts that handle normalization and standardization
  // of operands.
  startsWith(other: CPath | string) {
    if (other instanceof CPath) {
      return this.standard.startsWith(other.standard);
    }
    return this.standard.startsWith(Path(other).standard);
  }
  endsWith(other: CPath | string) {
    if (other instanceof CPath) {
      return this.standard.endsWith(other.standard);
    }
    return this.standard.endsWith(new CPath(other).standard);
  }

  // Get a subarray of the segments.
  slice(begin: number, end: number) {
    const sub = new CPath();
    sub.segments = this.segments.slice(begin, end);
    return sub;
  }

  // Useful for some console log coercion.
  toString() {
    return this.standard;
  }
}

export function Path(...paths: (CPath | string)[]) {
  return new CPath(...paths);
}

// Resolves '..' and '.' segments of final path.
export function NormalizedPath(...paths: (CPath | string)[]) {
  return Path(node_path.normalize(Path(...paths).standard));
}
