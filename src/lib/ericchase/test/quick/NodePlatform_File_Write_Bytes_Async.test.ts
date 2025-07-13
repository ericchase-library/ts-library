import { afterEach, describe, expect, test } from 'bun:test';
import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_File_Read_Bytes_Async } from '../../NodePlatform_File_Read_Bytes_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_Path_Exists_Async } from '../../NodePlatform_Path_Exists_Async.js';
import { case_dir_path, case_file_path, NodePlatform_SetupTempDirectory_Async, temp_file_path } from '../test-setup.js';

await NodePlatform_SetupTempDirectory_Async();

describe(NodePlatform_File_Write_Bytes_Async.name, () => {
  afterEach(async () => {
    await NodePlatform_Directory_Delete_Async(case_dir_path, true);
  });

  // describe('Error Cases', () => {
  //   test('Throws When Path Is A Directory', async () => {
  //     try {
  //       await NodePlatform_File_Write_Bytes_Async(temp_dir_path, new Uint8Array([1, 2]));
  //       throw new Error('FAIL-CASE');
  //     } catch (error: any) {
  //       switch (error.code) {
  //         /** Seems to be the code of choice for Windows. */
  //         case 'EEXIST':
  //           expect(error.message).toStartWith('EEXIST: file already exists');
  //           expect(error.code).toBe('EEXIST');
  //           break;
  //         /** Seems to be the code of choice for Posix. */
  //         case 'EISDIR':
  //           expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
  //           expect(error.code).toBe('EISDIR');
  //           break;
  //         /** If you find yourself here, then we need a case for your particular system. */
  //         default:
  //           Core_Console_Error(error);
  //           expect(false).toBeTrue();
  //           break;
  //       }
  //     }
  //   });
  //   test('Throws When A Path Segment Is A File', async () => {
  //     try {
  //       await NodePlatform_File_Write_Bytes_Async(NODE_PATH.join(temp_file_path, 'nested_dir'), new Uint8Array([1, 2]));
  //       throw new Error('FAIL-CASE');
  //     } catch (error: any) {
  //       switch (error.code) {
  //         /** Seems to be the code of choice for Windows. */
  //         case 'ENOENT':
  //           expect(error.message).toStartWith('ENOENT: no such file or directory');
  //           expect(error.code).toBe('ENOENT');
  //           break;
  //         /** Seems to be the code of choice for Posix. */
  //         case 'ENOTDIR':
  //           expect(error.message).toStartWith('ENOTDIR: not a directory');
  //           expect(error.code).toBe('ENOTDIR');
  //           break;
  //         /** If you find yourself here, then we need a case for your particular system. */
  //         default:
  //           Core_Console_Error(error);
  //           expect(false).toBeTrue();
  //           break;
  //       }
  //     }
  //   });
  // });

  test('Should overwrite bytes if file already exists when `recursive` is `false`.', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([1, 2, 3]), false);
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([1, 2, 3]));
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([4, 5, 6]), false);
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([4, 5, 6]));
  });
  test('Should overwrite bytes if file already exists when `recursive` is `true`.', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([1, 2, 3]), true);
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([1, 2, 3]));
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([4, 5, 6]), true);
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([4, 5, 6]));
  });

  test('Should write bytes for non-existent path and existent parent path when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path)).toBeTrue();
    expect(await NodePlatform_Path_Exists_Async(case_file_path)).toBeFalse();
    await NodePlatform_File_Write_Bytes_Async(case_file_path, new Uint8Array([1, 2, 3]), false);
    expect(await NodePlatform_File_Read_Bytes_Async(case_file_path)).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('Should write bytes for non-existent path and existent parent path when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path)).toBeTrue();
    expect(await NodePlatform_Path_Exists_Async(case_file_path)).toBeFalse();
    await NodePlatform_File_Write_Bytes_Async(case_file_path, new Uint8Array([1, 2, 3]), true);
    expect(await NodePlatform_File_Read_Bytes_Async(case_file_path)).toEqual(new Uint8Array([1, 2, 3]));
  });

  test('Should write bytes for non-existent path and non-existent parent path when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Path_Exists_Async(case_dir_path)).toBeFalse();
    expect(await NodePlatform_Path_Exists_Async(case_file_path)).toBeFalse();
    await NodePlatform_File_Write_Bytes_Async(case_file_path, new Uint8Array([1, 2, 3]), false);
    expect(await NodePlatform_File_Read_Bytes_Async(case_file_path)).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('Should write bytes for non-existent path and non-existent parent path when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Path_Exists_Async(case_dir_path)).toBeFalse();
    expect(await NodePlatform_Path_Exists_Async(case_file_path)).toBeFalse();
    await NodePlatform_File_Write_Bytes_Async(case_file_path, new Uint8Array([1, 2, 3]), true);
    expect(await NodePlatform_File_Read_Bytes_Async(case_file_path)).toEqual(new Uint8Array([1, 2, 3]));
  });
});
