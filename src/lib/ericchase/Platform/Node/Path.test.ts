import { describe, expect, test } from 'bun:test';
import node_path from 'node:path';

import { Path, PathGroup, PathGroupSet, PathSet } from './Path.js';

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
  test('standard_path', () => {
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
  test('standard_path', () => {
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
  test('standard_path', () => {
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
  test('standard_path', () => {
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
  test('standard_path', () => {
    expect(path.standard_path).toBe('aaa/bbb/ccc.ddd');
  });
  test('join', () => {
    expect(path.appendSegment('extended/path').path).toBe(node_path.normalize('aaa/bbb/ccc.ddd/extended/path'));
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
  test('origin_path', () => {
    expect(pathGroup.origin_path.path).toBe('aaa');
  });
  test('relative_path', () => {
    expect(pathGroup.relative_path.path).toBe(node_path.normalize('bbb/ccc.ddd'));
  });
  test('path', () => {
    expect(pathGroup.path).toBe(node_path.normalize('aaa/bbb/ccc.ddd'));
  });
  test('standard_path', () => {
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
      const new_group = pathGroup.newRelativeDir('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/ccc.ddd');
    }
    {
      const new_group = pathGroup.newRelativeDir('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
    {
      const new_group = pathGroup.newRelativeDir('zzz/yyy');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/yyy/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/yyy/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/yyy/ccc.ddd');
    }
    {
      const new_group = pathGroup.newRelativeDir('/zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
    {
      const new_group = pathGroup.newRelativeDir('c:\\zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('zzz/ccc.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/zzz/ccc.ddd'));
      expect(new_group.standard_path).toBe('aaa/zzz/ccc.ddd');
    }
  });
  test('newBase', () => {
    {
      // removing the base results in extracting a new base from dir
      const new_group = pathGroup.newRelativeBase('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb'));
      expect(new_group.standard_path).toBe('aaa/bbb');
    }
    {
      const new_group = pathGroup.newRelativeBase('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz');
    }
    {
      const new_group = pathGroup.newRelativeBase('zzz.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz.zzz');
    }
  });
  test('newName', () => {
    expect(() => pathGroup.newRelativeName('')).toThrow();
    {
      const new_group = pathGroup.newRelativeName('.');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/..ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/..ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/..ddd');
    }
    {
      const new_group = pathGroup.newRelativeName('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/zzz.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/zzz.ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/zzz.ddd');
    }
    {
      const new_group = pathGroup.newRelativeName('.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/.zzz.ddd'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/.zzz.ddd'));
      expect(new_group.standard_path).toBe('aaa/bbb/.zzz.ddd');
    }
  });
  test('newExt', () => {
    {
      const new_group = pathGroup.newRelativeExt('');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc');
    }
    {
      const new_group = pathGroup.newRelativeExt('.');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.');
    }
    {
      const new_group = pathGroup.newRelativeExt('zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    {
      const new_group = pathGroup.newRelativeExt('.zzz');
      expect(new_group.origin_path.path).toBe('aaa');
      expect(new_group.relative_path.path).toBe(node_path.normalize('bbb/ccc.zzz'));
      expect(new_group.path).toBe(node_path.normalize('aaa/bbb/ccc.zzz'));
      expect(new_group.standard_path).toBe('aaa/bbb/ccc.zzz');
    }
    expect(() => pathGroup.newRelativeExt('..zzz')).toThrow();
    expect(() => pathGroup.newRelativeExt('yyy.zzz')).toThrow();
  });
});

describe(`new ${PathSet.name}()`, () => {
  const group = new PathSet();
  group.add(Path.build({ dir: 'aaa', base: '' }));
  group.add(Path.build({ dir: 'aaa', base: 'bbb' }));
  group.add(Path.build({ dir: 'aaa', base: 'bbb/ccc' }));
  group.add(Path.build({ dir: 'aaa', base: 'bbb/ccc.ddd' }));
  group.add(Path.build({ base: 'bbb/ccc.ddd' }));
  test('paths', () => {
    expect([...group.paths]).toEqual([
      node_path.normalize('aaa'), //
      node_path.normalize('aaa/bbb'),
      node_path.normalize('aaa/bbb/ccc'),
      node_path.normalize('aaa/bbb/ccc.ddd'),
      node_path.normalize('bbb/ccc.ddd'),
    ]);
  });
  test('size', () => {
    expect(group.size).toBe(5);
  });
});

describe(`new ${PathGroupSet.name}()`, () => {
  const group = new PathGroupSet();
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: '' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb/ccc' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb/ccc.ddd' }));
  group.add(PathGroup.build({ relative_path: 'bbb/ccc.ddd' }));
  test('paths', () => {
    expect([...group.paths]).toEqual([
      node_path.normalize('aaa'), //
      node_path.normalize('aaa/bbb'),
      node_path.normalize('aaa/bbb/ccc'),
      node_path.normalize('aaa/bbb/ccc.ddd'),
      node_path.normalize('bbb/ccc.ddd'),
    ]);
  });
  test('size', () => {
    expect(group.size).toBe(5);
  });
});

describe(`${PathGroupSet.name}(group.pathGroupMap)`, () => {
  const group = new PathGroupSet();
  group.add(PathGroup.build({ origin_path: 'aaa' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb/ccc' }));
  group.add(PathGroup.build({ origin_path: 'aaa', relative_path: 'bbb/ccc.ddd' }));
  group.add(PathGroup.build({ relative_path: 'bbb/ccc.ddd' }));
  const group2 = new PathGroupSet(group.path_group_map);
  test('paths', () => {
    expect([...group2.paths]).toEqual([
      node_path.normalize('aaa'), //
      node_path.normalize('aaa/bbb'),
      node_path.normalize('aaa/bbb/ccc'),
      node_path.normalize('aaa/bbb/ccc.ddd'),
      node_path.normalize('bbb/ccc.ddd'),
    ]);
  });
  test('size', () => {
    expect(group.size).toBe(5);
  });
});
