import { NODE_PATH } from './NodePlatform.js';

export class Class_NodePlatform_PathObject_Relative_Class {
  os;
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
      if (root !== '') {
        throw new Error(`The computed path for "${pathlike}" is not considered a relative path for ${this.os} and may not be used in a ${this.os} relative path object.`);
      }
      this.dir = dir;
      this.name = name;
      this.ext = ext;
    } else {
      this.dir = '';
      this.name = '';
      this.ext = '';
    }
    return this;
  }
  join(options) {
    options ??= {};
    options.dot ??= false;
    options.slash ??= false;
    const segments = this.split();
    if (segments[0] === '.' || segments[0] === '..') {
      options.dot = false;
    }
    if (options.slash === true) {
      return (options.dot === true ? '.' + (this.os === 'win32' ? '\\' : '/') : '') + this.os_api.join(...this.split()) + (this.os === 'win32' ? '\\' : '/');
    }
    return (options.dot === true ? '.' + (this.os === 'win32' ? '\\' : '/') : '') + this.os_api.join(...this.split());
  }
  split() {
    const out = [...this.dir.split(this.os === 'win32' ? '\\' : '/'), this.name + this.ext].filter((segment) => segment.length > 0);
    if (out.length === 0) {
      return ['.'];
    }
    return out;
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
    if (count > segments.length) {
      count = segments.length;
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
  unshift(...pathlike) {
    this.overwrite(...pathlike, ...this.split());
    return this;
  }
  shift(count = 1) {
    if (count <= 0) {
      return [];
    }
    const segments = this.split();
    if (count > segments.length) {
      count = segments.length;
    }
    const removed = [];
    for (let i = 0; i < count; i++) {
      const segment = segments.shift();
      if (segment !== undefined) {
        removed.push(segment);
      }
    }
    this.overwrite(...segments);
    return removed;
  }
  slice(start, end) {
    return new Class_NodePlatform_PathObject_Relative_Class(this.os).overwrite(...this.split().slice(start, end));
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
      return NodePlatform_PathObject_Relative_Posix_Class(...this.split());
    } else {
      return this;
    }
  }
  toWin32() {
    if (this.os === 'win32') {
      return this;
    } else {
      return NodePlatform_PathObject_Relative_Win32_Class(...this.split());
    }
  }
}
export function NodePlatform_PathObject_Relative_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Relative_Class(process.platform === 'win32' ? 'win32' : 'posix').overwrite(...pathlike);
}
export function NodePlatform_PathObject_Relative_Posix_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Relative_Class('posix').overwrite(...pathlike);
}
export function NodePlatform_PathObject_Relative_Win32_Class(...pathlike) {
  return new Class_NodePlatform_PathObject_Relative_Class('win32').overwrite(...pathlike);
}
