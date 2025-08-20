/**
 * This file enables tracking of sub-repos by temporarily renaming the `.git`
 * folder to `.git.git`.
 */

import { Core_Array_Uint8_To_String } from '../src/lib/ericchase/Core_Array_Uint8_To_String.js';
import { Core_Console_Error } from '../src/lib/ericchase/Core_Console_Error.js';
import { Core_Console_Log } from '../src/lib/ericchase/Core_Console_Log.js';
import { Async_Core_Stream_Uint8_Read_All } from '../src/lib/ericchase/Core_Stream_Uint8_Read_All.js';
import { NODE_FS, NODE_PATH } from '../src/lib/ericchase/NodePlatform.js';

const subrepo_paths: string[] = ['server'];

async function async_trackSubrepos(paths: string[]) {
  for (const path of paths) {
    try {
      await NODE_FS.rename(NODE_PATH.join(path, '.git'), NODE_PATH.join(path, '.git.git'));
      Core_Console_Log(`Success: Rename ${path} ".git"`);
    } catch (error) {
      Core_Console_Error(`Failure: Rename ${path} ".git"`, error);
    }

    const cmd = ['git', 'add', NODE_PATH.join(path)];
    const p0 = Bun.spawn(cmd, { stderr: 'pipe', stdout: 'pipe' });
    Core_Console_Log(`Running "${cmd.join(' ')}"`);
    await p0.exited;
    const errors = Core_Array_Uint8_To_String(await Async_Core_Stream_Uint8_Read_All(p0.stderr));
    if (errors.length > 0) {
      Core_Console_Error(errors);
    }
    const logs = Core_Array_Uint8_To_String(await Async_Core_Stream_Uint8_Read_All(p0.stdout));
    if (logs.length > 0) {
      Core_Console_Log(logs);
    }

    try {
      await NODE_FS.rename(NODE_PATH.join(path, '.git.git'), NODE_PATH.join(path, '.git'));
      Core_Console_Log(`Success: Restore ${path} ".git"`);
    } catch (error) {
      Core_Console_Error(`Failure: Restore ${path} ".git"`, error);
    }

    Core_Console_Log();
  }
}

async_trackSubrepos(subrepo_paths);
