import { describe, expect, test } from 'bun:test';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_File_Read_Bytes_Async } from '../../NodePlatform_File_Read_Bytes_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../../NodePlatform_File_Write_Bytes_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_File_Write_Bytes_Async.name, () => {
  describe('Error Cases', () => {
    test('Throws When Path Is A Directory', async () => {
      try {
        await NodePlatform_File_Write_Bytes_Async(temp_dir_path, new Uint8Array([1, 2]));
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        switch (error.code) {
          /** Seems to be the code of choice for Windows. */
          case 'EEXIST':
            expect(error.message).toStartWith('EEXIST: file already exists');
            expect(error.code).toBe('EEXIST');
            break;
          /** Seems to be the code of choice for Posix. */
          case 'EISDIR':
            expect(error.message).toStartWith('EISDIR: illegal operation on a directory');
            expect(error.code).toBe('EISDIR');
            break;
          /** If you find yourself here, then we need a case for your particular system. */
          default:
            Core_Console_Error(error);
            expect(false).toBeTrue();
            break;
        }
      }
    });
    test('Throws When A Path Segment Is A File', async () => {
      try {
        await NodePlatform_File_Write_Bytes_Async(NODE_PATH.join(temp_file_path, 'nested_dir'), new Uint8Array([1, 2]));
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        switch (error.code) {
          /** Seems to be the code of choice for Windows. */
          case 'ENOENT':
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
            break;
          /** Seems to be the code of choice for Posix. */
          case 'ENOTDIR':
            expect(error.message).toStartWith('ENOTDIR: not a directory');
            expect(error.code).toBe('ENOTDIR');
            break;
          /** If you find yourself here, then we need a case for your particular system. */
          default:
            Core_Console_Error(error);
            expect(false).toBeTrue();
            break;
        }
      }
    });
  });

  test('Write Bytes', async () => {
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, new Uint8Array([5, 6, 7]));
    expect(await NodePlatform_File_Read_Bytes_Async(temp_file_path)).toEqual(new Uint8Array([5, 6, 7]));
  });
});
