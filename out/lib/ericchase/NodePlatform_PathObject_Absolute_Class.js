import { NODE_PATH } from './NodePlatform.js';

export class Class_NodePlatform_PathObject_Absolute_Class {
  os;
  root = '';
  dir = '';
  name = '';
  ext = '';
  os_api;
  constructor(os) {
    this.os = os;
    if (os === 'win32') {
      this.os_api = NODE_PATH.win32;
    } else {
      this.os_api = NODE_PATH.posix;
    }
  }
  overwrite(...pathlike) {
    if (pathlike.filter((segment) => segment.length > 0).length > 0) {
      const { root, dir, name, ext } = this.os_api.parse(this.os_api.join(...pathlike.filter((item) => item.length > 0)));
      if (root === '') {
        throw new Error(`The computed path for "${pathlike}" is not considered an absolute path for ${this.os} and may not be used in a ${this.os} absolute path object.`);
      }
      this.root = root;
      this.dir = dir;
      this.name = name;
      this.ext = ext;
    } else {
      throw new Error('An empty path may not be used in an absolute path object.');
    }
    return this;
  }
  join(options) {
    options ??= {};
    options.slash ??= false;
    if (options.slash === true) {
      return this.os_api.join(...this.split()) + (this.os === 'win32' ? '\\' : '/');
    }
    return this.os_api.join(...this.split());
  }
  split() {
    return [this.root, ...this.dir.slice(this.root.length).split(this.os === 'win32' ? '\\' : '/'), this.name + this.ext].filter((segment) => segment.length > 0);
  }
  push(...pathlike) {
    this.overwrite(...this.split(), ...pathlike);
    return this;
  }
  pop(count = 1) {
    if (count <= 0) {
      return [];
    }
    const segments = this.split();
    if (count >= segments.length) {
      count = segments.length - 1;
    }
    const removed = [];
    for (let i = 0; i < count; i++) {
      const segment = segments.pop();
      if (segment !== undefined) {
        removed.unshift(segment);
      }
    }
    this.overwrite(...segments);
    return removed;
  }
  top() {
    return this.split().slice(-1)[0];
  }
  slice(start = 0, end) {
    if (start !== 0) {
      start = 0;
    }
    const segments = this.split();
    end ??= segments.length;
    if (end <= -segments.length) {
      end = 1;
    }
    return new Class_NodePlatform_PathObject_Absolute_Class(this.os).overwrite(...this.split().slice(0, end));
  }
  replaceExt(ext) {
    if (ext.length > 0) {
      this.ext = ext[0] === '.' ? ext : '.' + ext;
    } else {
      this.ext = '';
    }
    return this;
  }
  toPosix() {
    if (this.os === 'win32') {
      return NodePlatform_PathObject_Absolute_Posix_Class(...this.split());
    } else {
      return this;
    }
  }
  toWin32() {
    if (this.os === 'win32') {
      return this;
    } else {
      return NodePlatform_PathObject_Absolute_Win32_Class(...this.split());
    }
  }
}
export function NodePlatform_PathObject_Absolute_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Absolute_Class(process.platform === 'win32' ? 'win32' : 'posix').overwrite(...pathlike);
}
export function NodePlatform_PathObject_Absolute_Posix_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Absolute_Class('posix').overwrite(...pathlike);
}
export function NodePlatform_PathObject_Absolute_Win32_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Absolute_Class('win32').overwrite(...pathlike);
}
