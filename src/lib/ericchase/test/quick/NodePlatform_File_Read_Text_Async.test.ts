import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Read_Text_Async } from '../../NodePlatform_File_Read_Text_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
import { NodePlatform_SetupTempDirectory_Async, temp_dir_path, temp_file_path, temp_nonexistent_path } from '../test-setup.js';

await NodePlatform_SetupTempDirectory_Async();

describe(NodePlatform_File_Read_Text_Async.name, () => {
  describe('Error Cases', () => {
    test('Throws On Non-existent Path', async () => {
      try {
        await NodePlatform_File_Read_Text_Async(temp_nonexistent_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('Throws When Path Is A Directory', async () => {
      try {
        await NodePlatform_File_Read_Text_Async(temp_dir_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
        expect(error.code).toBe('EISDIR');
      }
    });
  });

  test('Read Text', async () => {
    await NodePlatform_File_Write_Text_Async(temp_file_path, 'EFG');
    expect(await NodePlatform_File_Read_Text_Async(temp_file_path)).toBe('EFG');
  });

  /** fs.readFile probably tries to convert binary into unicode code points. */
  test('Read Binary Data', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([1, 2, 3]));
    expect(await NodePlatform_File_Read_Text_Async(temp_file_path)).toBe('\u0001\u0002\u0003');
  });
});
