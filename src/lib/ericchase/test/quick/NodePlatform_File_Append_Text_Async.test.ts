import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Append_Text_Async } from '../../NodePlatform_File_Append_Text_Async.js';
import { NodePlatform_File_Read_Text_Async } from '../../NodePlatform_File_Read_Text_Async.js';
import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
import { NodePlatform_SetupTempDirectory_Async, temp_dir_path, temp_file_path } from '../test-setup.js';

await NodePlatform_SetupTempDirectory_Async();

describe(NodePlatform_File_Append_Text_Async.name, () => {
  describe('Error Cases', () => {
    test('Throws When Path Is A Directory', async () => {
      try {
        await NodePlatform_File_Append_Text_Async(temp_dir_path, 'AB');
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
        expect(error.code).toBe('EISDIR');
      }
    });
  });

  test('Append Text', async () => {
    await NodePlatform_File_Write_Text_Async(temp_file_path, 'AB');
    await NodePlatform_File_Append_Text_Async(temp_file_path, 'CD');
    expect(await NodePlatform_File_Read_Text_Async(temp_file_path)).toBe('ABCD');
  });
});
