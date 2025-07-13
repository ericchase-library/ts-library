import { Core_Promise_Deferred_Class } from './Core_Promise_Deferred_Class.js';
import { NODE_FS } from './NodePlatform.js';

export const Error_Message_NodePlatform_Directory_Create_Watcher_Async_Chokidar_Not_Installed = `
This library relies on the package "chokidar" is for file system watching. To
use this feature, please install it by running the appropriate command for the
package manager of your choice:

  bun add chokidar
  npm install chokidar
  pnpm add chokidar
  yarn add chokidar

For developers building a library, you can decide whether to add "chokidar" as
a direct dependency or a peer dependency for your final product. To give the
user the option of saving space, add "chokidar" to the "peerDependencies"
section in your project's package.json file.
`;

/**
 * These are all Chokidar specific types and interfaces that I copy pasted. It
 * allows us to provide type support without Chokidar being installed.
 */

/*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
type AWF = {
  stabilityThreshold: number;
  pollInterval: number;
};
interface MatcherObject {
  path: string;
  recursive?: boolean;
}
type MatchFunction = (val: string, stats?: NODE_FS.Stats) => boolean;
type Matcher = string | RegExp | MatchFunction | MatcherObject;
type ChokidarOptions = {
  alwaysStat?: boolean | undefined;
  atomic?: number | boolean | undefined;
  awaitWriteFinish?: boolean | Partial<AWF> | undefined;
  binaryInterval?: number | undefined;
  cwd?: string | undefined;
  depth?: number | undefined;
  followSymlinks?: boolean | undefined;
  ignored?: Matcher | Matcher[] | undefined;
  ignoreInitial?: boolean | undefined;
  ignorePermissionErrors?: boolean | undefined;
  interval?: number | undefined;
  persistent?: boolean | undefined;
  usePolling?: boolean | undefined;
};

/**
 * Checks for path existence. Will throw if path does not exist. Chokidar is
 * able to wait for a watched folder to be created, but that isn't the use
 * case this API is made to handle. If you want more control over the watcher,
 * then use Chokidar directly instead of this function.
 */
export async function NodePlatform_Directory_Watch_Async(
  path: string, //
  event_callback: (event: string, path: string, stats?: NODE_FS.Stats) => void,
  error_callback: (error: unknown) => void,
  options?: ChokidarOptions,
) {
  let chokidar_module;

  options ??= {};
  options.depth ??= Infinity;
  options.ignoreInitial ??= true;
  options.persistent ??= true;

  try {
    chokidar_module = await import('chokidar');
  } catch {
    throw new Error(Error_Message_NodePlatform_Directory_Create_Watcher_Async_Chokidar_Not_Installed);
  }

  await NODE_FS.promises.access(path, NODE_FS.constants.F_OK);

  const watcher = chokidar_module.watch(path, options);
  const { promise, resolve } = Core_Promise_Deferred_Class();
  async function ReadyHandler() {
    resolve();
  }
  watcher.on('all', event_callback);
  watcher.on('unlink', (path) => {
    console.log('unlink:', path);
  });
  watcher.on('unlinkDir', (path) => {
    console.log('unlinkDir:', path);
  });
  watcher.on('error', error_callback);
  watcher.on('ready', ReadyHandler);
  await promise;
  watcher.off('ready', ReadyHandler);
  return {
    options: watcher.options,
    unwatch: () => {
      watcher.close();
    },
  };
}

/**
 * Note: `recursive` is not supported on Linux. Both Windows (via
 * ReadDirectoryChangesW) and macOS (via FSEvents) provide native recursive
 * directory watching through the OS. Unfortunately, this means an alternative
 * approach is necessary for Linux, whose kernel lacks the capability.
 *
 * Caveats: On macOS, when watching large folder trees, FSEvents may coalesce
 * rapid changes. On Windows, symbolic link behavior can be inconsistent; test
 * for your use case if symlinks are common.
 */
// export type WatchCallback = (event: 'rename' | 'change', path: string | null) => void;
// export function NodePlatform_Directory_Watch(path: string, callback: WatchCallback, recursive = true): () => void {
//   path = NODE_PATH.normalize(path);
//   const watcher = NODE_FS.watch(path, { persistent: true, recursive }, callback);
//   return () => {
//     watcher.close();
//   };
// }
