import { default as node_path } from 'node:path';

export class PathGroup {
  basedir;
  dir;
  name;
  ext;
  constructor(basedir, dir, name, ext) {
    this.basedir = basedir;
    this.dir = dir;
    this.name = name;
    this.ext = ext;
    if (ext.length > 0) {
      this.ext = '.' + ext.slice(ext.lastIndexOf('.') + 1);
    }
  }
  static new({ basedir = '', path = '' }) {
    const { dir, name, ext } = node_path.parse(node_path.normalize(path));
    return new PathGroup(basedir, dir, name, ext);
  }
  get path() {
    return node_path.normalize(node_path.join(this.basedir, this.dir, this.name + this.ext));
  }
  replaceBasedir(new_basedir) {
    return new PathGroup(node_path.normalize(new_basedir), this.dir, this.name, this.ext);
  }
  replaceDir(new_dir) {
    return new PathGroup(this.basedir, node_path.normalize(new_dir), this.name, this.ext);
  }
  replaceName(new_name) {
    return new PathGroup(this.basedir, this.dir, node_path.normalize(new_name), this.ext);
  }
  replaceExt(new_ext) {
    return new PathGroup(this.basedir, this.dir, this.name, node_path.normalize(new_ext));
  }
}

export class PathManager {
  pathGroupSet;
  constructor(pathGroupSet = new Set()) {
    this.pathGroupSet = pathGroupSet;
  }
  get pathGroups() {
    return this.pathGroup_iterator();
  }
  get paths() {
    return this.path_iterator();
  }
  add({ basedir = '', path = '' }) {
    this.pathGroupSet.add(PathGroup.new({ basedir, path }));
    return this;
  }
  addGroup(pathGroup) {
    this.pathGroupSet.add(pathGroup);
    return this;
  }
  *pathGroup_iterator() {
    for (const pathGroup of this.pathGroupSet) {
      yield pathGroup;
    }
  }
  *path_iterator() {
    for (const pathGroup of this.pathGroupSet) {
      yield pathGroup.path;
    }
  }
}

export class GlobGroup {
  basedir;
  pattern;
  pathGroupSet;
  constructor(basedir, pattern, pathGroupSet) {
    this.basedir = basedir;
    this.pattern = pattern;
    this.pathGroupSet = pathGroupSet;
  }
  static new({ basedir, pattern, dot = false }) {
    basedir = node_path.normalize(basedir);
    const pathGroupSet = new Set();
    for (const path of new Bun.Glob(pattern).scanSync({ cwd: basedir, dot })) {
      pathGroupSet.add(PathGroup.new({ basedir, path }));
    }
    return new GlobGroup(basedir, pattern, pathGroupSet);
  }
  get pathGroups() {
    return this.pathGroup_iterator();
  }
  get paths() {
    return this.path_iterator();
  }
  replaceBasedir(new_base) {
    new_base = node_path.normalize(new_base);
    const new_pathGroupSet = new Set();
    for (const pathGroup of this.pathGroupSet) {
      new_pathGroupSet.add(pathGroup.replaceBasedir(new_base));
    }
    return new GlobGroup(new_base, this.pattern, new_pathGroupSet);
  }
  *pathGroup_iterator() {
    for (const pathGroup of this.pathGroupSet) {
      yield pathGroup;
    }
  }
  *path_iterator() {
    for (const pathGroup of this.pathGroupSet) {
      yield pathGroup.path;
    }
  }
}

export class GlobManager {
  static Scan(basedir, pattern, dot = false) {
    return GlobGroup.new({ basedir: node_path.normalize(basedir), pattern, dot });
  }
  globGroupMap = new Map();
  get globGroups() {
    return this.globGroupMap.values();
  }
  get pathGroups() {
    return this.pathGroup_iterator();
  }
  get paths() {
    return this.path_iterator();
  }
  getGlobGroup(basedir, pattern) {
    this.globGroupMap.get(`${basedir}|${pattern}`);
  }
  update(globManager) {
    for (const [key, globGroup] of globManager.globGroupMap) {
      this.globGroupMap.set(key, globGroup);
    }
    return this;
  }
  scan(basedir, ...patterns) {
    for (const pattern of patterns) {
      const globGroup = GlobManager.Scan(basedir, pattern);
      this.globGroupMap.set(`${globGroup.basedir}|${globGroup.pattern}`, globGroup);
    }
    return this;
  }
  scanDot(basedir, ...patterns) {
    for (const pattern of patterns) {
      const globGroup = GlobManager.Scan(basedir, pattern, true);
      this.globGroupMap.set(`${globGroup.basedir}|${globGroup.pattern}`, globGroup);
    }
    return this;
  }
  *pathGroup_iterator() {
    for (const globGroup of this.globGroups) {
      for (const pathGroup of globGroup.pathGroups) {
        yield pathGroup;
      }
    }
  }
  *path_iterator() {
    for (const globGroup of this.globGroups) {
      for (const pathGroup of globGroup.pathGroups) {
        yield pathGroup.path;
      }
    }
  }
}
