import { describe, expect, test } from 'bun:test';
import { NodePlatform_Path_Is_Directory_Async } from '../../NodePlatform_Path_Is_Directory_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path, temp_junction_to_dir_path, temp_symboliclink_to_dir_path, temp_symboliclink_to_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_Path_Is_Directory_Async.name, () => {
  test('Directory: True', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_dir_path)).toBeTrue();
  });
  test('File: False', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_file_path)).toBeFalse();
  });
  test('Junction To Directory: True', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_junction_to_dir_path)).toBeTrue();
  });
  test('SymbolicLink To Directory: True', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_symboliclink_to_dir_path)).toBeTrue();
  });
  test('SymbolicLink To File: False', async () => {
    expect(await NodePlatform_Path_Is_Directory_Async(temp_symboliclink_to_file_path)).toBeFalse();
  });
});
