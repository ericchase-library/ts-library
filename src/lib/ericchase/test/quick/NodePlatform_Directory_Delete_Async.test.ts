import { afterEach, describe, expect, test } from 'bun:test';
import { ARRAY__UINT8__EMPTY } from '../../Core_Array_Uint8.js';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_Path_Is_File_Async } from '../../NodePlatform_Path_Is_File_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path, temp_nonexistent_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_Directory_Delete_Async.name, () => {
  const case_dir_path = NODE_PATH.join(temp_dir_path, 'case_dir');
  const case_file_path = NODE_PATH.join(temp_dir_path, 'case_dir', 'file.txt');
  const case_nested_dir_path = NODE_PATH.join(temp_dir_path, 'case_dir', 'nested_dir');
  afterEach(async () => {
    await NodePlatform_Directory_Delete_Async(case_dir_path, true);
  });

  describe('Error Cases', () => {
    test('Throws When Trying To Delete A File Without Recursive', async () => {
      try {
        expect(await NodePlatform_Directory_Delete_Async(temp_file_path, false)).toBeFalse();
      } catch (error: any) {
        switch (error.code) {
          /** Seems to be the code of choice for Windows. */
          case 'ENOENT':
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
            break;
          /** Seems to be the code of choice for Posix. */
          case 'ENOTDIR':
            expect(error.message).toStartWith('ENOTDIR: not a directory');
            expect(error.code).toBe('ENOTDIR');
            break;
          /** If you find yourself here, then we need a case for your particular system. */
          default:
            Core_Console_Error(error);
            expect(false).toBeTrue();
            break;
        }
      }
    });
    test('Throws When Trying To Delete A Non-empty Directory Without Recursive', async () => {
      try {
        expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
        expect(await NodePlatform_Directory_Delete_Async(case_dir_path, false)).toBeFalse();
      } catch (error: any) {
        expect(error.message).toStartWith('ENOTEMPTY: directory not empty');
        expect(error.code).toBe('ENOTEMPTY');
      }
    });
  });

  test('Delete Directory', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
    expect(await NodePlatform_Directory_Delete_Async(case_dir_path, false)).toBeTrue();
  });
  test('Delete File With Recursive', async () => {
    await NodePlatform_File_Write_Bytes_Async(case_file_path, ARRAY__UINT8__EMPTY);
    expect(await NodePlatform_Path_Is_File_Async(case_file_path)).toBeTrue();
    expect(await NodePlatform_Directory_Delete_Async(case_file_path, true)).toBeTrue();
  });
  test('Delete Nested Directory', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
    expect(await NodePlatform_Directory_Delete_Async(case_nested_dir_path, false)).toBeTrue();
  });
  test('Delete Non-empty Directory With Recursive', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
    expect(await NodePlatform_Directory_Delete_Async(case_dir_path, true)).toBeTrue();
  });
  test('Do Nothing If Directory Does Not Exist', async () => {
    expect(await NodePlatform_Directory_Delete_Async(temp_nonexistent_path, false)).toBeTrue();
    expect(await NodePlatform_Directory_Delete_Async(temp_nonexistent_path, true)).toBeTrue();
  });
});
