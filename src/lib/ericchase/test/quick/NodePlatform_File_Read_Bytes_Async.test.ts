import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Read_Bytes_Async } from '../../NodePlatform_File_Read_Bytes_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_SetupTempDirectory, temp_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_File_Read_Bytes_Async.name, () => {
  test('Read Bytes', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([5, 6, 7]));
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([5, 6, 7]));
  });
});
