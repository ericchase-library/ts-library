import { afterAll, beforeAll } from 'bun:test';
import { ARRAY__UINT8__EMPTY } from '../Core_Array_Uint8.js';
import { Core_Console_Log } from '../Core_Console_Log.js';
import { NODE_FS, NODE_OS, NODE_PATH } from '../NodePlatform.js';
import { NodePlatform_Directory_Create_Async } from '../NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_File_Write_Bytes_Async } from '../NodePlatform_File_Write_Bytes_Async.js';

/**
 * Setup some temporary folders and files, along with non-existent paths.
 * The files will be written before tests run and deleted when tests finish.
 */
export const temp_dir_path = await NODE_FS.promises.mkdtemp(NODE_PATH.join(NODE_OS.tmpdir(), 'NodePlatform.test.ts-'));
export const temp_file_path = NODE_PATH.join(temp_dir_path, 'temp_file.txt');
export const temp_junction_to_dir_path = NODE_PATH.join(temp_dir_path, 'temp_junction_dir');
export const temp_symboliclink_loop_a_path = NODE_PATH.join(temp_dir_path, 'temp_syboliclink_loop_a_file');
export const temp_symboliclink_loop_b_path = NODE_PATH.join(temp_dir_path, 'temp_syboliclink_loop_b_file');
export const temp_symboliclink_to_dir_path = NODE_PATH.join(temp_dir_path, 'temp_syboliclink_dir');
export const temp_symboliclink_to_file_path = NODE_PATH.join(temp_dir_path, 'temp_syboliclink_file');

export const temp_nonexistent_path = NODE_PATH.join(temp_dir_path, 'does_not_exist');
export const temp_symboliclink_to_nonexistent_path = NODE_PATH.join(temp_dir_path, 'temp_syboliclink_to_nonexistent_file');

export function NodePlatform_SetupTempDirectory() {
  Core_Console_Log('Temp Directory:', temp_dir_path);

  beforeAll(async () => {
    await NodePlatform_Directory_Create_Async(temp_dir_path, true);
    await NodePlatform_File_Write_Bytes_Async(temp_file_path, ARRAY__UINT8__EMPTY);
    await NODE_FS.promises.symlink(temp_dir_path, temp_junction_to_dir_path, 'junction');
    await NODE_FS.promises.symlink(temp_dir_path, temp_symboliclink_to_dir_path);
    await NODE_FS.promises.symlink(temp_file_path, temp_symboliclink_to_file_path);
    await NODE_FS.promises.symlink(temp_nonexistent_path, temp_symboliclink_to_nonexistent_path);
    await NODE_FS.promises.symlink(temp_symboliclink_loop_a_path, temp_symboliclink_loop_b_path);
    await NODE_FS.promises.symlink(temp_symboliclink_loop_b_path, temp_symboliclink_loop_a_path);
  });
  afterAll(async () => {
    await NodePlatform_Directory_Delete_Async(temp_dir_path, true);
  });
}
