import { describe, expect, test } from 'bun:test';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { NODE_NET, NODE_PATH } from '../../NodePlatform.js';
import { NodePlatform_Path_Get_Stats_Async } from '../../NodePlatform_Path_Get_Stats_Async.js';
import { NodePlatform_SetupTempDirectory, temp_dir_path, temp_file_path, temp_junction_to_dir_path, temp_nonexistent_path, temp_symboliclink_loop_a_path, temp_symboliclink_to_dir_path, temp_symboliclink_to_file_path, temp_symboliclink_to_nonexistent_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

/**
 * There are some reserved names that Windows will not allow for use as file
 * names. Some examples are NUL, CON, and PRN. File creation with such names
 * will surely fail, but fs.stat will not always throw an error, leaving the
 * user to guess if a file actually exists or not. I hope these tests will
 * share some light on the subject for those who aren't aware.
 *
 * A list of reserved file names on Windows:
 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file
 */
describe(NodePlatform_Path_Get_Stats_Async.name, async () => {
  describe('Error Cases', () => {
    if (process.platform === 'win32') {
      describe('Win32', () => {
        /**
         * When long path support is enabled, Windows allows paths with up to
         * 2^15 characters minus a couple for things like internal null bytes.
         * I assume the same error code is used for lengths of 260~ when long
         * path support is not enabled. NTFS supposedly supports up to 255-260
         * characters per segment, but fs.stat doesn't seem to check with such
         * precision.
         *
         * Interestingly enough, if the path contains a valid root, somewhere
         * around 30 characters are reserved. Without a root, fs.stat allows
         * the full 2^15-1 characters. I'm not sure why this is.
         */
        test('Path Too Long - With Segments', async () => {
          const path = 'C:' + Array.from({ length: 127 }, () => '\\' + 'a'.repeat(255)).join('') + '\\' + 'a'.repeat(255 - 31);
          expect(path.length).toBe(32739);
          try {
            await NodePlatform_Path_Get_Stats_Async(path);
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENAMETOOLONG: name too long');
            expect(error.code).toBe('ENAMETOOLONG');
          }
        });
        test('Path Too Long - Without Segments', async () => {
          const path = 'C:\\' + 'a'.repeat(2 ** 15 - 32);
          expect(path.length).toBe(32739);
          try {
            await NodePlatform_Path_Get_Stats_Async(path);
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENAMETOOLONG: name too long');
            expect(error.code).toBe('ENAMETOOLONG');
          }
        });
        /**
         * Here is an example of when fs.stats will throw EINVAL when querying
         * a reserved name on Windows.
         */
        test('CON', async () => {
          try {
            await NodePlatform_Path_Get_Stats_Async('CON');
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('EINVAL: invalid argument');
            expect(error.code).toBe('EINVAL');
          }
        });
        /**
         * Here is an example of when fs.stats will throw ENOENT when querying
         * a reserved name on Windows. The user might incorrectly assume that
         * the path is valid but no file has been created for it. Like above,
         * this path is also invalid, but due to internal design, fs.stat uses
         * ENOENT instead of EINVAL.
         */
        test('*', async () => {
          try {
            await NodePlatform_Path_Get_Stats_Async('*');
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
          }
        });
      });
    } else {
      describe('Posix', () => {
        /**
         * On most Posix systems, the longest path length allowed is 4096
         * characters, and only 255 characters per segment. fs.stat seems to
         * care when segments are too long on Linux, so we can test for both.
         */
        test('Path Segment Too Long', async () => {
          try {
            await NodePlatform_Path_Get_Stats_Async('a'.repeat(256));
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENAMETOOLONG: name too long');
            expect(error.code).toBe('ENAMETOOLONG');
          }
        });
        test('Path Too Long', async () => {
          const path = '/' + Array.from({ length: 16 }, () => 'a'.repeat(255)).join('/');
          expect(path.length).toBe(4096);
          try {
            await NodePlatform_Path_Get_Stats_Async(path.repeat(256));
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENAMETOOLONG: name too long');
            expect(error.code).toBe('ENAMETOOLONG');
          }
        });
      });
    }
    test('Non-existent Path', async () => {
      try {
        await NodePlatform_Path_Get_Stats_Async(temp_nonexistent_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('SymbolicLink That Targets Non-existent Path', async () => {
      try {
        await NodePlatform_Path_Get_Stats_Async(temp_symboliclink_to_nonexistent_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
    test('SymbolicLink Loop', async () => {
      try {
        await NodePlatform_Path_Get_Stats_Async(temp_symboliclink_loop_a_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ELOOP: too many symbolic links encountered');
        expect(error.code).toBe('ELOOP');
      }
    });
    /**
     * Strings with null bytes have a dedicated error message with no code. I
     * assume other invalid inputs trigger this error as well.
     */
    test('\0', async () => {
      try {
        await NodePlatform_Path_Get_Stats_Async('\0');
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith("The argument 'path' must be a string, Uint8Array, or URL without null bytes.");
        expect(error.code).toBeUndefined();
      }
    });
  });

  describe('Edge Cases', () => {
    if (process.platform === 'win32') {
      describe('Win32', () => {
        /**
         * This will indeed create the entire file path on Windows (I tested).
         * As long as the path segments are each less than 256 characters each,
         * you can create a full path up to 32,738 characters (as far as my
         * Windows 10 machine goes). I can navigate the resulting path tree,
         * but File Explorer won't let me delete it. I have to open up CMD for
         * that.
         *
         * The final segment in this test is 223 characters. Attempting to add
         * just 1 more character will result in the ENAMETOOLONG error. I have
         * not confirmed whether this is a limitation of fs.stat or Windows'
         * internal api. What I have confirmed on my machine is that at 32,761
         * characters, Bun will internally fail.
         *
         * Note - A path segment is the part between two backslashes:
         *   \<path segment>\
         */
        test('Path Length 1 Character Less Than Too Long - With Segments', async () => {
          const path = 'C:' + Array.from({ length: 127 }, () => '\\' + 'a'.repeat(255)).join('') + '\\' + 'a'.repeat(255 - 31 - 1);
          expect(path.length).toBe(32738);
          try {
            await NodePlatform_Path_Get_Stats_Async(path);
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
          }
        });
        test('Path Length 1 Character Less Than Too Long - Without Segments', async () => {
          const path = 'C:\\' + 'a'.repeat(2 ** 15 - 32 - 1);
          expect(path.length).toBe(32738);
          try {
            await NodePlatform_Path_Get_Stats_Async(path);
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
          }
        });

        /**
         * Here is an example of when fs.stats will successfully return stats
         * for a reserved name that is considered a Character Device.
         */
        test('NUL', async () => {
          const stats = await NodePlatform_Path_Get_Stats_Async('NUL');
          // expect true
          expect(stats.isCharacterDevice()).toBeTrue();
          // expect false
          expect(stats.isBlockDevice()).toBeFalse();
          expect(stats.isDirectory()).toBeFalse();
          expect(stats.isFIFO()).toBeFalse();
          expect(stats.isFile()).toBeFalse();
          expect(stats.isSocket()).toBeFalse();
          expect(stats.isSymbolicLink()).toBeFalse();
        });
      });
    } else {
      describe('Posix', () => {
        test('Path Segment Length 1 Character Less Than Too Long', async () => {
          try {
            await NodePlatform_Path_Get_Stats_Async('a'.repeat(256 - 1));
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
          }
        });
        test('Path Length 1 Character Less Than Too Long', async () => {
          const path = '/' + Array.from({ length: 15 }, () => 'a'.repeat(255)).join('/') + '/' + 'a'.repeat(255 - 1);
          expect(path.length).toBe(4096 - 1);
          try {
            await NodePlatform_Path_Get_Stats_Async(path);
            throw new Error('FAIL-CASE');
          } catch (error: any) {
            expect(error.message).toStartWith('ENOENT: no such file or directory');
            expect(error.code).toBe('ENOENT');
          }
        });

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
          const stats = await NodePlatform_Path_Get_Stats_Async(temp_fifo_device_path);
          // expect true
          expect(stats.isFIFO()).toBeTrue();
          // expect false
          expect(stats.isBlockDevice()).toBeFalse();
          expect(stats.isCharacterDevice()).toBeFalse();
          expect(stats.isDirectory()).toBeFalse();
          expect(stats.isFile()).toBeFalse();
          expect(stats.isSocket()).toBeFalse();
          expect(stats.isSymbolicLink()).toBeFalse();
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
          const stats = await NodePlatform_Path_Get_Stats_Async(temp_socket_device_path);
          // expect true
          expect(stats.isSocket()).toBeTrue();
          // expect false
          expect(stats.isBlockDevice()).toBeFalse();
          expect(stats.isCharacterDevice()).toBeFalse();
          expect(stats.isDirectory()).toBeFalse();
          expect(stats.isFIFO()).toBeFalse();
          expect(stats.isFile()).toBeFalse();
          expect(stats.isSymbolicLink()).toBeFalse();
          temp_server.close();
        });

        /** Mandated Character Devices. */
        test('/dev/null', async () => {
          const stats = await NodePlatform_Path_Get_Stats_Async('/dev/null');
          // expect true
          expect(stats.isCharacterDevice()).toBeTrue();
          // expect false
          expect(stats.isBlockDevice()).toBeFalse();
          expect(stats.isDirectory()).toBeFalse();
          expect(stats.isFIFO()).toBeFalse();
          expect(stats.isFile()).toBeFalse();
          expect(stats.isSocket()).toBeFalse();
          expect(stats.isSymbolicLink()).toBeFalse();
        });
        test('/dev/zero', async () => {
          const stats = await NodePlatform_Path_Get_Stats_Async('/dev/zero');
          // expect true
          expect(stats.isCharacterDevice()).toBeTrue();
          // expect false
          expect(stats.isBlockDevice()).toBeFalse();
          expect(stats.isDirectory()).toBeFalse();
          expect(stats.isFIFO()).toBeFalse();
          expect(stats.isFile()).toBeFalse();
          expect(stats.isSocket()).toBeFalse();
          expect(stats.isSymbolicLink()).toBeFalse();
        });
        /** Potential Block Devices. */
        test('/dev/sda', async () => {
          try {
            const stats = await NodePlatform_Path_Get_Stats_Async('/dev/sda');
            // expect true
            expect(stats.isBlockDevice()).toBeTrue();
            // expect false
            expect(stats.isCharacterDevice()).toBeFalse();
            expect(stats.isDirectory()).toBeFalse();
            expect(stats.isFIFO()).toBeFalse();
            expect(stats.isFile()).toBeFalse();
            expect(stats.isSocket()).toBeFalse();
            expect(stats.isSymbolicLink()).toBeFalse();
          } catch (error) {
            /** If the device exists, great. If not, ignore this test case. */
            Core_Console_Error("Ignore Test Case: /dev/sda (device doesn't exist)");
          }
        });
        test('/dev/disk0', async () => {
          try {
            const stats = await NodePlatform_Path_Get_Stats_Async('/dev/disk0');
            // expect true
            expect(stats.isBlockDevice()).toBeTrue();
            // expect false
            expect(stats.isCharacterDevice()).toBeFalse();
            expect(stats.isDirectory()).toBeFalse();
            expect(stats.isFIFO()).toBeFalse();
            expect(stats.isFile()).toBeFalse();
            expect(stats.isSocket()).toBeFalse();
            expect(stats.isSymbolicLink()).toBeFalse();
          } catch (error) {
            /** If the device exists, great. If not, ignore this test case. */
            Core_Console_Error("Ignore Test Case: /dev/disk0 (device doesn't exist)");
          }
        });
      });
    }
  });

  test('Directory', async () => {
    const stats = await NodePlatform_Path_Get_Stats_Async(temp_dir_path);
    // expect true
    expect(stats.isDirectory()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
    expect(stats.isSymbolicLink()).toBeFalse();
  });
  test('File', async () => {
    const stats = await NodePlatform_Path_Get_Stats_Async(temp_file_path);
    // expect true
    expect(stats.isFile()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isDirectory()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
    expect(stats.isSymbolicLink()).toBeFalse();
  });

  test('Junction To Directory Resolves To Target Directory', async () => {
    const stats = await NodePlatform_Path_Get_Stats_Async(temp_junction_to_dir_path);
    // expect true
    expect(stats.isDirectory()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
    expect(stats.isSymbolicLink()).toBeFalse();
  });
  test('SymbolicLink To Directory Resolves To Target Directory', async () => {
    const stats = await NodePlatform_Path_Get_Stats_Async(temp_symboliclink_to_dir_path);
    // expect true
    expect(stats.isDirectory()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
    expect(stats.isSymbolicLink()).toBeFalse();
  });
  test('SymbolicLink To File Resolves To Target File', async () => {
    const stats = await NodePlatform_Path_Get_Stats_Async(temp_symboliclink_to_file_path);
    // expect true
    expect(stats.isFile()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isDirectory()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
    expect(stats.isSymbolicLink()).toBeFalse();
  });
});
