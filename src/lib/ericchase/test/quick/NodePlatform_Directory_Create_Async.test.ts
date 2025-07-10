import { afterEach, describe, expect, test } from 'bun:test';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from '../../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_Directory_Create_Async.name, () => {
  const case_dir_path = NODE_PATH.join(temp_dir_path, 'case_dir');
  const case_nested_dir_path = NODE_PATH.join(temp_dir_path, 'case_dir', 'nested_dir');
  afterEach(async () => {
    await NodePlatform_Directory_Delete_Async(case_dir_path, true);
  });

  describe('Error Cases', () => {
    test('Throws When Creating Nested Directory Without Recursive', async () => {
      try {
        await NodePlatform_Directory_Create_Async(case_nested_dir_path, false);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('Throws When A Path Segment Is A File', async () => {
      try {
        await NodePlatform_Directory_Create_Async(NODE_PATH.join(temp_file_path, 'nested_dir'), true);
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

  test('Create Directory', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
  });
  test('Create Nested Directory', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
  });
  test('Do Nothing If Directory Already Exists', async () => {
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
    expect(await NodePlatform_Directory_Create_Async(case_dir_path, false)).toBeTrue();
    expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
    expect(await NodePlatform_Directory_Create_Async(case_nested_dir_path, true)).toBeTrue();
  });
});
