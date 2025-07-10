import { describe, expect, test } from 'bun:test';
import { NodePlatform_File_Read_Text_Async } from '../../NodePlatform_File_Read_Text_Async.js';
import { NodePlatform_File_Write_Text_Async } from '../../NodePlatform_File_Write_Text_Async.js';
import { NodePlatform_SetupTempDirectory, temp_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_File_Read_Text_Async.name, () => {
  test('Read Text', async () => {
    await NodePlatform_File_Write_Text_Async(temp_file_path, 'EFG');
    expect(await NodePlatform_File_Read_Text_Async(temp_file_path)).toBe('EFG');
  });
});
