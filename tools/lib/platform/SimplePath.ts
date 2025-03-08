import { default as node_path } from 'node:path';

export function StandardPath(path: string): string {
  return node_path.normalize(path).replaceAll('\\', '/');
}

export class SimplePath {
  parts: string[] = [];
  constructor(...paths: (SimplePath | string)[]) {
    for (const path of paths) {
      if (path instanceof SimplePath) {
        this.parts.push(...path.parts);
      } else {
        this.parts.push(...StandardPath(path).split('/'));
      }
    }
  }
  /** The basename is the final rightmost segment of the file path; it is
   * usually a file, but can also be a directory name. */
  get basename() {
    return this.parts[this.parts.length - 1];
  }
  set basename(value: string) {
    this.parts[this.parts.length - 1] = value;
  }
  get name() {
    const dot = this.basename.lastIndexOf('.');
    return dot > 0 ? this.basename.slice(0, dot) : this.basename;
  }
  set name(value: string) {
    this.basename = value + this.ext;
  }
  get ext() {
    const dot = this.basename.lastIndexOf('.');
    return dot > 0 ? this.basename.slice(dot) : '';
  }
  set ext(value: string) {
    if (value[0] !== '.') {
      this.basename = `${this.name}.${value}`;
    } else {
      this.basename = this.name + value;
    }
  }
  get raw() {
    return node_path.join(...this.parts);
  }
  get standard() {
    return this.parts.join('/');
  }
  startsWith(other: SimplePath | string) {
    if (other instanceof SimplePath) {
      return this.raw.startsWith(other.raw);
    }
    return this.raw.startsWith(new SimplePath(other).raw);
  }
  endsWith(other: SimplePath | string) {
    if (other instanceof SimplePath) {
      return this.raw.endsWith(other.raw);
    }
    return this.raw.endsWith(new SimplePath(other).raw);
  }

  slice(begin: number, end: number) {
    const sub = new SimplePath();
    sub.parts = this.parts.slice(begin, end);
    return sub;
  }

  toString() {
    return this.standard;
  }
}
