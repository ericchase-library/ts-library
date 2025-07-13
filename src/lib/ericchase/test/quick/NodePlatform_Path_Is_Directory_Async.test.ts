import { describe, expect, test } from 'bun:test';
import { Core_Error_Fix_Call_Stack_Async } from '../../Core_Error_Fix_Call_Stack_Async.js';
import { NodePlatform_Path_Is_Directory_Async } from '../../NodePlatform_Path_Is_Directory_Async.js';
import { NodePlatform_SetupTempDirectory_Async, temp_dir_path, temp_file_path, temp_junction_to_dir_path, temp_nonexistent_path, temp_symboliclink_to_dir_path, temp_symboliclink_to_file_path } from '../test-setup.js';

await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_SetupTempDirectory_Async());

describe(NodePlatform_Path_Is_Directory_Async.name, () => {
  test('Should return `true` for directory.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_dir_path)).toBeTrue();
  });
  test('Should return `true` for junction to directory.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_junction_to_dir_path)).toBeTrue();
  });
  test('Should return `true` for symbolic link to directory.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_symboliclink_to_dir_path)).toBeTrue();
  });
  test('Should return `false` for file.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_file_path)).toBeFalse();
  });
  test('Should return `false` for symbolic link to file.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_symboliclink_to_file_path)).toBeFalse();
  });
  test('Should return `false` for non-existent path.', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_nonexistent_path)).toBeFalse();
  });
});
