/**
 * Just use Bun's Glob scanner. Can deal with this some other month.
 */

// NodePlatform_SetupTempDirectory();

// describe(NodePlatform_Directory_ReadDir_Async.name, () => {
//   beforeAll(async () => {
//     await NodePlatform_Directory_Create_Async(case_dir_path, true);
//     await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_dir_path, 'subdir1'), true);
//     await NodePlatform_File_Write_Text_Async(NODE_PATH.join(case_dir_path, 'file1.txt'), 'example 1');
//     await NodePlatform_File_Write_Text_Async(NODE_PATH.join(case_dir_path, 'file2.txt'), 'example 2');
//     await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_dir_path, 'subdir2'), true);
//     await NodePlatform_File_Write_Text_Async(NODE_PATH.join(case_dir_path, 'subdir2', 'nested.txt'), 'nested');
//   });
//   afterAll(async () => {
//     await NodePlatform_Directory_Delete_Async(case_dir_path, true);
//   });

//   test('fs.readdir returns correct directory contents', async () => {
//     const items = await NodePlatform_Directory_ReadDir_Async(case_dir_path);
//   });
// });
