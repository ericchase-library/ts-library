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

describe('GlobScanner', () => {
  const folder = new Path(Path.from(__dirname).appendSegment('GlobScannerTestFolder').path);
  const scanner = new GlobScanner();
  test(scanner.scan.name, () => {
    expect([...new GlobScanner().scan(folder, '*').paths]).toEqual([]);
    expect([...new GlobScanner().scan(folder, '*/*').paths]).toContainAllValues([
      folder.appendSegment('a/a').path, //
      folder.appendSegment('b/b').path,
      folder.appendSegment('c/c').path,
    ]);
    expect([...new GlobScanner().scan(folder, '**/*').paths]).toContainAllValues([
      folder.appendSegment('a/a').path, //
      folder.appendSegment('b/b').path,
      folder.appendSegment('c/c').path,
    ]);
  });
  test(scanner.scanDot.name, () => {
    expect([...new GlobScanner().scanDot(folder, '*').paths]).toEqual([]);
    expect([...new GlobScanner().scanDot(folder, '*/*').paths]).toContainAllValues([
      folder.appendSegment('a/.a').path, //
      folder.appendSegment('a/a').path,
      folder.appendSegment('b/.b').path,
      folder.appendSegment('b/b').path,
      folder.appendSegment('c/.c').path,
      folder.appendSegment('c/c').path,
    ]);
    expect([...new GlobScanner().scanDot(folder, '**/*').paths]).toContainAllValues([
      folder.appendSegment('a/.a').path, //
      folder.appendSegment('a/a').path,
      folder.appendSegment('b/.b').path,
      folder.appendSegment('b/b').path,
      folder.appendSegment('c/.c').path,
      folder.appendSegment('c/c').path,
    ]);
  });
});
