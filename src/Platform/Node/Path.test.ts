import { describe, expect, test } from 'bun:test';
import node_path from 'node:path';

import { Path, PathGroup, PathGroupSet } from './Path.js';

describe(`new ${Path.name}()`, () => {
  const path = new Path();
  test('dir', () => {
    expect(path.dir).toBe('');
  });
  test('root', () => {
    expect(path.root).toBe('');
  });
  test('base', () => {
    expect(path.base).toBe('.');
  });
  test('name', () => {
    expect(path.name).toBe('.');
  });
  test('ext', () => {
    expect(path.ext).toBe('');
  });
  test('path', () => {
    expect(path.path).toBe('.');
  });
  test('standardPath', () => {
    expect(path.standard_path).toBe('.');
  });
});

describe(`new ${Path.name}('ccc.ddd')`, () => {
  const path = new Path('ccc.ddd');
  test('dir', () => {
    expect(path.dir).toBe('');
  });
  test('root', () => {
    expect(path.root).toBe('');
  });
  test('base', () => {
    expect(path.base).toBe('ccc.ddd');
  });
  test('name', () => {
    expect(path.name).toBe('ccc');
  });
  test('ext', () => {
    expect(path.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(path.path).toBe('ccc.ddd');
  });
  test('standardPath', () => {
    expect(path.standard_path).toBe('ccc.ddd');
  });
});

describe(`new ${Path.name}('bbb/ccc.ddd')`, () => {
  const path = new Path('bbb/ccc.ddd');
  test('dir', () => {
    expect(path.dir).toBe('bbb');
  });
  test('root', () => {
    expect(path.root).toBe('');
  });
  test('base', () => {
    expect(path.base).toBe('ccc.ddd');
  });
  test('name', () => {
    expect(path.name).toBe('ccc');
  });
  test('ext', () => {
    expect(path.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
    expect(path.path).toBe(node_path.normalize('bbb\\ccc.ddd'));
  });
  test('standardPath', () => {
    expect(path.standard_path).toBe('bbb/ccc.ddd');
  });
  test('newDir', () => {
    {
      const new_path = path.newDir('');
      expect(new_path.dir).toBe('');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe('ccc.ddd');
    }
    {
      const new_path = path.newDir('zzz');
      expect(new_path.dir).toBe('zzz');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('zzz/ccc.ddd');
    }
    {
      const new_path = path.newDir('zzz/yyy');
      expect(new_path.dir).toBe(node_path.normalize('zzz/yyy'));
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/yyy/ccc.ddd'));
      expect(new_path.standard_path).toBe('zzz/yyy/ccc.ddd');
    }
    {
      const new_path = path.newDir('/zzz');
      expect(new_path.dir).toBe(node_path.normalize('/zzz'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('/zzz/ccc.ddd');
    }
    {
      const new_path = path.newDir('c:\\zzz');
      expect(new_path.dir).toBe(node_path.normalize('c:\\zzz'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('c:/zzz/ccc.ddd');
    }
  });
  test('newRoot', () => {
    {
      const new_path = path.newRoot('');
      expect(new_path.dir).toBe('bbb');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('bbb/ccc.ddd');
    }
    {
      const new_path = path.newRoot('/');
      expect(new_path.dir).toBe(node_path.normalize('/bbb'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('/bbb/ccc.ddd');
    }
    {
      const new_path = path.newRoot('c:\\');
      expect(new_path.dir).toBe(node_path.normalize('c:\\bbb'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('c:/bbb/ccc.ddd');
    }
  });
  test('newBase', () => {
    {
      // removing the base results in extracting a new base from dir
      const new_path = path.newBase('');
      expect(new_path.base).toBe('bbb');
      expect(new_path.name).toBe('bbb');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe('bbb');
    }
    {
      const new_path = path.newBase('zzz');
      expect(new_path.base).toBe('zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz'));
      expect(new_path.standard_path).toBe('bbb/zzz');
    }
    {
      const new_path = path.newBase('zzz.zzz');
      expect(new_path.base).toBe('zzz.zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz.zzz'));
      expect(new_path.standard_path).toBe('bbb/zzz.zzz');
    }
  });
  test('newName', () => {
    expect(() => path.newName('')).toThrow();
    {
      const new_path = path.newName('.');
      expect(new_path.base).toBe('..ddd');
      expect(new_path.name).toBe('.');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/..ddd'));
      expect(new_path.standard_path).toBe('bbb/..ddd');
    }
    {
      const new_path = path.newName('zzz');
      expect(new_path.base).toBe('zzz.ddd');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz.ddd'));
      expect(new_path.standard_path).toBe('bbb/zzz.ddd');
    }
    {
      const new_path = path.newName('.zzz');
      expect(new_path.base).toBe('.zzz.ddd');
      expect(new_path.name).toBe('.zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/.zzz.ddd'));
      expect(new_path.standard_path).toBe('bbb/.zzz.ddd');
    }
  });
  test('newExt', () => {
    {
      const new_path = path.newExt('');
      expect(new_path.base).toBe('ccc');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc'));
      expect(new_path.standard_path).toBe('bbb/ccc');
    }
    {
      const new_path = path.newExt('.');
      expect(new_path.base).toBe('ccc.');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc.'));
      expect(new_path.standard_path).toBe('bbb/ccc.');
    }
    {
      const new_path = path.newExt('zzz');
      expect(new_path.base).toBe('ccc.zzz');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_path.standard_path).toBe('bbb/ccc.zzz');
    }
    {
      const new_path = path.newExt('.zzz');
      expect(new_path.base).toBe('ccc.zzz');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_path.standard_path).toBe('bbb/ccc.zzz');
    }
    expect(() => path.newExt('..zzz')).toThrow();
    expect(() => path.newExt('yyy.zzz')).toThrow();
  });
});

describe(`new ${Path.name}('bbb/ccc...ddd')`, () => {
  const path = new Path('bbb/ccc...ddd');
  test('dir', () => {
    expect(path.dir).toBe('bbb');
  });
  test('root', () => {
    expect(path.root).toBe('');
  });
  test('base', () => {
    expect(path.base).toBe('ccc...ddd');
  });
  test('name', () => {
    expect(path.name).toBe('ccc..');
  });
  test('ext', () => {
    expect(path.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(path.path).toBe(node_path.normalize('bbb/ccc...ddd'));
    expect(path.path).toBe(node_path.normalize('bbb\\ccc...ddd'));
  });
  test('standardPath', () => {
    expect(path.standard_path).toBe('bbb/ccc...ddd');
  });
  test('newDir', () => {
    {
      const new_path = path.newDir('');
      expect(new_path.dir).toBe('');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe('ccc...ddd');
    }
    {
      const new_path = path.newDir('zzz');
      expect(new_path.dir).toBe('zzz');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/ccc...ddd'));
      expect(new_path.standard_path).toBe('zzz/ccc...ddd');
    }
    {
      const new_path = path.newDir('zzz/yyy');
      expect(new_path.dir).toBe(node_path.normalize('zzz/yyy'));
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/yyy/ccc...ddd'));
      expect(new_path.standard_path).toBe('zzz/yyy/ccc...ddd');
    }
    {
      const new_path = path.newDir('/zzz');
      expect(new_path.dir).toBe(node_path.normalize('/zzz'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/zzz/ccc...ddd'));
      expect(new_path.standard_path).toBe('/zzz/ccc...ddd');
    }
    {
      const new_path = path.newDir('c:\\zzz');
      expect(new_path.dir).toBe(node_path.normalize('c:\\zzz'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\zzz/ccc...ddd'));
      expect(new_path.standard_path).toBe('c:/zzz/ccc...ddd');
    }
  });
  test('newRoot', () => {
    {
      const new_path = path.newRoot('');
      expect(new_path.dir).toBe('bbb');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc...ddd'));
      expect(new_path.standard_path).toBe('bbb/ccc...ddd');
    }
    {
      const new_path = path.newRoot('/');
      expect(new_path.dir).toBe(node_path.normalize('/bbb'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/bbb/ccc...ddd'));
      expect(new_path.standard_path).toBe('/bbb/ccc...ddd');
    }
    {
      const new_path = path.newRoot('c:\\');
      expect(new_path.dir).toBe(node_path.normalize('c:\\bbb'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\bbb/ccc...ddd'));
      expect(new_path.standard_path).toBe('c:/bbb/ccc...ddd');
    }
  });
  test('newBase', () => {
    {
      // removing the base results in extracting a new base from dir
      const new_path = path.newBase('');
      expect(new_path.base).toBe('bbb');
      expect(new_path.name).toBe('bbb');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe('bbb');
    }
    {
      const new_path = path.newBase('zzz');
      expect(new_path.base).toBe('zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz'));
      expect(new_path.standard_path).toBe('bbb/zzz');
    }
    {
      const new_path = path.newBase('zzz.zzz');
      expect(new_path.base).toBe('zzz.zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz.zzz'));
      expect(new_path.standard_path).toBe('bbb/zzz.zzz');
    }
  });
  test('newName', () => {
    expect(() => path.newName('')).toThrow();
    {
      const new_path = path.newName('.');
      expect(new_path.base).toBe('..ddd');
      expect(new_path.name).toBe('.');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/..ddd'));
      expect(new_path.standard_path).toBe('bbb/..ddd');
    }
    {
      const new_path = path.newName('zzz');
      expect(new_path.base).toBe('zzz.ddd');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/zzz.ddd'));
      expect(new_path.standard_path).toBe('bbb/zzz.ddd');
    }
    {
      const new_path = path.newName('.zzz');
      expect(new_path.base).toBe('.zzz.ddd');
      expect(new_path.name).toBe('.zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('bbb/.zzz.ddd'));
      expect(new_path.standard_path).toBe('bbb/.zzz.ddd');
    }
  });
  test('newExt', () => {
    {
      // a trailing dot will be consumed as the new extension
      const new_path = path.newExt('');
      expect(new_path.base).toBe('ccc..');
      expect(new_path.name).toBe('ccc.');
      expect(new_path.ext).toBe('.');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc..'));
      expect(new_path.standard_path).toBe('bbb/ccc..');
    }
    {
      const new_path = path.newExt('.');
      expect(new_path.base).toBe('ccc...');
      expect(new_path.name).toBe('ccc..');
      expect(new_path.ext).toBe('.');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc...'));
      expect(new_path.standard_path).toBe('bbb/ccc...');
    }
    {
      const new_path = path.newExt('zzz');
      expect(new_path.base).toBe('ccc...zzz');
      expect(new_path.name).toBe('ccc..');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc...zzz'));
      expect(new_path.standard_path).toBe('bbb/ccc...zzz');
    }
    {
      const new_path = path.newExt('.zzz');
      expect(new_path.base).toBe('ccc...zzz');
      expect(new_path.name).toBe('ccc..');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('bbb/ccc...zzz'));
      expect(new_path.standard_path).toBe('bbb/ccc...zzz');
    }
    expect(() => path.newExt('..zzz')).toThrow();
    expect(() => path.newExt('yyy.zzz')).toThrow();
  });
});

describe(`new ${Path.name}('aaa/bbb/ccc.ddd')`, () => {
  const path = new Path('aaa/bbb/ccc.ddd');
  test('dir', () => {
    expect(path.dir).toBe(node_path.normalize('aaa/bbb'));
  });
  test('root', () => {
    expect(path.root).toBe('');
  });
  test('base', () => {
    expect(path.base).toBe('ccc.ddd');
  });
  test('name', () => {
    expect(path.name).toBe('ccc');
  });
  test('ext', () => {
    expect(path.ext).toBe('.ddd');
  });
  test('path', () => {
    expect(path.path).toBe(node_path.normalize('aaa/bbb/ccc.ddd'));
    expect(path.path).toBe(node_path.normalize('aaa\\bbb\\ccc.ddd'));
  });
  test('standardPath', () => {
    expect(path.standard_path).toBe('aaa/bbb/ccc.ddd');
  });
  test('newDir', () => {
    {
      const new_path = path.newDir('');
      expect(new_path.dir).toBe('');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe('ccc.ddd');
    }
    {
      const new_path = path.newDir('zzz');
      expect(new_path.dir).toBe('zzz');
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('zzz/ccc.ddd');
    }
    {
      const new_path = path.newDir('zzz/yyy');
      expect(new_path.dir).toBe(node_path.normalize('zzz/yyy'));
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('zzz/yyy/ccc.ddd'));
      expect(new_path.standard_path).toBe('zzz/yyy/ccc.ddd');
    }
    {
      const new_path = path.newDir('/zzz');
      expect(new_path.dir).toBe(node_path.normalize('/zzz'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('/zzz/ccc.ddd');
    }
    {
      const new_path = path.newDir('c:\\zzz');
      expect(new_path.dir).toBe(node_path.normalize('c:\\zzz'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\zzz/ccc.ddd'));
      expect(new_path.standard_path).toBe('c:/zzz/ccc.ddd');
    }
  });
  test('newRoot', () => {
    {
      const new_path = path.newRoot('');
      expect(new_path.dir).toBe(node_path.normalize('aaa/bbb'));
      expect(new_path.root).toBe('');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('aaa/bbb/ccc.ddd');
    }
    {
      const new_path = path.newRoot('/');
      expect(new_path.dir).toBe(node_path.normalize('/aaa/bbb'));
      expect(new_path.root).toBe(node_path.normalize('/'));
      expect(new_path.path).toBe(node_path.normalize('/aaa/bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('/aaa/bbb/ccc.ddd');
    }
    {
      const new_path = path.newRoot('c:\\');
      expect(new_path.dir).toBe(node_path.normalize('c:\\aaa/bbb'));
      expect(new_path.root).toBe(node_path.normalize('c:\\'));
      expect(new_path.path).toBe(node_path.normalize('c:\\aaa/bbb/ccc.ddd'));
      expect(new_path.standard_path).toBe('c:/aaa/bbb/ccc.ddd');
    }
  });
  test('newBase', () => {
    {
      // removing the base results in extracting a new base from dir
      const new_path = path.newBase('');
      expect(new_path.base).toBe('bbb');
      expect(new_path.name).toBe('bbb');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb'));
      expect(new_path.standard_path).toBe('aaa/bbb');
    }
    {
      const new_path = path.newBase('zzz');
      expect(new_path.base).toBe('zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/zzz'));
      expect(new_path.standard_path).toBe('aaa/bbb/zzz');
    }
    {
      const new_path = path.newBase('zzz.zzz');
      expect(new_path.base).toBe('zzz.zzz');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/zzz.zzz'));
      expect(new_path.standard_path).toBe('aaa/bbb/zzz.zzz');
    }
  });
  test('newName', () => {
    expect(() => path.newName('')).toThrow();
    {
      const new_path = path.newName('.');
      expect(new_path.base).toBe('..ddd');
      expect(new_path.name).toBe('.');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/..ddd'));
      expect(new_path.standard_path).toBe('aaa/bbb/..ddd');
    }
    {
      const new_path = path.newName('zzz');
      expect(new_path.base).toBe('zzz.ddd');
      expect(new_path.name).toBe('zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/zzz.ddd'));
      expect(new_path.standard_path).toBe('aaa/bbb/zzz.ddd');
    }
    {
      const new_path = path.newName('.zzz');
      expect(new_path.base).toBe('.zzz.ddd');
      expect(new_path.name).toBe('.zzz');
      expect(new_path.ext).toBe('.ddd');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/.zzz.ddd'));
      expect(new_path.standard_path).toBe('aaa/bbb/.zzz.ddd');
    }
  });
  test('newExt', () => {
    {
      const new_path = path.newExt('');
      expect(new_path.base).toBe('ccc');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/ccc'));
      expect(new_path.standard_path).toBe('aaa/bbb/ccc');
    }
    {
      const new_path = path.newExt('.');
      expect(new_path.base).toBe('ccc.');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/ccc.'));
      expect(new_path.standard_path).toBe('aaa/bbb/ccc.');
    }
    {
      const new_path = path.newExt('zzz');
      expect(new_path.base).toBe('ccc.zzz');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_path.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    {
      const new_path = path.newExt('.zzz');
      expect(new_path.base).toBe('ccc.zzz');
      expect(new_path.name).toBe('ccc');
      expect(new_path.ext).toBe('.zzz');
      expect(new_path.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_path.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    expect(() => path.newExt('yyy.zzz')).toThrow();
  });
});

describe(`new ${PathGroup.name}('aaa', 'bbb/ccc.ddd')`, () => {
  const origin = new Path('aaa');
  const relative = new Path('bbb/ccc.ddd');
  const pathGroup = new PathGroup(origin, relative);
  test('originPath', () => {
    expect(pathGroup.origin_path.path).toBe('aaa');
  });
  test('relativePath', () => {
    expect(pathGroup.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
  });
  test('path', () => {
    expect(pathGroup.path).toBe(node_path.normalize('aaa/bbb/ccc.ddd'));
  });
  test('standardPath', () => {
    expect(pathGroup.standard_path).toBe('aaa/bbb/ccc.ddd');
  });
  test('newOrigin', () => {
    {
      const new_group = pathGroup.newOrigin('');
      expect(new_group.origin_path.path).toBe('.');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.standard_path).toBe('bbb/ccc.ddd');
    }
    {
      const new_group = pathGroup.newOrigin('zzz');
      expect(new_group.origin_path.path).toBe('zzz');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('zzz/bbb/ccc.ddd'));
      expect(new_group.standard_path).toBe('zzz/bbb/ccc.ddd');
    }
    {
      const new_group = pathGroup.newOrigin('zzz/yyy');
      expect(new_group.origin_path.path).toBe(node_path.normalize('zzz/yyy'));
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('zzz/yyy/bbb/ccc.ddd'));
      expect(new_group.standard_path).toBe('zzz/yyy/bbb/ccc.ddd');
    }
    {
      const new_group = pathGroup.newOrigin('/zzz');
      expect(new_group.origin_path.path).toBe(node_path.normalize('/zzz'));
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('/zzz/bbb/ccc.ddd'));
      expect(new_group.standard_path).toBe('/zzz/bbb/ccc.ddd');
    }
    {
      const new_group = pathGroup.newOrigin('c:\\zzz');
      expect(new_group.origin_path.path).toBe(node_path.normalize('c:\\zzz'));
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('c:\\zzz/bbb/ccc.ddd'));
      expect(new_group.standard_path).toBe('c:/zzz/bbb/ccc.ddd');
    }
  });
  test('newDir', () => {
    {
      const new_group = pathGroup.newDir('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/ccc.ddd');
    }
    {
      const new_group = pathGroup.newDir('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
    {
      const new_group = pathGroup.newDir('zzz/yyy');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/yyy/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/yyy/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/yyy/ccc.ddd');
    }
    {
      const new_group = pathGroup.newDir('/zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
    {
      const new_group = pathGroup.newDir('c:\\zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
  });
  test('newBase', () => {
    {
      // removing the base results in extracting a new base from dir
      const new_group = pathGroup.newBase('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb'));
      expect(new_group.standard_path).toBe('aaa/bbb');
    }
    {
      const new_group = pathGroup.newBase('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz');
    }
    {
      const new_group = pathGroup.newBase('zzz.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz.zzz');
    }
  });
  test('newName', () => {
    expect(() => pathGroup.newName('')).toThrow();
    {
      const new_group = pathGroup.newName('.');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/..ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/..ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/..ddd');
    }
    {
      const new_group = pathGroup.newName('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz.ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz.ddd');
    }
    {
      const new_group = pathGroup.newName('.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/.zzz.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/.zzz.ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/.zzz.ddd');
    }
  });
  test('newExt', () => {
    {
      const new_group = pathGroup.newExt('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc');
    }
    {
      const new_group = pathGroup.newExt('.');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.');
    }
    {
      const new_group = pathGroup.newExt('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    {
      const new_group = pathGroup.newExt('.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    expect(() => pathGroup.newExt('..zzz')).toThrow();
    expect(() => pathGroup.newExt('yyy.zzz')).toThrow();
  });
});

describe(`new ${PathGroupSet.name}()`, () => {
  const group = new PathGroupSet();
  group.add(PathGroup.Build({ origin_path: 'aaa' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb/ccc' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb/ccc.ddd' }));
  group.add(PathGroup.Build({ relative_path: 'bbb/ccc.ddd' }));
  test('paths', () => {
    expect(Array.from(group.paths)).toEqual([
      node_path.normalize('aaa'), //
      node_path.normalize('aaa/bbb'),
      node_path.normalize('aaa/bbb/ccc'),
      node_path.normalize('aaa/bbb/ccc.ddd'),
      node_path.normalize('bbb/ccc.ddd'),
    ]);
  });
});

describe(`${PathGroupSet.name}(group.pathGroupMap)`, () => {
  const group = new PathGroupSet();
  group.add(PathGroup.Build({ origin_path: 'aaa' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb/ccc' }));
  group.add(PathGroup.Build({ origin_path: 'aaa', relative_path: 'bbb/ccc.ddd' }));
  group.add(PathGroup.Build({ relative_path: 'bbb/ccc.ddd' }));
  const group2 = new PathGroupSet(group.path_group_map);
  test('paths', () => {
    expect(Array.from(group2.paths)).toEqual([
      node_path.normalize('aaa'), //
      node_path.normalize('aaa/bbb'),
      node_path.normalize('aaa/bbb/ccc'),
      node_path.normalize('aaa/bbb/ccc.ddd'),
      node_path.normalize('bbb/ccc.ddd'),
    ]);
  });
});
