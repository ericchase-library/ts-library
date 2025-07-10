import { describe, expect, test } from 'bun:test';
import { NodePlatform_Path_Get_Stats_SymbolicLink_Async } from '../../NodePlatform_Path_Get_Stats_SymbolicLink_Async.js';
import { NodePlatform_SetupTempDirectory, temp_junction_to_dir_path, temp_nonexistent_path, temp_symboliclink_loop_a_path, temp_symboliclink_to_dir_path, temp_symboliclink_to_file_path } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

/**
 * The fs.lstat API queries the OS for Symbolic Link information. During normal
 * operation, symbolic links wil resolve to the files they target with no extra
 * work needed from the user. In some scenarios, however, the user might want
 * to explicitely operate on the link itself. There are some common work flows
 * when knowing whether a path is a link or file is desired. This library API
 * and test cases should help prevent common errors in such situations.
 */
describe(NodePlatform_Path_Get_Stats_SymbolicLink_Async.name, async () => {
  describe('Error Cases', () => {
    test('Non-existent Path', async () => {
      try {
        await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_nonexistent_path);
        throw new Error('FAIL-CASE');
      } catch (error: any) {
        expect(error.message).toStartWith('ENOENT: no such file or directory');
        expect(error.code).toBe('ENOENT');
      }
    });
  });

  describe('Edge Cases', () => {
    test('SymbolicLink That Targets Non-existent Path', async () => {
      const stats = await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_symboliclink_to_file_path);
      // expect true
      expect(stats.isSymbolicLink()).toBeTrue();
      // expect false
      expect(stats.isBlockDevice()).toBeFalse();
      expect(stats.isCharacterDevice()).toBeFalse();
      expect(stats.isDirectory()).toBeFalse();
      expect(stats.isFIFO()).toBeFalse();
      expect(stats.isFile()).toBeFalse();
      expect(stats.isSocket()).toBeFalse();
    });
    test('SymbolicLink Loop', async () => {
      const stats = await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_symboliclink_loop_a_path);
      // expect true
      expect(stats.isSymbolicLink()).toBeTrue();
      // expect false
      expect(stats.isBlockDevice()).toBeFalse();
      expect(stats.isCharacterDevice()).toBeFalse();
      expect(stats.isDirectory()).toBeFalse();
      expect(stats.isFIFO()).toBeFalse();
      expect(stats.isFile()).toBeFalse();
      expect(stats.isSocket()).toBeFalse();
    });
  });

  test('Junction To Directory', async () => {
    const stats = await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_junction_to_dir_path);
    // expect true
    expect(stats.isSymbolicLink()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isDirectory()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
  });
  test('SymbolicLink To Directory', async () => {
    const stats = await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_symboliclink_to_dir_path);
    // expect true
    expect(stats.isSymbolicLink()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isDirectory()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
  });
  test('SymbolicLink To File', async () => {
    const stats = await NodePlatform_Path_Get_Stats_SymbolicLink_Async(temp_symboliclink_to_file_path);
    // expect true
    expect(stats.isSymbolicLink()).toBeTrue();
    // expect false
    expect(stats.isBlockDevice()).toBeFalse();
    expect(stats.isCharacterDevice()).toBeFalse();
    expect(stats.isDirectory()).toBeFalse();
    expect(stats.isFIFO()).toBeFalse();
    expect(stats.isFile()).toBeFalse();
    expect(stats.isSocket()).toBeFalse();
  });
});
