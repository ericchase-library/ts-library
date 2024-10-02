import node_path from 'node:path';
import { PrepareMessage } from '../../Utility/PrepareMessage.js';
export function JoinPaths(...paths) {
  return node_path.join(...paths.map((path) => path.path));
}
export function NormalizePath(path) {
  return node_path.normalize(path.path);
}
export function ParsePath(path) {
  return node_path.parse(path.path);
}
export function ResolvePath(path) {
  return node_path.resolve(path.path);
}
export function SanitizePath(path) {
  return path.path.replace(/[^a-z0-9\.\_\-]/gi, '_').toLowerCase();
}
export const PathSeparator = node_path.sep;

export class Path {
  dir;
  root;
  base;
  name;
  ext;
  $path;
  $standard_path;
  constructor(path = '') {
    const { dir, root, base, name, ext } = node_path.parse(node_path.normalize(path));
    this.dir = dir;
    this.root = root;
    this.base = base;
    this.name = name;
    this.ext = ext;
    this.$path = node_path.join(dir, base);
    this.$standard_path = this.path.split(node_path.sep).join('/');
  }
  static build({ dir = '', base = '' }) {
    return new Path(dir).appendSegment(base);
  }
  static from(pathOrString) {
    if (typeof pathOrString === 'string') {
      return new Path(pathOrString);
    }
    if (pathOrString instanceof PathGroup) {
      return new Path(pathOrString.path);
    }
    return pathOrString;
  }
  get path() {
    return this.$path;
  }
  get resolve() {
    return node_path.resolve(this.path);
  }
  get sanitize() {
    return this.path.replace(/[^a-z0-9\.\_\-]/gi, '_').toLowerCase();
  }
  get standard_path() {
    return this.$standard_path;
  }
  appendSegment(pathOrString) {
    return new Path(node_path.join(this.path, Path.from(pathOrString).path));
  }
  newDir(new_dir) {
    return Path.build({ dir: new_dir, base: this.base });
  }
  newRoot(new_root) {
    return this.newDir(new_root + this.dir.slice(this.root.length));
  }
  newBase(new_base) {
    return Path.build({ dir: this.dir, base: new_base });
  }
  newName(new_name) {
    if (new_name.length === 0) {
      const message = `
        Path.newName does not accept an empty string. Use Path.newBase instead.
        
        Current path value is "${this.path}".

        Follow the stack trace below to find the affected area of code.
      `;
      throw new Error(PrepareMessage(message, 0, 1));
    }
    return this.newBase(`${new_name}${this.ext}`);
  }
  newExt(new_ext) {
    if (new_ext.length === 0) {
      return this.newBase(this.name);
    }
    if (new_ext.lastIndexOf('.') > 0) {
      const message = `
        Path.newExt does not accept dots (".") after the first character.
        
        Current path value is "${this.path}".

        Follow the stack trace below to find the affected area of code.
      `;
      throw new Error(PrepareMessage(message, 0));
    }
    if (new_ext.indexOf('.') === 0) {
      return this.newBase(`${this.name}${new_ext}`);
    }
    return this.newBase(`${this.name}.${new_ext}`);
  }
  toString() {
    return this.path;
  }
}

export class PathSet {
  path_map;
  constructor(path_map = new Map()) {
    this.path_map = path_map;
  }
  get paths() {
    return this.pathIterator();
  }
  add(pathOrString) {
    const path = Path.from(pathOrString);
    this.path_map.set(path.path, path);
    return this;
  }
  has(pathOrString) {
    const path = Path.from(pathOrString);
    return this.path_map.has(path.path);
  }
  *pathIterator() {
    for (const [, path] of this.path_map) {
      yield path.path;
    }
  }
}

export class PathGroup {
  origin_path;
  origin_dir;
  root;
  relative_path;
  relative_dir;
  relative_base;
  relative_name;
  relative_ext;
  $path;
  $standard_path;
  constructor(origin_path, relative_path) {
    this.origin_path = Path.from(origin_path);
    this.relative_path = Path.from(relative_path).newRoot('');
    this.origin_dir = this.origin_path.path;
    const final_path = Path.from(this.origin_path).appendSegment(this.relative_path);
    this.$path = final_path.path;
    this.$standard_path = final_path.standard_path;
    this.root = final_path.root;
    this.relative_dir = final_path.dir;
    this.relative_base = final_path.base;
    this.relative_name = final_path.name;
    this.relative_ext = final_path.ext;
  }
  static build({ origin_path = '', relative_path = '' }) {
    return new PathGroup(origin_path, relative_path);
  }
  get path() {
    return this.$path;
  }
  get standard_path() {
    return this.$standard_path;
  }
  newOrigin(new_origin_path) {
    return new PathGroup(new_origin_path, this.relative_path);
  }
  newRelative(new_relative_path) {
    return new PathGroup(this.origin_path, new_relative_path);
  }
  newRelativeDir(new_dir) {
    return new PathGroup(this.origin_path, this.relative_path.newDir(new_dir));
  }
  newRelativeBase(new_base) {
    return new PathGroup(this.origin_path, this.relative_path.newBase(new_base));
  }
  newRelativeName(new_name) {
    return new PathGroup(this.origin_path, this.relative_path.newName(new_name));
  }
  newRelativeExt(new_ext) {
    return new PathGroup(this.origin_path, this.relative_path.newExt(new_ext));
  }
  toString() {
    return this.path;
  }
}

export class PathGroupSet {
  path_group_map;
  constructor(path_group_map = new Map()) {
    this.path_group_map = path_group_map;
  }
  get path_groups() {
    return this.pathGroupIterator();
  }
  get paths() {
    return this.pathIterator();
  }
  add(path_group) {
    this.path_group_map.set(path_group.path, path_group);
    return this;
  }
  has(path_group) {
    return this.path_group_map.has(path_group.path);
  }
  *pathGroupIterator() {
    for (const [, path_group] of this.path_group_map) {
      yield path_group;
    }
  }
  *pathIterator() {
    for (const [, path_group] of this.path_group_map) {
      yield path_group.path;
    }
  }
}
