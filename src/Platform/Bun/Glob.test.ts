import { expect, test } from 'bun:test';
import node_path from 'node:path';

import { Path } from '../Node/Path.js';
import { GlobManager } from './Glob.js';

test(GlobManager.GetKey.name, () => {
  const origin = 'aaa/bbb/ccc';
  const pattern = '*.*';
  expect(GlobManager.GetKey(origin, pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
  expect(GlobManager.GetKey(new Path(origin), pattern)).toBe(`${node_path.normalize(origin)}|${pattern}`);
});
