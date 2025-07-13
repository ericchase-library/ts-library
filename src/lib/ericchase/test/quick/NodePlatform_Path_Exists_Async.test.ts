import { describe, expect, test } from 'bun:test';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { Core_Error_Fix_Call_Stack_Async } from '../../Core_Error_Fix_Call_Stack_Async.js';
import { NODE_NET, NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_Path_Exists_Async } from '../../NodePlatform_Path_Exists_Async.js';
import { NodePlatform_SetupTempDirectory_Async, temp_dir_path, temp_file_path, temp_junction_to_dir_path, temp_nonexistent_path, temp_symboliclink_loop_a_path, temp_symboliclink_to_dir_path, temp_symboliclink_to_file_path, temp_symboliclink_to_nonexistent_path } from '../test-setup.js';

await Core_Error_Fix_Call_Stack_Async(Error().stack, NodePlatform_SetupTempDirectory_Async());

describe(NodePlatform_Path_Exists_Async.name, async () => {
  describe('Edge Cases', () => {
    if (process.platform === 'win32') {
      describe('Win32', () => {
        test('NUL', async () => {
          expect(await NodePlatform_Path_Exists_Async('NUL')).toBeTrue();
        });
        test('CON', async () => {
          expect(await NodePlatform_Path_Exists_Async('CON')).toBeFalse();
        });
        test('*', async () => {
          expect(await NodePlatform_Path_Exists_Async('*')).toBeFalse();
        });
      });
    } else {
      describe('Posix', () => {
        /**
         * FIFO Devices are freely accessible on Posix systems and correctly
         * reported as FIFO Devices by fs.stat. On Windows, FIFO Devices are
         * considered files by fs.stat. The only way to confirm if a path is
         * actually a FIFO Device on Windows is to try connecting to it. Since
         * this test case is for fs.stat, we only test Posix systems here.
         */
        test('FIFO Device', async () => {
          const temp_fifo_device_path = NODE_PATH.join(temp_dir_path, 'temp_fifo_device');
          Bun.spawnSync(['mkfifo', temp_fifo_device_path]);
          expect(await NodePlatform_Path_Exists_Async(temp_fifo_device_path)).toBeTrue();
        });
        /**
         * Socket Devices are freely accessible on Posix systems, but result in
         * EACCES error on Windows, even though we literally created the socket
         * in this program. The user needs to be aware of this, so hopefully
         * this test case helps.
         */
        test('Socket Device', async () => {
          const temp_socket_device_path = NODE_PATH.join(temp_dir_path, 'temp_socket_device');
          const temp_server = NODE_NET.createServer(() => {});
          temp_server.listen(temp_socket_device_path, () => {});
          expect(await NodePlatform_Path_Exists_Async(temp_socket_device_path)).toBeTrue();
          temp_server.close();
        });

        /** Mandated Character Devices. */
        test('/dev/null', async () => {
          expect(await NodePlatform_Path_Exists_Async('/dev/null')).toBeTrue();
        });
        test('/dev/zero', async () => {
          expect(await NodePlatform_Path_Exists_Async('/dev/zero')).toBeTrue();
        });
        /** Potential Block Devices. */
        test('/dev/sda', async () => {
          try {
            expect(await NodePlatform_Path_Exists_Async('/dev/sda')).toBeTrue();
          } catch (error) {
            /** If the device exists, great. If not, ignore this test case. */
            Core_Console_Error("Ignore Test Case: /dev/sda (device doesn't exist)");
          }
        });
        test('/dev/disk0', async () => {
          try {
            expect(await NodePlatform_Path_Exists_Async('/dev/disk0')).toBeTrue();
          } catch (error) {
            /** If the device exists, great. If not, ignore this test case. */
            Core_Console_Error("Ignore Test Case: /dev/disk0 (device doesn't exist)");
          }
        });
      });
    }
  });

  test('Directory', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_dir_path)).toBeTrue();
  });
  test('File', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_file_path)).toBeTrue();
  });

  test('Junction To Directory Resolves To Target Directory', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_junction_to_dir_path)).toBeTrue();
  });
  test('SymbolicLink To Directory Resolves To Target Directory', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_symboliclink_to_dir_path)).toBeTrue();
  });
  test('SymbolicLink To File Resolves To Target File', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_symboliclink_to_file_path)).toBeTrue();
  });

  test('Parent Path Is A File', async () => {
    expect(await NodePlatform_Path_Exists_Async(NODE_PATH.join(temp_file_path, 'test.txt'))).toBeFalse();
  });
  test('Non-existent Path', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_nonexistent_path)).toBeFalse();
  });
  test('SymbolicLink That Targets Non-existent Path', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_symboliclink_to_nonexistent_path)).toBeFalse();
  });
  test('SymbolicLink Loop', async () => {
    expect(await NodePlatform_Path_Exists_Async(temp_symboliclink_loop_a_path)).toBeFalse();
  });
  test('\0', async () => {
    expect(await NodePlatform_Path_Exists_Async('\0')).toBeFalse();
  });
});
