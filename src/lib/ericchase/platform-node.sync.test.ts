import { describe, expect, test } from 'bun:test';
import { NODE_PATH } from './NodePlatform.js';
import { Class_NodePlatform_PathObject, NodePlatform_PathObject } from './NodePlatform_PathObject.js';

// describe(NodePlatform_Path_CountSegments.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_CountSegments('')).toEqual(0);
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_CountSegments('.')).toEqual(1);
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_CountSegments('..')).toEqual(1);
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_CountSegments('/')).toEqual(1);
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_CountSegments('./')).toEqual(1);
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_CountSegments('../')).toEqual(1);
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_CountSegments('\\')).toEqual(1);
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_CountSegments('.\\')).toEqual(1);
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_CountSegments('..\\')).toEqual(1);
//     });
//   });
//   test('should count number of segments in path', () => {
//     expect(NodePlatform_Path_CountSegments('name.ext')).toEqual(1);
//     expect(NodePlatform_Path_CountSegments('path')).toEqual(1);
//     expect(NodePlatform_Path_CountSegments('path/')).toEqual(1);
//     expect(NodePlatform_Path_CountSegments('path/name.ext')).toEqual(2);
//     expect(NodePlatform_Path_CountSegments('path/to/dir')).toEqual(3);
//     expect(NodePlatform_Path_CountSegments('path/to/dir/')).toEqual(3);
//     expect(NodePlatform_Path_CountSegments('path/to/dir/name.ext')).toEqual(4);

//     expect(NodePlatform_Path_CountSegments('path/to\\dir/name.ext')).toEqual(4);
//     expect(NodePlatform_Path_CountSegments('path/to\\dir/name.ext')).toEqual(4);
//     expect(NodePlatform_Path_CountSegments('path/to\\dir/name.ext\\')).toEqual(4);
//     expect(NodePlatform_Path_CountSegments('path\\to/dir\\name.ext')).toEqual(4);
//     expect(NodePlatform_Path_CountSegments('path\\to/dir\\name.ext/')).toEqual(4);

//     expect(NodePlatform_Path_CountSegments('/path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('/path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('/path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('/path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('\\path/to\\dir/name.ext\\')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('\\path/to\\dir/name.ext\\')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('./path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('./path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('./path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('./path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('.\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('.\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('.\\path/to\\dir/name.ext\\')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('.\\path/to\\dir/name.ext\\')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('../path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('../path\\to/dir\\name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('../path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('../path\\to/dir\\name.ext/')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('..\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('..\\path/to\\dir/name.ext')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('..\\path/to\\dir/name.ext\\')).toEqual(5);
//     expect(NodePlatform_Path_CountSegments('..\\path/to\\dir/name.ext\\')).toEqual(5);
//   });
// });

// describe(NodePlatform_Path_GetBaseName.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_GetBaseName('')).toEqual('');
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_GetBaseName('.')).toEqual('.');
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_GetBaseName('..')).toEqual('..');
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_GetBaseName('/')).toEqual('/');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_GetBaseName('./')).toEqual('.');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_GetBaseName('../')).toEqual('..');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_GetBaseName('\\')).toEqual('\\');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_GetBaseName('.\\')).toEqual('.');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_GetBaseName('..\\')).toEqual('..');
//     });
//   });
//   test('should return last segment without trailing slash', () => {
//     expect(NodePlatform_Path_GetBaseName('name.ext')).toEqual('name.ext');
//     expect(NodePlatform_Path_GetBaseName('path')).toEqual('path');
//     expect(NodePlatform_Path_GetBaseName('path/')).toEqual('path');
//     expect(NodePlatform_Path_GetBaseName('path/name.ext')).toEqual('name.ext');
//     expect(NodePlatform_Path_GetBaseName('path/to/dir')).toEqual('dir');
//     expect(NodePlatform_Path_GetBaseName('path/to/dir/')).toEqual('dir');
//     expect(NodePlatform_Path_GetBaseName('path/to/dir/name.ext')).toEqual('name.ext');
//   });
// });

// describe(NodePlatform_Path_GetDirName.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_GetDirName('')).toEqual('.' + NODE_PATH.sep);
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_GetDirName('.')).toEqual('.' + NODE_PATH.sep);
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_GetDirName('..')).toEqual('.' + NODE_PATH.sep);
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_GetDirName('/')).toEqual('/');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_GetDirName('./')).toEqual('./');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_GetDirName('../')).toEqual('./');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_GetDirName('\\')).toEqual('\\');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_GetDirName('.\\')).toEqual('.\\');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_GetDirName('..\\')).toEqual('.\\');
//     });
//   });
//   test('single segment relative paths should return . with existing trailing slash or new platform specific slash', () => {
//     expect(NodePlatform_Path_GetDirName('name.ext')).toEqual('.' + NODE_PATH.sep);
//     expect(NodePlatform_Path_GetDirName('path')).toEqual('.' + NODE_PATH.sep);
//     expect(NodePlatform_Path_GetDirName('path/')).toEqual('./');
//   });
//   test('multiple segment paths should remove last segment', () => {
//     expect(NodePlatform_Path_GetDirName('path/name.ext')).toEqual('path/');
//     expect(NodePlatform_Path_GetDirName('path/to/dir')).toEqual('path/to/');
//     expect(NodePlatform_Path_GetDirName('path/to/dir/')).toEqual('path/to/');
//     expect(NodePlatform_Path_GetDirName('path/to/dir/name.ext')).toEqual('path/to/dir/');
//   });
// });

// describe(NodePlatform_Path_GetExtension.name, () => {
//   describe('edge cases', () => {
//     test('should return empty string if basename has no dot', () => {
//       expect(NodePlatform_Path_GetExtension('')).toEqual('');
//       expect(NodePlatform_Path_GetExtension('path/to/dir/name')).toEqual('');
//     });
//     test('should return empty string if basename is "." or ".."', () => {
//       expect(NodePlatform_Path_GetExtension('.')).toEqual('');
//       expect(NodePlatform_Path_GetExtension('..')).toEqual('');
//     });
//   });
//   test('should return substring of basename after last dot including the dot', () => {
//     expect(NodePlatform_Path_GetExtension('path/to/dir/.name')).toEqual('.name');
//     expect(NodePlatform_Path_GetExtension('path/to/dir/name.ext')).toEqual('.ext');
//   });
// });

// describe(NodePlatform_Path_GetName.name, () => {
//   describe('edge cases', () => {
//     test('should return basename if basename has no dot', () => {
//       expect(NodePlatform_Path_GetName('')).toEqual('');
//       expect(NodePlatform_Path_GetName('path/to/dir/name')).toEqual('name');
//     });
//     test('should return basename if basename is "." or ".."', () => {
//       expect(NodePlatform_Path_GetName('.')).toEqual('.');
//       expect(NodePlatform_Path_GetName('..')).toEqual('..');
//     });
//   });
//   test('should return substring of basename before last dot excluding the dot', () => {
//     expect(NodePlatform_Path_GetName('path/to/dir/.name')).toEqual('');
//     expect(NodePlatform_Path_GetName('path/to/dir/name.ext')).toEqual('name');
//   });
// });

// describe(NodePlatform_Path_GetSegments.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_GetSegments('')).toEqual([]);
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_GetSegments('.')).toEqual(['.']);
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_GetSegments('..')).toEqual(['..']);
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_GetSegments('/')).toEqual(['/']);
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_GetSegments('./')).toEqual(['.']);
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_GetSegments('../')).toEqual(['..']);
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_GetSegments('\\')).toEqual(['\\']);
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_GetSegments('.\\')).toEqual(['.']);
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_GetSegments('..\\')).toEqual(['..']);
//     });
//   });
//   test('should split path into segments', () => {
//     expect(NodePlatform_Path_GetSegments('path/to\\dir/name.ext')).toEqual(['path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('path/to\\dir/name.ext\\')).toEqual(['path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('path\\to/dir\\name.ext')).toEqual(['path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('path\\to/dir\\name.ext/')).toEqual(['path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('/path\\to/dir\\name.ext')).toEqual(['/', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('/path\\to/dir\\name.ext')).toEqual(['/', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('/path\\to/dir\\name.ext/')).toEqual(['/', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('/path\\to/dir\\name.ext/')).toEqual(['/', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('\\path/to\\dir/name.ext')).toEqual(['\\', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('\\path/to\\dir/name.ext')).toEqual(['\\', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('\\path/to\\dir/name.ext\\')).toEqual(['\\', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('\\path/to\\dir/name.ext\\')).toEqual(['\\', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('./path\\to/dir\\name.ext')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('./path\\to/dir\\name.ext')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('./path\\to/dir\\name.ext/')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('./path\\to/dir\\name.ext/')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('.\\path/to\\dir/name.ext')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('.\\path/to\\dir/name.ext')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('.\\path/to\\dir/name.ext\\')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('.\\path/to\\dir/name.ext\\')).toEqual(['.', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('../path\\to/dir\\name.ext')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('../path\\to/dir\\name.ext')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('../path\\to/dir\\name.ext/')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('../path\\to/dir\\name.ext/')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('..\\path/to\\dir/name.ext')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('..\\path/to\\dir/name.ext')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('..\\path/to\\dir/name.ext\\')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//     expect(NodePlatform_Path_GetSegments('..\\path/to\\dir/name.ext\\')).toEqual(['..', 'path', 'to', 'dir', 'name.ext']);
//   });
// });

// describe(NodePlatform_Path_Join.name, () => {
//   test('should discard leading .', () => {
//     expect(NodePlatform_Path_Join('.', 'dir', 'name.ext')).toEqual('dir' + NODE_PATH.sep + 'name.ext');
//     expect(NodePlatform_Path_Join('.\\dir', 'name.ext')).toEqual('dir' + NODE_PATH.sep + 'name.ext');
//   });
//   test('should keep leading ..', () => {
//     expect(NodePlatform_Path_Join('..', 'dir', 'name.ext')).toEqual('..' + NODE_PATH.sep + 'dir' + NODE_PATH.sep + 'name.ext');
//     expect(NodePlatform_Path_Join('..\\dir', 'name.ext')).toEqual('..' + NODE_PATH.sep + 'dir' + NODE_PATH.sep + 'name.ext');
//   });
//   test('should not confuse dot path with .', () => {
//     expect(NodePlatform_Path_Join('.dir', 'name.ext')).toEqual('.dir' + NODE_PATH.sep + 'name.ext');
//   });
//   test('should not confuse dot path with .', () => {
//     expect(NodePlatform_Path_Join('..dir', 'name.ext')).toEqual('..dir' + NODE_PATH.sep + 'name.ext');
//   });
// });

// describe(NodePlatform_Path_ReplaceBaseName.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('', 'name.ext')).toEqual('name.ext');
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('.', 'name.ext')).toEqual('name.ext');
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('..', 'name.ext')).toEqual('name.ext');
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('/', 'name.ext')).toEqual('name.ext');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('./', 'name.ext')).toEqual('name.ext/');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('../', 'name.ext')).toEqual('name.ext/');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('\\', 'name.ext')).toEqual('name.ext');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('.\\', 'name.ext')).toEqual('name.ext\\');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_ReplaceBaseName('..\\', 'name.ext')).toEqual('name.ext\\');
//     });
//   });
//   test('should replace existing basename, name only', () => {
//     expect(NodePlatform_Path_ReplaceBaseName('existing', 'new')).toEqual('new');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/existing', 'new')).toEqual('dir/new');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/existing', 'new')).toEqual('./dir/new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceBaseName('existing/', 'new')).toEqual('new/');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/existing/', 'new')).toEqual('dir/new/');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/existing/', 'new')).toEqual('./dir/new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\existing', 'new')).toEqual('dir\\new');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\existing', 'new')).toEqual('.\\dir\\new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceBaseName('existing\\', 'new')).toEqual('new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\existing\\', 'new')).toEqual('dir\\new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\existing\\', 'new')).toEqual('.\\dir\\new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/existing', 'new')).toEqual('path/to\\dir/new');
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/existing\\', 'new')).toEqual('path/to\\dir/new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\existing', 'new')).toEqual('path\\to/dir\\new');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\existing/', 'new')).toEqual('path\\to/dir\\new/');
//   });
//   test('should replace existing basename, extension only', () => {
//     expect(NodePlatform_Path_ReplaceBaseName('.existing', '.new')).toEqual('.new');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/.existing', '.new')).toEqual('dir/.new');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/.existing', '.new')).toEqual('./dir/.new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceBaseName('.existing/', '.new')).toEqual('.new/');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/.existing/', '.new')).toEqual('dir/.new/');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/.existing/', '.new')).toEqual('./dir/.new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\.existing', '.new')).toEqual('dir\\.new');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\.existing', '.new')).toEqual('.\\dir\\.new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceBaseName('.existing\\', '.new')).toEqual('.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\.existing\\', '.new')).toEqual('dir\\.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\.existing\\', '.new')).toEqual('.\\dir\\.new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/.existing', '.new')).toEqual('path/to\\dir/.new');
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/.existing\\', '.new')).toEqual('path/to\\dir/.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\.existing', '.new')).toEqual('path\\to/dir\\.new');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\.existing/', '.new')).toEqual('path\\to/dir\\.new/');
//   });
//   test('should replace existing basename, name and extension', () => {
//     expect(NodePlatform_Path_ReplaceBaseName('existing.existing', 'new.new')).toEqual('new.new');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/existing.existing', 'new.new')).toEqual('dir/new.new');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/existing.existing', 'new.new')).toEqual('./dir/new.new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceBaseName('existing.existing/', 'new.new')).toEqual('new.new/');
//     expect(NodePlatform_Path_ReplaceBaseName('dir/existing.existing/', 'new.new')).toEqual('dir/new.new/');
//     expect(NodePlatform_Path_ReplaceBaseName('./dir/existing.existing/', 'new.new')).toEqual('./dir/new.new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\existing.existing', 'new.new')).toEqual('dir\\new.new');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\existing.existing', 'new.new')).toEqual('.\\dir\\new.new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceBaseName('existing.existing\\', 'new.new')).toEqual('new.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('dir\\existing.existing\\', 'new.new')).toEqual('dir\\new.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('.\\dir\\existing.existing\\', 'new.new')).toEqual('.\\dir\\new.new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/existing.existing', 'new.new')).toEqual('path/to\\dir/new.new');
//     expect(NodePlatform_Path_ReplaceBaseName('path/to\\dir/existing.existing\\', 'new.new')).toEqual('path/to\\dir/new.new\\');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\existing.existing', 'new.new')).toEqual('path\\to/dir\\new.new');
//     expect(NodePlatform_Path_ReplaceBaseName('path\\to/dir\\existing.existing/', 'new.new')).toEqual('path\\to/dir\\new.new/');
//   });
// });

// describe(NodePlatform_Path_ReplaceExtension.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_ReplaceExtension('', 'ext')).toEqual('.ext');
//       expect(NodePlatform_Path_ReplaceExtension('', '.ext')).toEqual('.ext');
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_ReplaceExtension('.', 'ext')).toEqual('..ext');
//       expect(NodePlatform_Path_ReplaceExtension('.', '.ext')).toEqual('..ext');
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_ReplaceExtension('..', 'ext')).toEqual('...ext');
//       expect(NodePlatform_Path_ReplaceExtension('..', '.ext')).toEqual('...ext');
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('/', 'ext')).toEqual('.ext');
//       expect(NodePlatform_Path_ReplaceExtension('/', '.ext')).toEqual('.ext');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('./', 'ext')).toEqual('..ext/');
//       expect(NodePlatform_Path_ReplaceExtension('./', '.ext')).toEqual('..ext/');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('../', 'ext')).toEqual('...ext/');
//       expect(NodePlatform_Path_ReplaceExtension('../', '.ext')).toEqual('...ext/');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('\\', 'ext')).toEqual('.ext');
//       expect(NodePlatform_Path_ReplaceExtension('\\', '.ext')).toEqual('.ext');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('.\\', 'ext')).toEqual('..ext\\');
//       expect(NodePlatform_Path_ReplaceExtension('.\\', '.ext')).toEqual('..ext\\');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_ReplaceExtension('..\\', 'ext')).toEqual('...ext\\');
//       expect(NodePlatform_Path_ReplaceExtension('..\\', '.ext')).toEqual('...ext\\');
//     });
//   });
//   test('should replace existing extension', () => {
//     expect(NodePlatform_Path_ReplaceExtension('.existing', '.new')).toEqual('.new');
//     expect(NodePlatform_Path_ReplaceExtension('dir/.existing', '.new')).toEqual('dir/.new');
//     expect(NodePlatform_Path_ReplaceExtension('./dir/.existing', '.new')).toEqual('./dir/.new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceExtension('.existing/', '.new')).toEqual('.new/');
//     expect(NodePlatform_Path_ReplaceExtension('dir/.existing/', '.new')).toEqual('dir/.new/');
//     expect(NodePlatform_Path_ReplaceExtension('./dir/.existing/', '.new')).toEqual('./dir/.new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceExtension('dir\\.existing', '.new')).toEqual('dir\\.new');
//     expect(NodePlatform_Path_ReplaceExtension('.\\dir\\.existing', '.new')).toEqual('.\\dir\\.new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceExtension('.existing\\', '.new')).toEqual('.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('dir\\.existing\\', '.new')).toEqual('dir\\.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('.\\dir\\.existing\\', '.new')).toEqual('.\\dir\\.new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceExtension('path/to\\dir/.existing', '.new')).toEqual('path/to\\dir/.new');
//     expect(NodePlatform_Path_ReplaceExtension('path/to\\dir/.existing\\', '.new')).toEqual('path/to\\dir/.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('path\\to/dir\\.existing', '.new')).toEqual('path\\to/dir\\.new');
//     expect(NodePlatform_Path_ReplaceExtension('path\\to/dir\\.existing/', '.new')).toEqual('path\\to/dir\\.new/');
//   });
//   test('should replace existing extension, keeping name', () => {
//     expect(NodePlatform_Path_ReplaceExtension('name.existing', '.new')).toEqual('name.new');
//     expect(NodePlatform_Path_ReplaceExtension('dir/name.existing', '.new')).toEqual('dir/name.new');
//     expect(NodePlatform_Path_ReplaceExtension('./dir/name.existing', '.new')).toEqual('./dir/name.new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceExtension('name.existing/', '.new')).toEqual('name.new/');
//     expect(NodePlatform_Path_ReplaceExtension('dir/name.existing/', '.new')).toEqual('dir/name.new/');
//     expect(NodePlatform_Path_ReplaceExtension('./dir/name.existing/', '.new')).toEqual('./dir/name.new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceExtension('dir\\name.existing', '.new')).toEqual('dir\\name.new');
//     expect(NodePlatform_Path_ReplaceExtension('.\\dir\\name.existing', '.new')).toEqual('.\\dir\\name.new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceExtension('name.existing\\', '.new')).toEqual('name.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('dir\\name.existing\\', '.new')).toEqual('dir\\name.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('.\\dir\\name.existing\\', '.new')).toEqual('.\\dir\\name.new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceExtension('path/to\\dir/name.existing', '.new')).toEqual('path/to\\dir/name.new');
//     expect(NodePlatform_Path_ReplaceExtension('path/to\\dir/name.existing\\', '.new')).toEqual('path/to\\dir/name.new\\');
//     expect(NodePlatform_Path_ReplaceExtension('path\\to/dir\\name.existing', '.new')).toEqual('path\\to/dir\\name.new');
//     expect(NodePlatform_Path_ReplaceExtension('path\\to/dir\\name.existing/', '.new')).toEqual('path\\to/dir\\name.new/');
//   });
// });

// describe(NodePlatform_Path_ReplaceName.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_ReplaceName('', 'name')).toEqual('name');
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_ReplaceName('.', 'name')).toEqual('name');
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_ReplaceName('..', 'name')).toEqual('name');
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_ReplaceName('/', 'name')).toEqual('name');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_ReplaceName('./', 'name')).toEqual('name/');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_ReplaceName('../', 'name')).toEqual('name/');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_ReplaceName('\\', 'name')).toEqual('name');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_ReplaceName('.\\', 'name')).toEqual('name\\');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_ReplaceName('..\\', 'name')).toEqual('name\\');
//     });
//   });
//   test('should replace existing name', () => {
//     expect(NodePlatform_Path_ReplaceName('existing', 'new')).toEqual('new');
//     expect(NodePlatform_Path_ReplaceName('dir/existing', 'new')).toEqual('dir/new');
//     expect(NodePlatform_Path_ReplaceName('./dir/existing', 'new')).toEqual('./dir/new');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceName('existing/', 'new')).toEqual('new/');
//     expect(NodePlatform_Path_ReplaceName('dir/existing/', 'new')).toEqual('dir/new/');
//     expect(NodePlatform_Path_ReplaceName('./dir/existing/', 'new')).toEqual('./dir/new/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceName('dir\\existing', 'new')).toEqual('dir\\new');
//     expect(NodePlatform_Path_ReplaceName('.\\dir\\existing', 'new')).toEqual('.\\dir\\new');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceName('existing\\', 'new')).toEqual('new\\');
//     expect(NodePlatform_Path_ReplaceName('dir\\existing\\', 'new')).toEqual('dir\\new\\');
//     expect(NodePlatform_Path_ReplaceName('.\\dir\\existing\\', 'new')).toEqual('.\\dir\\new\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceName('path/to\\dir/existing', 'new')).toEqual('path/to\\dir/new');
//     expect(NodePlatform_Path_ReplaceName('path/to\\dir/existing\\', 'new')).toEqual('path/to\\dir/new\\');
//     expect(NodePlatform_Path_ReplaceName('path\\to/dir\\existing', 'new')).toEqual('path\\to/dir\\new');
//     expect(NodePlatform_Path_ReplaceName('path\\to/dir\\existing/', 'new')).toEqual('path\\to/dir\\new/');
//   });
//   test('should replace existing name, keeping extension', () => {
//     expect(NodePlatform_Path_ReplaceName('existing.ext', 'new')).toEqual('new.ext');
//     expect(NodePlatform_Path_ReplaceName('dir/existing.ext', 'new')).toEqual('dir/new.ext');
//     expect(NodePlatform_Path_ReplaceName('./dir/existing.ext', 'new')).toEqual('./dir/new.ext');
//     // trailing slash
//     expect(NodePlatform_Path_ReplaceName('existing.ext/', 'new')).toEqual('new.ext/');
//     expect(NodePlatform_Path_ReplaceName('dir/existing.ext/', 'new')).toEqual('dir/new.ext/');
//     expect(NodePlatform_Path_ReplaceName('./dir/existing.ext/', 'new')).toEqual('./dir/new.ext/');
//     // backslash
//     expect(NodePlatform_Path_ReplaceName('dir\\existing.ext', 'new')).toEqual('dir\\new.ext');
//     expect(NodePlatform_Path_ReplaceName('.\\dir\\existing.ext', 'new')).toEqual('.\\dir\\new.ext');
//     // trailing backslash
//     expect(NodePlatform_Path_ReplaceName('existing.ext\\', 'new')).toEqual('new.ext\\');
//     expect(NodePlatform_Path_ReplaceName('dir\\existing.ext\\', 'new')).toEqual('dir\\new.ext\\');
//     expect(NodePlatform_Path_ReplaceName('.\\dir\\existing.ext\\', 'new')).toEqual('.\\dir\\new.ext\\');
//     // mixed slashes
//     expect(NodePlatform_Path_ReplaceName('path/to\\dir/existing.ext', 'new')).toEqual('path/to\\dir/new.ext');
//     expect(NodePlatform_Path_ReplaceName('path/to\\dir/existing.ext\\', 'new')).toEqual('path/to\\dir/new.ext\\');
//     expect(NodePlatform_Path_ReplaceName('path\\to/dir\\existing.ext', 'new')).toEqual('path\\to/dir\\new.ext');
//     expect(NodePlatform_Path_ReplaceName('path\\to/dir\\existing.ext/', 'new')).toEqual('path\\to/dir\\new.ext/');
//   });
// });

// describe(NodePlatform_Path_Slice.name, () => {
//   describe('edge cases', () => {
//     test('""', () => {
//       expect(NodePlatform_Path_Slice('')).toEqual('');
//     });
//     test('"."', () => {
//       expect(NodePlatform_Path_Slice('.')).toEqual('.');
//     });
//     test('".."', () => {
//       expect(NodePlatform_Path_Slice('..')).toEqual('..');
//     });
//     test('"/"', () => {
//       expect(NodePlatform_Path_Slice('/')).toEqual('/');
//     });
//     test('"./"', () => {
//       expect(NodePlatform_Path_Slice('./')).toEqual('./');
//     });
//     test('"../"', () => {
//       expect(NodePlatform_Path_Slice('../')).toEqual('../');
//     });
//     test('"\\"', () => {
//       expect(NodePlatform_Path_Slice('\\')).toEqual('\\');
//     });
//     test('".\\"', () => {
//       expect(NodePlatform_Path_Slice('.\\')).toEqual('.\\');
//     });
//     test('"..\\"', () => {
//       expect(NodePlatform_Path_Slice('..\\')).toEqual('..\\');
//     });
//   });
//   test('empty string cases', () => {
//     expect(NodePlatform_Path_Slice('')).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 0)).toEqual('');
//     // start >= segment count
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 4)).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 5)).toEqual('');
//     // end <= negative segment count
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -4)).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -5)).toEqual('');
//     // end < start
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 1, 0)).toEqual('');
//   });
//   test('start=0, end=length should preserve path', () => {
//     expect(NodePlatform_Path_Slice('')).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc')).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc\\')).toEqual('path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc')).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc/')).toEqual('path\\to/dir\\abc/');

//     expect(NodePlatform_Path_Slice('/')).toEqual('/');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc')).toEqual('/path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc')).toEqual('/path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/')).toEqual('/path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/')).toEqual('/path\\to/dir\\abc/');

//     expect(NodePlatform_Path_Slice('\\')).toEqual('\\');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc')).toEqual('\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc')).toEqual('\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\')).toEqual('\\path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\')).toEqual('\\path/to\\dir/abc\\');

//     expect(NodePlatform_Path_Slice('.')).toEqual('.');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc')).toEqual('./path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc')).toEqual('./path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/')).toEqual('./path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/')).toEqual('./path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc')).toEqual('.\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc')).toEqual('.\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\')).toEqual('.\\path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\')).toEqual('.\\path/to\\dir/abc\\');

//     expect(NodePlatform_Path_Slice('..')).toEqual('..');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc')).toEqual('../path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc')).toEqual('../path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/')).toEqual('../path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/')).toEqual('../path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc')).toEqual('..\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc')).toEqual('..\\path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\')).toEqual('..\\path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\')).toEqual('..\\path/to\\dir/abc\\');
//   });
//   test('start=0, end=-1 should remove last segment', () => {
//     expect(NodePlatform_Path_Slice('', 0, -1)).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc', 0, -1)).toEqual('path/to\\dir/');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc\\', 0, -1)).toEqual('path/to\\dir/');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc', 0, -1)).toEqual('path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc/', 0, -1)).toEqual('path\\to/dir\\');

//     expect(NodePlatform_Path_Slice('/', 0, -1)).toEqual('');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc', 0, -1)).toEqual('/path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc', 0, -1)).toEqual('/path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/', 0, -1)).toEqual('/path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/', 0, -1)).toEqual('/path\\to/dir\\');

//     expect(NodePlatform_Path_Slice('\\', 0, -1)).toEqual('');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc', 0, -1)).toEqual('\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc', 0, -1)).toEqual('\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\', 0, -1)).toEqual('\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\', 0, -1)).toEqual('\\path/to\\dir/');

//     expect(NodePlatform_Path_Slice('.', 0, -1)).toEqual('');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc', 0, -1)).toEqual('./path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc', 0, -1)).toEqual('./path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/', 0, -1)).toEqual('./path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/', 0, -1)).toEqual('./path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc', 0, -1)).toEqual('.\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc', 0, -1)).toEqual('.\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\', 0, -1)).toEqual('.\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\', 0, -1)).toEqual('.\\path/to\\dir/');

//     expect(NodePlatform_Path_Slice('..', 0, -1)).toEqual('');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc', 0, -1)).toEqual('../path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc', 0, -1)).toEqual('../path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/', 0, -1)).toEqual('../path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/', 0, -1)).toEqual('../path\\to/dir\\');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc', 0, -1)).toEqual('..\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc', 0, -1)).toEqual('..\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\', 0, -1)).toEqual('..\\path/to\\dir/');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\', 0, -1)).toEqual('..\\path/to\\dir/');
//   });
//   test('start=1 should remove first segment', () => {
//     expect(NodePlatform_Path_Slice('', 1)).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc', 1)).toEqual('to\\dir/abc');
//     expect(NodePlatform_Path_Slice('path/to\\dir/abc\\', 1)).toEqual('to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc', 1)).toEqual('to/dir\\abc');
//     expect(NodePlatform_Path_Slice('path\\to/dir\\abc/', 1)).toEqual('to/dir\\abc/');

//     expect(NodePlatform_Path_Slice('/', 1)).toEqual('');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');

//     expect(NodePlatform_Path_Slice('\\', 1)).toEqual('');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');

//     expect(NodePlatform_Path_Slice('.', 1)).toEqual('');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');

//     expect(NodePlatform_Path_Slice('..', 1)).toEqual('');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc', 1)).toEqual('path\\to/dir\\abc');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/', 1)).toEqual('path\\to/dir\\abc/');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc', 1)).toEqual('path/to\\dir/abc');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');
//     expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\', 1)).toEqual('path/to\\dir/abc\\');
//   });
//   test('start=* cases', () => {
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 1)).toEqual('to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 2)).toEqual('dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 3)).toEqual('name.ext');

//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0)).toEqual('/path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 1)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 2)).toEqual('to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 3)).toEqual('dir/name.ext');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 4)).toEqual('name.ext');

//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0)).toEqual('./path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 1)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 2)).toEqual('to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 3)).toEqual('dir/name.ext');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 4)).toEqual('name.ext');

//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0)).toEqual('../path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 1)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 2)).toEqual('to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 3)).toEqual('dir/name.ext');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 4)).toEqual('name.ext');
//   });
//   test('end=* cases', () => {
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 0)).toEqual('');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 1)).toEqual('path/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 2)).toEqual('path/to/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 3)).toEqual('path/to/dir/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 4)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -1)).toEqual('path/to/dir/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -2)).toEqual('path/to/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -3)).toEqual('path/');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, -4)).toEqual('');

//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 0)).toEqual('');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 1)).toEqual('/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 2)).toEqual('/path/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 3)).toEqual('/path/to/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 4)).toEqual('/path/to/dir/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, 5)).toEqual('/path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, -1)).toEqual('/path/to/dir/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, -2)).toEqual('/path/to/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, -3)).toEqual('/path/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, -4)).toEqual('/');
//     expect(NodePlatform_Path_Slice('/path/to/dir/name.ext', 0, -5)).toEqual('');

//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 0)).toEqual('');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 1)).toEqual('./');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 2)).toEqual('./path/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 3)).toEqual('./path/to/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 4)).toEqual('./path/to/dir/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, 5)).toEqual('./path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, -1)).toEqual('./path/to/dir/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, -2)).toEqual('./path/to/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, -3)).toEqual('./path/');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, -4)).toEqual('./');
//     expect(NodePlatform_Path_Slice('./path/to/dir/name.ext', 0, -5)).toEqual('');

//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 0)).toEqual('');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 1)).toEqual('../');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 2)).toEqual('../path/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 3)).toEqual('../path/to/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 4)).toEqual('../path/to/dir/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, 5)).toEqual('../path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, -1)).toEqual('../path/to/dir/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, -2)).toEqual('../path/to/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, -3)).toEqual('../path/');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, -4)).toEqual('../');
//     expect(NodePlatform_Path_Slice('../path/to/dir/name.ext', 0, -5)).toEqual('');
//   });
//   test('start <= negative segment count, should set start to 0', () => {
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', -4)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', -5)).toEqual('path/to/dir/name.ext');
//   });
//   test('end >= segment count, should set end to segment count', () => {
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 4)).toEqual('path/to/dir/name.ext');
//     expect(NodePlatform_Path_Slice('path/to/dir/name.ext', 0, 5)).toEqual('path/to/dir/name.ext');
//   });
// });

describe(Class_NodePlatform_PathObject.name, () => {
  describe(NodePlatform_PathObject().has_trailing_slash.name, () => {
    describe('edge cases', () => {
      test('""', () => {
        expect(NodePlatform_PathObject('').has_trailing_slash()).toEqual(false);
      });
      test('"."', () => {
        expect(NodePlatform_PathObject('.').has_trailing_slash()).toEqual(false);
      });
      test('".."', () => {
        expect(NodePlatform_PathObject('..').has_trailing_slash()).toEqual(false);
      });
      test('"/"', () => {
        expect(NodePlatform_PathObject('/').has_trailing_slash()).toEqual(false);
      });
      test('"./"', () => {
        expect(NodePlatform_PathObject('./').has_trailing_slash()).toEqual(true);
      });
      test('"../"', () => {
        expect(NodePlatform_PathObject('../').has_trailing_slash()).toEqual(true);
      });
      test('"//Server/Share/"', () => {
        expect(NodePlatform_PathObject('//Server/Share').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('//Server/Share/').has_trailing_slash()).toEqual(true);
      });
      test('"//?/C:/"', () => {
        expect(NodePlatform_PathObject('//?/C:').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('//?/C:/').has_trailing_slash()).toEqual(true);
      });
      test('"//./COM1/"', () => {
        expect(NodePlatform_PathObject('//./COM1').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('//./COM1/').has_trailing_slash()).toEqual(true);
      });
      test('"/mnt/c/"', () => {
        expect(NodePlatform_PathObject('/mnt/c').has_trailing_slash()).toEqual(false);
        expect(NodePlatform_PathObject('/mnt/c/').has_trailing_slash()).toEqual(true);
      });
      //
      test('"\\"', () => {
        expect(NodePlatform_PathObject('\\').has_trailing_slash()).toEqual(false);
      });
      test('".\\"', () => {
        expect(NodePlatform_PathObject('.\\').has_trailing_slash()).toEqual(true);
      });
      test('"..\\"', () => {
        expect(NodePlatform_PathObject('..\\').has_trailing_slash()).toEqual(true);
      });
      test('"\\\\Server\\Share\\"', () => {
        expect(NodePlatform_PathObject('\\\\Server\\Share').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('\\\\Server\\Share\\').has_trailing_slash()).toEqual(true);
      });
      test('"\\\\?\\C:\\"', () => {
        expect(NodePlatform_PathObject('\\\\?\\C:').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('\\\\?\\C:\\').has_trailing_slash()).toEqual(true);
      });
      test('"\\\\.\\COM1\\"', () => {
        expect(NodePlatform_PathObject('\\\\.\\COM1').has_trailing_slash()).toEqual(true);
        expect(NodePlatform_PathObject('\\\\.\\COM1\\').has_trailing_slash()).toEqual(true);
      });
      test('"\\mnt\\c\\"', () => {
        expect(NodePlatform_PathObject('\\mnt\\c').has_trailing_slash()).toEqual(false);
        expect(NodePlatform_PathObject('\\mnt\\c\\').has_trailing_slash()).toEqual(true);
      });
    });
  });
  describe(NodePlatform_PathObject().dot.name, () => {
    describe('edge cases', () => {
      test('""', () => {
        expect(NodePlatform_PathObject('').dot().str('/')).toEqual('.');
      });
      test('"."', () => {
        expect(NodePlatform_PathObject('.').dot().str('/')).toEqual('.');
      });
      test('".."', () => {
        expect(NodePlatform_PathObject('..').dot().str('/')).toEqual('./..');
      });
      test('"/"', () => {
        expect(NodePlatform_PathObject('/').dot().str('/')).toEqual('./');
      });
      test('"./"', () => {
        expect(NodePlatform_PathObject('./').dot().str('/')).toEqual('./');
      });
      test('"../"', () => {
        expect(NodePlatform_PathObject('../').dot().str('/')).toEqual('./../');
      });
      test('"//Server/Share/"', () => {
        expect(NodePlatform_PathObject('//Server/Share').dot().str('/')).toEqual('.//Server/Share/');
        expect(NodePlatform_PathObject('//Server/Share/').dot().str('/')).toEqual('.//Server/Share/');
      });
      test('"//?/C:/"', () => {
        expect(NodePlatform_PathObject('//?/C:').dot().str('/')).toEqual('.//?/C:/');
        expect(NodePlatform_PathObject('//?/C:/').dot().str('/')).toEqual('.//?/C:/');
      });
      test('"//./COM1/"', () => {
        expect(NodePlatform_PathObject('//./COM1').dot().str('/')).toEqual('.//./COM1/');
        expect(NodePlatform_PathObject('//./COM1/').dot().str('/')).toEqual('.//./COM1/');
      });
      test('"/mnt/c/"', () => {
        expect(NodePlatform_PathObject('/mnt/c').dot().str('/')).toEqual('./mnt/c');
        expect(NodePlatform_PathObject('/mnt/c/').dot().str('/')).toEqual('./mnt/c/');
      });
      //
      test('"\\"', () => {
        expect(NodePlatform_PathObject('\\').dot().str('/')).toEqual('./');
      });
      test('".\\"', () => {
        expect(NodePlatform_PathObject('.\\').dot().str('/')).toEqual('./');
      });
      test('"..\\"', () => {
        expect(NodePlatform_PathObject('..\\').dot().str('/')).toEqual('./../');
      });
      test('"\\\\Server\\Share\\"', () => {
        expect(NodePlatform_PathObject('\\\\Server\\Share').dot().str('/')).toEqual('.//Server/Share/');
        expect(NodePlatform_PathObject('\\\\Server\\Share\\').dot().str('/')).toEqual('.//Server/Share/');
      });
      test('"\\\\?\\C:\\"', () => {
        expect(NodePlatform_PathObject('\\\\?\\C:').dot().str('/')).toEqual('.//?/C:/');
        expect(NodePlatform_PathObject('\\\\?\\C:\\').dot().str('/')).toEqual('.//?/C:/');
      });
      test('"\\\\.\\COM1\\"', () => {
        expect(NodePlatform_PathObject('\\\\.\\COM1').dot().str('/')).toEqual('.//./COM1/');
        expect(NodePlatform_PathObject('\\\\.\\COM1\\').dot().str('/')).toEqual('.//./COM1/');
      });
      test('"\\mnt\\c\\"', () => {
        expect(NodePlatform_PathObject('\\mnt\\c').dot().str('/')).toEqual('./mnt/c');
        expect(NodePlatform_PathObject('\\mnt\\c\\').dot().str('/')).toEqual('./mnt/c/');
      });
    });
  });
  describe(NodePlatform_PathObject().slash.name, () => {
    describe('edge cases', () => {
      describe('slash().str(/)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').slash().str('/')).toEqual('./');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').slash().str('/')).toEqual('./');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').slash().str('/')).toEqual('../');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').slash().str('/')).toEqual('/');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').slash().str('/')).toEqual('./');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').slash().str('/')).toEqual('../');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').slash().str('/')).toEqual('//Server/Share/');
          expect(NodePlatform_PathObject('//Server/Share/').slash().str('/')).toEqual('//Server/Share/');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').slash().str('/')).toEqual('//?/C:/');
          expect(NodePlatform_PathObject('//?/C:/').slash().str('/')).toEqual('//?/C:/');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').slash().str('/')).toEqual('//./COM1/');
          expect(NodePlatform_PathObject('//./COM1/').slash().str('/')).toEqual('//./COM1/');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').slash().str('/')).toEqual('/mnt/c/');
          expect(NodePlatform_PathObject('/mnt/c/').slash().str('/')).toEqual('/mnt/c/');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').slash().str('/')).toEqual('/');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').slash().str('/')).toEqual('./');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').slash().str('/')).toEqual('../');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').slash().str('/')).toEqual('//Server/Share/');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').slash().str('/')).toEqual('//Server/Share/');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').slash().str('/')).toEqual('//?/C:/');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').slash().str('/')).toEqual('//?/C:/');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').slash().str('/')).toEqual('//./COM1/');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').slash().str('/')).toEqual('//./COM1/');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').slash().str('/')).toEqual('/mnt/c/');
          expect(NodePlatform_PathObject('\\mnt\\c\\').slash().str('/')).toEqual('/mnt/c/');
        });
      });
      describe('slash().str(\\)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').slash().str('\\')).toEqual('.\\');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').slash().str('\\')).toEqual('.\\');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').slash().str('\\')).toEqual('..\\');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').slash().str('\\')).toEqual('\\');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').slash().str('\\')).toEqual('.\\');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').slash().str('\\')).toEqual('..\\');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').slash().str('\\')).toEqual('\\\\Server\\Share\\');
          expect(NodePlatform_PathObject('//Server/Share/').slash().str('\\')).toEqual('\\\\Server\\Share\\');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').slash().str('\\')).toEqual('\\\\?\\C:\\');
          expect(NodePlatform_PathObject('//?/C:/').slash().str('\\')).toEqual('\\\\?\\C:\\');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').slash().str('\\')).toEqual('\\\\.\\COM1\\');
          expect(NodePlatform_PathObject('//./COM1/').slash().str('\\')).toEqual('\\\\.\\COM1\\');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').slash().str('\\')).toEqual('\\mnt\\c\\');
          expect(NodePlatform_PathObject('/mnt/c/').slash().str('\\')).toEqual('\\mnt\\c\\');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').slash().str('\\')).toEqual('\\');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').slash().str('\\')).toEqual('.\\');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').slash().str('\\')).toEqual('..\\');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').slash().str('\\')).toEqual('\\\\Server\\Share\\');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').slash().str('\\')).toEqual('\\\\Server\\Share\\');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').slash().str('\\')).toEqual('\\\\?\\C:\\');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').slash().str('\\')).toEqual('\\\\?\\C:\\');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').slash().str('\\')).toEqual('\\\\.\\COM1\\');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').slash().str('\\')).toEqual('\\\\.\\COM1\\');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').slash().str('\\')).toEqual('\\mnt\\c\\');
          expect(NodePlatform_PathObject('\\mnt\\c\\').slash().str('\\')).toEqual('\\mnt\\c\\');
        });
      });
      describe('slash(false).str(/)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').slash(false).str('/')).toEqual('.');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').slash(false).str('/')).toEqual('.');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').slash(false).str('/')).toEqual('..');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').slash(false).str('/')).toEqual('/');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').slash(false).str('/')).toEqual('.');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').slash(false).str('/')).toEqual('..');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').slash(false).str('/')).toEqual('//Server/Share');
          expect(NodePlatform_PathObject('//Server/Share/').slash(false).str('/')).toEqual('//Server/Share');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').slash(false).str('/')).toEqual('//?/C:');
          expect(NodePlatform_PathObject('//?/C:/').slash(false).str('/')).toEqual('//?/C:');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').slash(false).str('/')).toEqual('//./COM1');
          expect(NodePlatform_PathObject('//./COM1/').slash(false).str('/')).toEqual('//./COM1');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').slash(false).str('/')).toEqual('/mnt/c');
          expect(NodePlatform_PathObject('/mnt/c/').slash(false).str('/')).toEqual('/mnt/c');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').slash(false).str('/')).toEqual('/');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').slash(false).str('/')).toEqual('.');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').slash(false).str('/')).toEqual('..');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').slash(false).str('/')).toEqual('//Server/Share');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').slash(false).str('/')).toEqual('//Server/Share');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').slash(false).str('/')).toEqual('//?/C:');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').slash(false).str('/')).toEqual('//?/C:');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').slash(false).str('/')).toEqual('//./COM1');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').slash(false).str('/')).toEqual('//./COM1');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').slash(false).str('/')).toEqual('/mnt/c');
          expect(NodePlatform_PathObject('\\mnt\\c\\').slash(false).str('/')).toEqual('/mnt/c');
        });
      });
      describe('slash(false).str(\\)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').slash(false).str('\\')).toEqual('.');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').slash(false).str('\\')).toEqual('.');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').slash(false).str('\\')).toEqual('..');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').slash(false).str('\\')).toEqual('\\');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').slash(false).str('\\')).toEqual('.');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').slash(false).str('\\')).toEqual('..');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').slash(false).str('\\')).toEqual('\\\\Server\\Share');
          expect(NodePlatform_PathObject('//Server/Share/').slash(false).str('\\')).toEqual('\\\\Server\\Share');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').slash(false).str('\\')).toEqual('\\\\?\\C:');
          expect(NodePlatform_PathObject('//?/C:/').slash(false).str('\\')).toEqual('\\\\?\\C:');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').slash(false).str('\\')).toEqual('\\\\.\\COM1');
          expect(NodePlatform_PathObject('//./COM1/').slash(false).str('\\')).toEqual('\\\\.\\COM1');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').slash(false).str('\\')).toEqual('\\mnt\\c');
          expect(NodePlatform_PathObject('/mnt/c/').slash(false).str('\\')).toEqual('\\mnt\\c');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').slash(false).str('\\')).toEqual('\\');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').slash(false).str('\\')).toEqual('.');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').slash(false).str('\\')).toEqual('..');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').slash(false).str('\\')).toEqual('\\\\Server\\Share');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').slash(false).str('\\')).toEqual('\\\\Server\\Share');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').slash(false).str('\\')).toEqual('\\\\?\\C:');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').slash(false).str('\\')).toEqual('\\\\?\\C:');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').slash(false).str('\\')).toEqual('\\\\.\\COM1');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').slash(false).str('\\')).toEqual('\\\\.\\COM1');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').slash(false).str('\\')).toEqual('\\mnt\\c');
          expect(NodePlatform_PathObject('\\mnt\\c\\').slash(false).str('\\')).toEqual('\\mnt\\c');
        });
      });
    });
  });
  describe(NodePlatform_PathObject().str.name, () => {
    describe('edge cases', () => {
      describe('str(/)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').str('/')).toEqual('.');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').str('/')).toEqual('.');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').str('/')).toEqual('..');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').str('/')).toEqual('/');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').str('/')).toEqual('./');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').str('/')).toEqual('../');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').str('/')).toEqual('//Server/Share/');
          expect(NodePlatform_PathObject('//Server/Share/').str('/')).toEqual('//Server/Share/');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').str('/')).toEqual('//?/C:/');
          expect(NodePlatform_PathObject('//?/C:/').str('/')).toEqual('//?/C:/');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').str('/')).toEqual('//./COM1/');
          expect(NodePlatform_PathObject('//./COM1/').str('/')).toEqual('//./COM1/');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').str('/')).toEqual('/mnt/c');
          expect(NodePlatform_PathObject('/mnt/c/').str('/')).toEqual('/mnt/c/');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').str('/')).toEqual('/');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').str('/')).toEqual('./');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').str('/')).toEqual('../');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').str('/')).toEqual('//Server/Share/');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').str('/')).toEqual('//Server/Share/');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').str('/')).toEqual('//?/C:/');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').str('/')).toEqual('//?/C:/');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').str('/')).toEqual('//./COM1/');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').str('/')).toEqual('//./COM1/');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').str('/')).toEqual('/mnt/c');
          expect(NodePlatform_PathObject('\\mnt\\c\\').str('/')).toEqual('/mnt/c/');
        });
      });
      describe('str(\\)', () => {
        test('""', () => {
          expect(NodePlatform_PathObject('').str('\\')).toEqual('.');
        });
        test('"."', () => {
          expect(NodePlatform_PathObject('.').str('\\')).toEqual('.');
        });
        test('".."', () => {
          expect(NodePlatform_PathObject('..').str('\\')).toEqual('..');
        });
        test('"/"', () => {
          expect(NodePlatform_PathObject('/').str('\\')).toEqual('\\');
        });
        test('"./"', () => {
          expect(NodePlatform_PathObject('./').str('\\')).toEqual('.\\');
        });
        test('"../"', () => {
          expect(NodePlatform_PathObject('../').str('\\')).toEqual('..\\');
        });
        test('"//Server/Share/"', () => {
          expect(NodePlatform_PathObject('//Server/Share').str('\\')).toEqual('\\\\Server\\Share\\');
          expect(NodePlatform_PathObject('//Server/Share/').str('\\')).toEqual('\\\\Server\\Share\\');
        });
        test('"//?/C:/"', () => {
          expect(NodePlatform_PathObject('//?/C:').str('\\')).toEqual('\\\\?\\C:\\');
          expect(NodePlatform_PathObject('//?/C:/').str('\\')).toEqual('\\\\?\\C:\\');
        });
        test('"//./COM1/"', () => {
          expect(NodePlatform_PathObject('//./COM1').str('\\')).toEqual('\\\\.\\COM1\\');
          expect(NodePlatform_PathObject('//./COM1/').str('\\')).toEqual('\\\\.\\COM1\\');
        });
        test('"/mnt/c/"', () => {
          expect(NodePlatform_PathObject('/mnt/c').str('\\')).toEqual('\\mnt\\c');
          expect(NodePlatform_PathObject('/mnt/c/').str('\\')).toEqual('\\mnt\\c\\');
        });
        //
        test('"\\"', () => {
          expect(NodePlatform_PathObject('\\').str('\\')).toEqual('\\');
        });
        test('".\\"', () => {
          expect(NodePlatform_PathObject('.\\').str('\\')).toEqual('.\\');
        });
        test('"..\\"', () => {
          expect(NodePlatform_PathObject('..\\').str('\\')).toEqual('..\\');
        });
        test('"\\\\Server\\Share\\"', () => {
          expect(NodePlatform_PathObject('\\\\Server\\Share').str('\\')).toEqual('\\\\Server\\Share\\');
          expect(NodePlatform_PathObject('\\\\Server\\Share\\').str('\\')).toEqual('\\\\Server\\Share\\');
        });
        test('"\\\\?\\C:\\"', () => {
          expect(NodePlatform_PathObject('\\\\?\\C:').str('\\')).toEqual('\\\\?\\C:\\');
          expect(NodePlatform_PathObject('\\\\?\\C:\\').str('\\')).toEqual('\\\\?\\C:\\');
        });
        test('"\\\\.\\COM1\\"', () => {
          expect(NodePlatform_PathObject('\\\\.\\COM1').str('\\')).toEqual('\\\\.\\COM1\\');
          expect(NodePlatform_PathObject('\\\\.\\COM1\\').str('\\')).toEqual('\\\\.\\COM1\\');
        });
        test('"\\mnt\\c\\"', () => {
          expect(NodePlatform_PathObject('\\mnt\\c').str('\\')).toEqual('\\mnt\\c');
          expect(NodePlatform_PathObject('\\mnt\\c\\').str('\\')).toEqual('\\mnt\\c\\');
        });
      });
    });
  });
  describe(NodePlatform_PathObject().overwrite.name, () => {
    const path_object = NodePlatform_PathObject();
    test('("path", "to", "dir", "name.ext")', () => {
      path_object.overwrite('path', 'to', 'dir', 'name.ext');
      expect(path_object.segments).toEqual(['path', 'to', 'dir', 'name.ext']);
      expect(path_object.str('/')).toEqual('path/to/dir/name.ext');
      expect(path_object.str('\\')).toEqual('path\\to\\dir\\name.ext');
      expect(path_object.str()).toEqual('path' + NODE_PATH.sep + 'to' + NODE_PATH.sep + 'dir' + NODE_PATH.sep + 'name.ext');
    });
  });
  describe(NodePlatform_PathObject().push.name, () => {});

  describe(NodePlatform_PathObject().pop.name, () => {});
  describe(NodePlatform_PathObject().unshift.name, () => {});
  describe(NodePlatform_PathObject().shift.name, () => {});
  describe(NodePlatform_PathObject().update_segment.name, () => {});
  describe(NodePlatform_PathObject().slice.name, () => {});
  describe(NodePlatform_PathObject().startsWith.name, () => {});
  describe(NodePlatform_PathObject().endsWith.name, () => {});

  // test('start=0, end=length should preserve path', () => {
  //   expect(NodePlatform_Path_Slice('')).toEqual('');
  //   expect(NodePlatform_Path_Slice('path/to\\dir/abc')).toEqual('path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('path/to\\dir/abc\\')).toEqual('path/to\\dir/abc\\');
  //   expect(NodePlatform_Path_Slice('path\\to/dir\\abc')).toEqual('path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('path\\to/dir\\abc/')).toEqual('path\\to/dir\\abc/');

  //   expect(NodePlatform_Path_Slice('/')).toEqual('/');
  //   expect(NodePlatform_Path_Slice('/path\\to/dir\\abc')).toEqual('/path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('/path\\to/dir\\abc')).toEqual('/path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/')).toEqual('/path\\to/dir\\abc/');
  //   expect(NodePlatform_Path_Slice('/path\\to/dir\\abc/')).toEqual('/path\\to/dir\\abc/');

  //   expect(NodePlatform_Path_Slice('\\')).toEqual('\\');
  //   expect(NodePlatform_Path_Slice('\\path/to\\dir/abc')).toEqual('\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('\\path/to\\dir/abc')).toEqual('\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\')).toEqual('\\path/to\\dir/abc\\');
  //   expect(NodePlatform_Path_Slice('\\path/to\\dir/abc\\')).toEqual('\\path/to\\dir/abc\\');

  //   expect(NodePlatform_Path_Slice('.')).toEqual('.');
  //   expect(NodePlatform_Path_Slice('./path\\to/dir\\abc')).toEqual('./path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('./path\\to/dir\\abc')).toEqual('./path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/')).toEqual('./path\\to/dir\\abc/');
  //   expect(NodePlatform_Path_Slice('./path\\to/dir\\abc/')).toEqual('./path\\to/dir\\abc/');
  //   expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc')).toEqual('.\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc')).toEqual('.\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\')).toEqual('.\\path/to\\dir/abc\\');
  //   expect(NodePlatform_Path_Slice('.\\path/to\\dir/abc\\')).toEqual('.\\path/to\\dir/abc\\');

  //   expect(NodePlatform_Path_Slice('..')).toEqual('..');
  //   expect(NodePlatform_Path_Slice('../path\\to/dir\\abc')).toEqual('../path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('../path\\to/dir\\abc')).toEqual('../path\\to/dir\\abc');
  //   expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/')).toEqual('../path\\to/dir\\abc/');
  //   expect(NodePlatform_Path_Slice('../path\\to/dir\\abc/')).toEqual('../path\\to/dir\\abc/');
  //   expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc')).toEqual('..\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc')).toEqual('..\\path/to\\dir/abc');
  //   expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\')).toEqual('..\\path/to\\dir/abc\\');
  //   expect(NodePlatform_Path_Slice('..\\path/to\\dir/abc\\')).toEqual('..\\path/to\\dir/abc\\');
  // });
});
