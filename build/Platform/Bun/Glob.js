import { Path, PathGroup, PathGroupSet } from '../Node/Path.js';

export class GlobGroup {
  origin_path;
  pattern;
  path_group_set;
  constructor(origin_path, pattern, path_group_set) {
    this.origin_path = origin_path;
    this.pattern = pattern;
    this.path_group_set = path_group_set;
  }
  static build({ origin_path_or_string, pattern, dot = false }) {
    const origin_path = Path.from(origin_path_or_string);
    const path_group_set = new PathGroupSet();
    for (const relative_path of new Bun.Glob(pattern).scanSync({ cwd: origin_path.path, dot })) {
      path_group_set.add(new PathGroup(origin_path, new Path(relative_path)));
    }
    return new GlobGroup(origin_path, pattern, path_group_set);
  }
  get path_groups() {
    return this.pathGroupIterator();
  }
  get paths() {
    return this.pathIterator();
  }
  newOrigin(new_origin_path_or_string) {
    const origin_path = Path.from(new_origin_path_or_string);
    const path_group_set = new PathGroupSet();
    for (const path_group of this.path_group_set.path_groups) {
      path_group_set.add(path_group.newOrigin(origin_path));
    }
    return new GlobGroup(origin_path, this.pattern, path_group_set);
  }
  *pathGroupIterator() {
    for (const path_group of this.path_group_set.path_groups) {
      yield path_group;
    }
  }
  *pathIterator() {
    for (const path of this.path_group_set.paths) {
      yield path;
    }
  }
}

export class GlobScanner {
  static GetKey(origin_path_or_string, pattern) {
    return `${Path.from(origin_path_or_string).path}|${pattern}`;
  }
  static Scan(origin_path_or_string, pattern, dot = false) {
    return GlobGroup.build({ origin_path_or_string, pattern, dot });
  }
  glob_group_map = new Map();
  get glob_groups() {
    return this.glob_group_map.values();
  }
  get path_groups() {
    return this.pathGroupIterator();
  }
  get paths() {
    return this.pathIterator();
  }
  getGlobGroup(origin_path_or_string, pattern) {
    return this.glob_group_map.get(GlobScanner.GetKey(origin_path_or_string, pattern));
  }
  update(other) {
    for (const [key, glob_group] of other.glob_group_map) {
      this.glob_group_map.set(key, glob_group);
    }
    return this;
  }
  scan(origin_path_or_string, ...patterns) {
    const origin_path = Path.from(origin_path_or_string);
    for (const pattern of patterns) {
      this.glob_group_map.set(GlobScanner.GetKey(origin_path, pattern), GlobScanner.Scan(origin_path, pattern));
    }
    return this;
  }
  scanDot(origin_path_or_string, ...patterns) {
    const origin_path = Path.from(origin_path_or_string);
    for (const pattern of patterns) {
      this.glob_group_map.set(GlobScanner.GetKey(origin_path, pattern), GlobScanner.Scan(origin_path, pattern));
    }
    return this;
  }
  *pathGroupIterator() {
    for (const glob_group of this.glob_groups) {
      for (const path_group of glob_group.path_groups) {
        yield path_group;
      }
    }
  }
  *pathIterator() {
    for (const path_group of this.path_groups) {
      yield path_group.path;
    }
  }
}
