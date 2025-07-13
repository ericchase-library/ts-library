// import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
// import { Core_Utility_Sleep_Async } from '../../Core_Utility_Sleep_Async.js';
// import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
// import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
// import { NodePlatform_Directory_Watch_Async } from '../../NodePlatform_Directory_Watch_Async.js';
// import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
// import { NodePlatform_Path_Is_Directory_Async } from '../../NodePlatform_Path_Is_Directory_Async.js';
// import { NodePlatform_Path_Is_File_Async } from '../../NodePlatform_Path_Is_File_Async.js';
// import { NodePlatform_SetupTempDirectory_Async, case_dir_path, case_file_path, temp_nonexistent_path } from '../test-setup.js';

// await NodePlatform_SetupTempDirectory_Async();

// describe(NodePlatform_Directory_Watch_Async.name, () => {});

// describe(NodePlatform_Directory_Watch_Async.name, () => {
//   let GlobalUnwatch: Function | undefined;
//   beforeEach(async () => {
//     GlobalUnwatch = undefined;
//     await NodePlatform_Directory_Create_Async(case_dir_path, true);
//   });
//   afterEach(async () => {
//     GlobalUnwatch?.();
//     await NodePlatform_Directory_Delete_Async(case_dir_path, true);
//   });

//   describe('Error Cases', () => {
//     /**
//      * Unfortunately, module mocking isn't really compatabile with how modules
//      * work in JavaScript. This test needs to be done in isolation, meaning in
//      * its own file and run separately from the other files. The error message
//      * should throw if Chokidar is not installed, so this test isn't really
//      * needed.
//      */
//     // test('Chokidar Not Installed', async () => {
//     //   try {
//     //     mock.module('chokidar', () => {
//     //       throw new Error("Cannot find package 'chokidar'");
//     //     });
//     //     await NodePlatform_Directory_Create_Watcher_Async(
//     //       case_dir_path,
//     //       () => {},
//     //       () => {},
//     //     );
//     //     throw new Error('FAIL-CASE');
//     //   } catch (error: any) {
//     //     expect(error.message).toBe(Error_Message_NodePlatform_Directory_Create_Watcher_Async_Chokidar_Not_Installed);
//     //   }
//     // }, 500);

//     test('Non-existent Path', async () => {
//       try {
//         const { unwatch } = await NodePlatform_Directory_Watch_Async(
//           temp_nonexistent_path,
//           () => {},
//           () => {},
//         );
//         GlobalUnwatch = unwatch;
//         await Core_Utility_Sleep_Async(50);
//         throw new Error('FAIL-CASE');
//       } catch (error: any) {
//         expect(error.message).toStartWith('ENOENT: no such file or directory');
//         expect(error.code).toBe('ENOENT');
//       }
//     }, 500);
//   });

//   describe('Edge Cases', () => {
//     test('Nothing Happens If Empty Root Directory Is Deleted', async () => {
//       expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeTrue();
//       const { unwatch } = await NodePlatform_Directory_Watch_Async(
//         case_dir_path,
//         () => {
//           expect(false).toBeTrue();
//         },
//         () => {
//           expect(false).toBeTrue();
//         },
//       );
//       GlobalUnwatch = unwatch;
//       expect(await NodePlatform_Directory_Delete_Async(case_dir_path, true)).toBeTrue();
//       await Core_Utility_Sleep_Async(50);
//     }, 500);
//     test('Nothing Happens If Empty Root Directory Is Deleted', async () => {
//       await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
//       expect(await NodePlatform_Path_Is_File_Async(case_file_path)).toBeTrue();

//       expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeTrue();
//       // await NodePlatform_File_Write_Text_Async(case_nested_file_path, 'ABC');
//       await Core_Utility_Sleep_Async(50);
//       const { unwatch } = await NodePlatform_Directory_Watch_Async(
//         case_dir_path,
//         () => {
//           expect(false).toBeTrue();
//         },
//         () => {
//           expect(false).toBeTrue();
//         },
//       );
//       GlobalUnwatch = unwatch;
//       // await NodePlatform_Directory_Delete_Async(case_nested_subdir_path, true);
//       expect(await NodePlatform_Directory_Delete_Async(case_dir_path, true)).toBeTrue();
//       await Core_Utility_Sleep_Async(50);
//     }, 500);
//   });

//   // test('Directory Creation', async (done) => {
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('rename');
//   //       expect(path).toBe(case_subdir_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_Directory_Create_Async(case_subdir_path);
//   // }, 500);

//   // test('Directory Deletion', async (done) => {
//   //   await NodePlatform_Directory_Create_Async(case_subdir_path);
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('rename');
//   //       expect(path).toBe(case_subdir_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_Directory_Delete_Async(case_subdir_path, true);
//   // }, 500);

//   // // test('Nested Directory Creation', async (done) => {
//   // //   const watcher = chokidar.watch(case_dir_path, {
//   // //     ignoreInitial: true,
//   // //     persistent: true,
//   // //     depth: Infinity, // watch deeply
//   // //   });

//   // //   watcher
//   // //     .on('add', (path) => console.log('File added:', path))
//   // //     .on('change', (path) => console.log('File changed:', path))
//   // //     .on('unlink', (path) => console.log('File removed:', path))
//   // //     .on('addDir', (path) => console.log('Directory added:', path))
//   // //     .on('unlinkDir', (path) => console.log('Directory removed:', path))
//   // //     .on('error', (err) => console.error('Watcher error:', err))
//   // //     .on('ready', async () => {
//   // //       await NodePlatform_Directory_Create_Async(case_subdir_path, true);
//   // //       await NodePlatform_Directory_Create_Async(case_nested_subdir_path, true);
//   // //     });

//   // //   // const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   // //   //   case_dir_path,
//   // //   //   (event, path) => {
//   // //   //     console.log({ event, path });
//   // //   //     expect(event).toBe('rename');
//   // //   //     expect(path).toBe(case_nested_subdir_basename);
//   // //   //     // unwatch();
//   // //   //     // done();
//   // //   //   },
//   // //   //   false,
//   // //   // );
//   // // }, 500);

//   // // test('Nested Directory Deletion', async (done) => {
//   // //   await NodePlatform_Directory_Create_Async(case_nested_subdir_path);
//   // //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   // //     case_dir_path,
//   // //     (event, path) => {
//   // //       expect(event).toBe('rename');
//   // //       expect(path).toBe(case_nested_subdir_basename);
//   // //       unwatch();
//   // //       done();
//   // //     },
//   // //     false,
//   // //   );
//   // //   await NodePlatform_Directory_Delete_Async(case_nested_subdir_path, true);
//   // // }, 500);

//   // test('File Creation', async (done) => {
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('rename');
//   //       expect(path).toBe(case_file_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_File_Write_Bytes_Async(case_file_path, ARRAY__UINT8__EMPTY);
//   // }, 500);

//   // test('File Deletion', async (done) => {
//   //   await NodePlatform_File_Write_Bytes_Async(case_file_path, ARRAY__UINT8__EMPTY);
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('rename');
//   //       expect(path).toBe(case_file_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_Directory_Delete_Async(case_file_path, true);
//   // }, 500);

//   // test('File Append', async (done) => {
//   //   await NodePlatform_File_Write_Bytes_Async(case_file_path, ARRAY__UINT8__EMPTY);
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('change');
//   //       expect(path).toBe(case_file_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_File_Append_Text_Async(case_file_path, 'ABC');
//   // }, 500);

//   // test('File Write', async (done) => {
//   //   await NodePlatform_File_Write_Bytes_Async(case_file_path, ARRAY__UINT8__EMPTY);
//   //   const unwatch = NodePlatform_Directory_Create_Watcher_Async(
//   //     case_dir_path,
//   //     (event, path) => {
//   //       expect(event).toBe('change');
//   //       expect(path).toBe(case_file_basename);
//   //       unwatch();
//   //       done();
//   //     },
//   //     false,
//   //   );
//   //   await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
//   // }, 500);
// });
