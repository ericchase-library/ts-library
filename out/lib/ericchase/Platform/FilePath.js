import { default as node_path } from "node:path";

export class CPath {
  segments = [];
  constructor(...paths) {
    for (const path of paths) {
      if (path instanceof CPath) {
        this.segments.push(...path.segments);
      } else if (typeof path === "string") {
        this.segments.push(...path.split(/[\\\/]/).filter(({ length }) => length > 0));
      }
    }
  }
  get basename() {
    return this.segments[this.segments.length - 1];
  }
  set basename(value) {
    this.segments[this.segments.length - 1] = value;
  }
  get name() {
    return this.basename.indexOf(".") > 0 ? this.basename.slice(0, this.basename.lastIndexOf(".")) : this.basename;
  }
  set name(value) {
    this.basename = value + this.ext;
  }
  get ext() {
    return this.basename.indexOf(".") > 0 ? this.basename.slice(this.basename.lastIndexOf(".")) : "";
  }
  set ext(value) {
    if (value[0] !== ".") {
      this.basename = `${this.name}.${value}`;
    } else {
      this.basename = this.name + value;
    }
  }
  get parentpath() {
    return this.slice(0, -1);
  }
  get raw() {
    return node_path.join(...this.segments);
  }
  get standard() {
    return this.raw.replaceAll("\\", "/");
  }
  startsWith(other) {
    if (other instanceof CPath) {
      return this.standard.startsWith(other.standard);
    }
    return this.standard.startsWith(Path(other).standard);
  }
  endsWith(other) {
    if (other instanceof CPath) {
      return this.standard.endsWith(other.standard);
    }
    return this.standard.endsWith(Path(other).standard);
  }
  equals(other) {
    if (other instanceof CPath) {
      return this.standard === other.standard;
    }
    return this.standard === Path(other).standard;
  }
  slice(begin, end) {
    const sub = new CPath;
    sub.segments = this.segments.slice(begin, end);
    return sub;
  }
  toString() {
    return this.standard;
  }
}
export function Path(...paths) {
  return new CPath(...paths);
}
export function NormalizedPath(...paths) {
  return Path(node_path.normalize(Path(...paths).standard));
}
export function GetRelativePath(from_path, from_is_file, to_path) {
  return Path(node_path.relative(from_is_file === true ? Path(from_path).parentpath.raw : Path(from_path).raw, Path(to_path).raw));
}
export function GetSanitizedFileName(name) {
  return Path(name).standard.replace(/ /g, "-").replace(/[^a-z0-9\.\_\-]/gi, "_").toLowerCase();
}
