import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Append_Bytes_Async } from '../../NodePlatform_File_Append_Bytes_Async.js';
import { NodePlatform_File_Read_Bytes_Async } from '../../NodePlatform_File_Read_Bytes_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_File_Append_Bytes_Async.name, () => {
  describe('Error Cases', () => {
    test('Throws When Path Is A Directory', async () => {
      try {
        await NodePlatform_File_Append_Bytes_Async(temp_dir_path, new Uint8Array([1, 2]));
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
        expect(error.code).toBe('EISDIR');
      }
    });
  });

  test('Append Bytes', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([1, 2]));
    await NodePlatform_File_Append_Bytes_Async(temp_file_path, new Uint8Array([3, 4]));
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
});
