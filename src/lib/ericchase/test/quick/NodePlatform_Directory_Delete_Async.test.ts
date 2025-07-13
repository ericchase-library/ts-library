import { afterEach, describe, expect, test } from 'bun:test';
import { Core_Error_Fix_Call_Stack_Async } from '../../Core_Error_Fix_Call_Stack_Async.js';
import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_File_Read_Text_Async } from '../../NodePlatform_File_Read_Text_Async.js';
import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
import { case_dir_path, case_file_path, NodePlatform_SetupTempDirectory_Async, temp_nonexistent_path } from '../test-setup.js';

await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_SetupTempDirectory_Async());

describe(NodePlatform_Directory_Delete_Async.name, () => {
  afterEach(async () => {
    await NodePlatform_Directory_Delete_Async(case_dir_path, true);
  });

  //## Basic Cases

  test('Should return `true` for empty directory when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, true)).toBeTrue();

    expect(await NodePlatform_Directory_Delete_Async(case_dir_path, false)).toBeTrue();
  });
  test('Should return `true` for empty directory when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, true)).toBeTrue();

    expect(await NodePlatform_Directory_Delete_Async(case_dir_path, true)).toBeTrue();
  });

  test('Should throw `ENOTEMPTY` for non-empty directory when `recursive` is `false`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    try {
      await NodePlatform_Directory_Delete_Async(case_dir_path, false);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('ENOTEMPTY: directory not empty');
      expect(error.code).toBe('ENOTEMPTY');
    }
  });
  test('Should return `true` for non-empty directory when `recursive` is `true`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    expect(await NodePlatform_Directory_Delete_Async(case_dir_path, true)).toBeTrue();
  });

  test('Should return `true` for non-existent path when `recursive` is `false`.', async () => {
    expect(await NodePlatform_Directory_Delete_Async(temp_nonexistent_path, false)).toBeTrue();
  });
  test('Should return `true` for non-existent path when `recursive` is `true`.', async () => {
    expect(await NodePlatform_Directory_Delete_Async(temp_nonexistent_path, true)).toBeTrue();
  });

  test('Should throw `ENOTDIR` for file when `recursive` is `false`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    try {
      await NodePlatform_Directory_Delete_Async(case_file_path, false);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('ENOTDIR: not a directory');
      expect(error.code).toBe('ENOTDIR');
    }
  });
  test('Should throw `ENOTDIR` for file when `recursive` is `true`.', async () => {
    await NodePlatform_File_Write_Text_Async(case_file_path, 'ABC');
    expect(await NodePlatform_File_Read_Text_Async(case_file_path)).toBe('ABC');

    try {
      await NodePlatform_Directory_Delete_Async(case_file_path, true);
      throw new Error('FAIL-CASE');
    } catch (error: any) {
      expect(error.message).toStartWith('ENOTDIR: not a directory');
      expect(error.code).toBe('ENOTDIR');
    }
  });
});
