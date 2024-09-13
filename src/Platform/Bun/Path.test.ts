import { describe, expect, test } from 'bun:test';
import { NormalizePath } from '../Node/Path.js';
import { PathGroup, PathManager } from './Path.js';

describe("PathGroup('aaa', 'bbb', 'ccc', '.ddd')", () => {
  const pathGroup = new PathGroup('aaa', 'bbb', 'ccc', '.ddd');
  test('basedir', () => {
    expect(pathGroup.basedir).toBe('aaa');
  });
  test('dir', () => {
    expect(pathGroup.dir).toBe('bbb');
  });
  test('name', () => {
    expect(pathGroup.name).toBe('ccc');
  });
  test('ext', () => {
    expect(pathGroup.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(pathGroup.path).toBe(NormalizePath('aaa/bbb/ccc.ddd'));
  });
});

describe("PathGroup('aaa', 'bbb', 'ccc', 'ddd')", () => {
  const pathGroup = new PathGroup('aaa', 'bbb', 'ccc', 'ddd');
  test('basedir', () => {
    expect(pathGroup.basedir).toBe('aaa');
  });
  test('dir', () => {
    expect(pathGroup.dir).toBe('bbb');
  });
  test('name', () => {
    expect(pathGroup.name).toBe('ccc');
  });
  test('ext', () => {
    expect(pathGroup.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(pathGroup.path).toBe(NormalizePath('aaa/bbb/ccc.ddd'));
  });
});

describe("PathGroup('aaa', 'bbb', 'c...c..c.', '...ddd')", () => {
  const pathGroup = new PathGroup('aaa', 'bbb', 'c...c..c.', '...ddd');
  test('basedir', () => {
    expect(pathGroup.basedir).toBe('aaa');
  });
  test('dir', () => {
    expect(pathGroup.dir).toBe('bbb');
  });
  test('name', () => {
    expect(pathGroup.name).toBe('c...c..c.');
  });
  test('ext', () => {
    expect(pathGroup.ext).toBe('.ddd');
  });
  test('path', () => {
    console.log(pathGroup.path);
    expect(pathGroup.path).toBe(NormalizePath('aaa/bbb/c...c..c..ddd'));
  });
});

describe("PathGroup.new('aaa', 'bbb/ccc.ddd')", () => {
  const pathGroup = PathGroup.new({ basedir: 'aaa', path: 'bbb/ccc.ddd' });
  test('basedir', () => {
    expect(pathGroup.basedir).toBe('aaa');
  });
  test('dir', () => {
    expect(pathGroup.dir).toBe('bbb');
  });
  test('name', () => {
    expect(pathGroup.name).toBe('ccc');
  });
  test('ext', () => {
    expect(pathGroup.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(pathGroup.path).toBe(NormalizePath('aaa/bbb/ccc.ddd'));
  });
});

describe("PathGroup.new('aaa', 'bbb/ccc/ddd')", () => {
  const pathGroup = PathGroup.new({ basedir: 'aaa', path: 'bbb/ccc/ddd' });
  test('basedir', () => {
    expect(pathGroup.basedir).toBe('aaa');
  });
  test('dir', () => {
    expect(pathGroup.dir).toBe(NormalizePath('bbb/ccc'));
  });
  test('name', () => {
    expect(pathGroup.name).toBe('ddd');
  });
  test('ext', () => {
    expect(pathGroup.ext).toBe('');
  });
  test('path', () => {
    expect(pathGroup.path).toBe(NormalizePath('aaa/bbb/ccc/ddd'));
  });
});

describe('PathGroup.replace...()', () => {
  const pathGroup = new PathGroup('aaa', 'bbb', 'ccc', '.ddd');
  test('replaceBasedir', () => {
    expect(pathGroup.replaceBasedir('zzz').basedir).toBe('zzz');
    expect(pathGroup.replaceBasedir('zzz').path).toBe(NormalizePath('zzz/bbb/ccc.ddd'));
  });
  test('replaceDir', () => {
    expect(pathGroup.replaceDir('zzz').dir).toBe('zzz');
    expect(pathGroup.replaceDir('zzz').path).toBe(NormalizePath('aaa/zzz/ccc.ddd'));
  });
  test('replaceName', () => {
    expect(pathGroup.replaceName('zzz').name).toBe('zzz');
    expect(pathGroup.replaceName('zzz').path).toBe(NormalizePath('aaa/bbb/zzz.ddd'));
  });
  test('replaceExt', () => {
    expect(pathGroup.replaceExt('zzz').ext).toBe('.zzz');
    expect(pathGroup.replaceExt('zzz').path).toBe(NormalizePath('aaa/bbb/ccc.zzz'));
    expect(pathGroup.replaceExt('.zzz').ext).toBe('.zzz');
    expect(pathGroup.replaceExt('.zzz').path).toBe(NormalizePath('aaa/bbb/ccc.zzz'));
    expect(pathGroup.replaceExt('...zzz').ext).toBe('.zzz');
    expect(pathGroup.replaceExt('...zzz').path).toBe(NormalizePath('aaa/bbb/ccc.zzz'));
  });
});

describe('PathManager', () => {
  const pathManager = new PathManager();
  pathManager.add({ basedir: 'aaa' });
  pathManager.add({ basedir: 'aaa', path: 'bbb' });
  pathManager.add({ basedir: 'aaa', path: 'bbb/ccc' });
  pathManager.add({ basedir: 'aaa', path: 'bbb/ccc.ddd' });
  pathManager.addGroup(new PathGroup('aaa', 'bbb', 'ccc', 'ddd'));
  pathManager.addGroup(new PathGroup('aaa', 'bbb', 'ccc', '.ddd'));
  pathManager.add({ path: 'bbb/ccc.ddd' });
  test('paths', () => {
    expect(Array.from(pathManager.paths)).toEqual([
      NormalizePath('aaa'), //
      NormalizePath('aaa/bbb'),
      NormalizePath('aaa/bbb/ccc'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('bbb/ccc.ddd'),
    ]);
  });
});

describe('PathManager(Set<PathGroup>)', () => {
  const pathManager = new PathManager();
  pathManager.add({ basedir: 'aaa' });
  pathManager.add({ basedir: 'aaa', path: 'bbb' });
  pathManager.add({ basedir: 'aaa', path: 'bbb/ccc' });
  pathManager.add({ basedir: 'aaa', path: 'bbb/ccc.ddd' });
  pathManager.addGroup(new PathGroup('aaa', 'bbb', 'ccc', 'ddd'));
  pathManager.addGroup(new PathGroup('aaa', 'bbb', 'ccc', '.ddd'));
  pathManager.add({ path: 'bbb/ccc.ddd' });
  const pathManager2 = new PathManager(pathManager.pathGroupSet);
  test('paths', () => {
    expect(Array.from(pathManager2.paths)).toEqual([
      NormalizePath('aaa'), //
      NormalizePath('aaa/bbb'),
      NormalizePath('aaa/bbb/ccc'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('aaa/bbb/ccc.ddd'),
      NormalizePath('bbb/ccc.ddd'),
    ]);
  });
});
