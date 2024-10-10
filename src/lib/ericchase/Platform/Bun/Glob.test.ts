import { describe, expect, test } from 'bun:test';
import node_path from 'node:path';

import { Path, PathGroup } from '../Node/Path.js';
import { GlobScanner } from './Glob.js';

describe('GlobScanner', () => {
  test(GlobScanner.GetKey.name, () => {
    const origin = 'aaa/bbb/ccc';
    const pattern = '*.*';
    expect(GlobScanner.GetKey(new Path(origin), pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
    expect(GlobScanner.GetKey(Path.build({ dir: origin }), pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
    expect(GlobScanner.GetKey(PathGroup.build({ origin_path: origin }), pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
  });
});
