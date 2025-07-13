import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Read_Bytes_Async } from '../../NodePlatform_File_Read_Bytes_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_SetupTempDirectory_Async, temp_dir_path, temp_file_path, temp_nonexistent_path } from '../test-setup.js';

await NodePlatform_SetupTempDirectory_Async();

describe(NodePlatform_File_Read_Bytes_Async.name, () => {
  describe('Error Cases', () => {
    test('Throws On Non-existent Path', async () => {
      try {
        await NodePlatform_File_Read_Bytes_Async(temp_nonexistent_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('Throws When Path Is A Directory', async () => {
      try {
        await NodePlatform_File_Read_Bytes_Async(temp_dir_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
        expect(error.code).toBe('EISDIR');
      }
    });
  });

  test('Read Bytes', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([5, 6, 7]));
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([5, 6, 7]));
  });
});
