import { afterEach, describe, expect, test } from 'bun:test';
import { Core_Error_Fix_Call_Stack_Async } from '../../Core_Error_Fix_Call_Stack_Async.js';
import { NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_File_Read_Text_Async } from '../../NodePlatform_File_Read_Text_Async.js';
import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
import { NodePlatform_Path_Is_Directory_Async } from '../../NodePlatform_Path_Is_Directory_Async.js';
import { case_dir_path, case_file_path, case_subdir_path, NodePlatform_SetupTempDirectory_Async, temp_dir_path } from '../test-setup.js';

await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_SetupTempDirectory_Async());

/**
 * Would need some complex setup to handle permission cases. Until then, the
 * fs.mkdir call will always succeed, and coverage will not be 100%.
 */

describe(NodePlatform_Directory_Create_Async.name, () => {
  afterEach(async () => {
    await NodePlatform_Directory_Delete_Async(case_dir_path, true);
  });

  //## Basic Cases

  test('Should return `true` for non-existent path and existent parent path when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_dir_path)).toBeTrue();
    expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeFalse();

    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
  });
  test('Should return `true` for non-existent path and existent parent path when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_dir_path)).toBeTrue();
    expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeFalse();

    expect(await NodePlatform_Directory_Create_Async(case_dir_path, true)).toBeTrue();
  });

  test('Should throw `ENOENT` for non-existent path and non-existent parent path when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeFalse();
    expect(await NodePlatform_Path_Is_Directory_Async(case_subdir_path)).toBeFalse();

    try {
      await NodePlatform_Directory_Create_Async(case_subdir_path, false);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('ENOENT: no such file or directory');
      expect(error.code).toBe('ENOENT');
    }
  });
  test('Should return `true` for non-existent path and non-existent parent path when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(case_dir_path)).toBeFalse();
    expect(await NodePlatform_Path_Is_Directory_Async(case_subdir_path)).toBeFalse();

    expect(await NodePlatform_Directory_Create_Async(case_subdir_path, true)).toBeTrue();
  });

  test('Should return `true` if directory already exists when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();

    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
  });
  test('Should return `true` if directory already exists when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, true)).toBeTrue();

    expect(await NodePlatform_Directory_Create_Async(case_dir_path, true)).toBeTrue();
  });

  test('Should throw `EEXIST` for file when `recursive` is `false`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    try {
      await NodePlatform_Directory_Create_Async(case_file_path, false);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('EEXIST: file already exists');
      expect(error.code).toBe('EEXIST');
    }
  });
  test('Should throw `EEXIST` for file when `recursive` is `true`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    try {
      await NodePlatform_Directory_Create_Async(case_file_path, true);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('EEXIST: file already exists');
      expect(error.code).toBe('EEXIST');
    }
  });

  //## Edge Cases

  if (process.platform === 'win32') {
    test('On win32, should throw `ENOENT` if a parent path segment is a file when `recursive` is `false`.', async () => {
      await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
      expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

      try {
        await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_file_path, 'subdir'), false);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('On win32, should throw `ENOENT` if a parent path segment is a file when `recursive` is `false`.', async () => {
      await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
      expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

      try {
        await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_file_path, 'subdir'), true);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
  } else {
    test('On posix, should throw `ENOTDIR` if a parent path segment is a file when `recursive` is `false`.', async () => {
      await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
      expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

      try {
        await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_file_path, 'subdir'), false);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOTDIR: not a directory');
        expect(error.code).toBe('ENOTDIR');
      }
    });
    test('On posix, should throw `ENOTDIR` if a parent path segment is a file when `recursive` is `false`.', async () => {
      await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
      expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

      try {
        await NodePlatform_Directory_Create_Async(NODE_PATH.join(case_file_path, 'subdir'), true);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOTDIR: not a directory');
        expect(error.code).toBe('ENOTDIR');
      }
    });
  }
});
