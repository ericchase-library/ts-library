// import fs from 'fs';

// import { expect, test } from 'bun:test';
// import { NormalizePath } from '../Platform/Node/Path.js';
// import { RecursiveOperationWalker } from './RecursiveOperationWalker.js';

// test('node.fs.readdir', () => {
//   const actual: string[] = [];
//   RecursiveOperationWalker.walk('test', (values) => {
//     const path = values.join('/');
//     const folders: string[] = [];
//     const entries = fs.readdirSync(path, { encoding: 'utf8' });
//     for (const entry of entries) {
//       const subpath = path + '/' + entry;
//       actual.push(NormalizePath(subpath.slice('test/'.length)));
//       if (fs.statSync(subpath).isDirectory()) {
//         folders.push(entry);
//       }
//     }
//     return folders.reverse();
//   });
//   const expected = fs.readdirSync('test', { recursive: true, encoding: 'utf8' });
//   expect(actual.sort()).toEqual(expected.sort());
// });

// test('node.fs.promises.readdir', async () => {
//   const actual: string[] = [];
//   await RecursiveOperationWalker.walkAsync('test', async (values) => {
//     const path = values.join('/');
//     const folders: string[] = [];
//     const entries = await fs.promises.readdir(path);
//     for (const entry of entries) {
//       const subpath = path + '/' + entry;
//       try {
//         await Bun.file(subpath).bytes();
//         actual.push(NormalizePath(subpath.slice('test/'.length)));
//       } catch (_) {
//         folders.push(entry);
//         actual.push(NormalizePath(subpath.slice('test/'.length)));
//       }
//     }
//     return folders.reverse();
//   });
//   const expected = await fs.promises.readdir('test', { recursive: true });
//   expect(actual.sort()).toEqual(expected.sort());
// });
