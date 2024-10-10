import { describe, expect, test } from 'bun:test';
import { GlobScanner } from '../src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from '../src/lib/ericchase/Platform/Node/Path.js';

const test_path = new Path('tests/Glob');

describe('GlobScanner', () => {
  const globScanner = new GlobScanner();
  test(globScanner.scan.name, () => {
    expect([...new GlobScanner().scan(test_path, '*').paths]).toEqual([]);
    expect([...new GlobScanner().scan(test_path, '*/*').paths]).toContainAllValues([
      test_path.appendSegment('a/a').path, //
      test_path.appendSegment('b/b').path,
      test_path.appendSegment('c/c').path,
    ]);
    expect([...new GlobScanner().scan(test_path, '**/*').paths]).toContainAllValues([
      test_path.appendSegment('a/a').path, //
      test_path.appendSegment('b/b').path,
      test_path.appendSegment('c/c').path,
    ]);
  });
  test(globScanner.scanDot.name, () => {
    expect([...new GlobScanner().scanDot(test_path, '*').paths]).toEqual([]);
    expect([...new GlobScanner().scanDot(test_path, '*/*').paths]).toContainAllValues([
      test_path.appendSegment('a/.a').path, //
      test_path.appendSegment('a/a').path,
      test_path.appendSegment('b/.b').path,
      test_path.appendSegment('b/b').path,
      test_path.appendSegment('c/.c').path,
      test_path.appendSegment('c/c').path,
    ]);
    expect([...new GlobScanner().scanDot(test_path, '**/*').paths]).toContainAllValues([
      test_path.appendSegment('a/.a').path, //
      test_path.appendSegment('a/a').path,
      test_path.appendSegment('b/.b').path,
      test_path.appendSegment('b/b').path,
      test_path.appendSegment('c/.c').path,
      test_path.appendSegment('c/c').path,
    ]);
  });
});
