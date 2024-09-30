import { expect, test } from 'bun:test';
import node_path from 'node:path';

import { Path } from '../Node/Path.js';
import { GlobScanner } from './Glob.js';

test(GlobScanner.GetKey.name, () => {
  const origin = 'aaa/bbb/ccc';
  const pattern = '*.*';
  expect(GlobScanner.GetKey(origin, pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
  expect(GlobScanner.GetKey(new Path(origin), pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
});
