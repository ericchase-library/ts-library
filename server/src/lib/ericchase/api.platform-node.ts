import { default as NODE_FS } from 'node:fs';
import { default as NODE_PATH } from 'node:path';
import { default as NODE_URL } from 'node:url';
import { Core_Promise_Orphan, Core_Utility_DecodeBytes } from './api.core.js';
import { PATH__RESOLVED_CWD, SHELL__KEYS, SHELL__KEYS_CSI, SHELL__STDIN__LISTENERSET, SHELL__STDIN__READERLOCKS, internal_error_call_async, internal_shell_data, internal_shell_setup_exit_trap_for_cursor } from './platform-node.js';

export { NODE_FS, NODE_PATH, NODE_URL };

export const NodePlatform_Shell_Keys = SHELL__KEYS;

export type WatchCallback = (event: 'rename' | 'change', path: string) => void;

export async function NodePlatform_Directory_Async_Create(path: string, recursive = true): Promise<boolean> {
  try {
    if (PATH__RESOLVED_CWD !== NodePlatform_Path_Resolve(path)) {
      await internal_error_call_async(Error().stack, NODE_FS.promises.mkdir(NodePlatform_Path_Join(path), { recursive }));
    }
  } catch (error: any) {
    switch (error.code) {
      case 'EEXIST':
        break;
      default:
        throw error;
    }
  }
  return (await NODE_FS.promises.stat(NodePlatform_Path_Join(path))).isDirectory();
}

export async function NodePlatform_Directory_Async_Delete(path: string, recursive = false): Promise<boolean> {
  try {
    if (recursive === false) {
      await internal_error_call_async(Error().stack, NODE_FS.promises.rmdir(NodePlatform_Path_Join(path)));
    } else {
      await internal_error_call_async(Error().stack, NODE_FS.promises.rm(NodePlatform_Path_Join(path), { recursive: true, force: true }));
    }
  } catch (error: any) {
    switch (error.code) {
      case 'ENOENT':
      case 'ENOTEMPTY':
        break;
      // @ts-ignore
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: we want the fallthrough
      case 'EFAULT':
        error.message += '\nPossible Causes: Directory not empty, set parameter `recursive` to `true`';
      default:
        throw error;
    }
  }
  return NODE_FS.existsSync(NodePlatform_Path_Join(path)) === false;
}

export async function NodePlatform_Directory_Async_ReadDir(path: string, recursive = true): Promise<NODE_FS.Dirent[]> {
  try {
    return await internal_error_call_async(
      Error().stack,
      NODE_FS.promises.readdir(NodePlatform_Path_Join(path), {
        recursive,
        withFileTypes: true,
      }),
    );
  } catch (error: any) {
    switch (error.code) {
      default:
        throw error;
    }
  }
}

export function NodePlatform_Directory_Watch(path: string, callback: WatchCallback, recursive = true): () => void {
  const watcher = NODE_FS.watch(NodePlatform_Path_Join(path), { persistent: true, recursive }, (event, filename) => {
    callback(event, filename ?? '');
  });
  return () => {
    watcher.close();
  };
}

export async function NodePlatform_File_Async_AppendBytes(path: string, bytes: Uint8Array): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), bytes));
}

export async function NodePlatform_File_Async_AppendText(path: string, text: string): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), text));
}

export async function NodePlatform_File_Async_ReadBytes(path: string): Promise<Uint8Array<ArrayBuffer>> {
  return Uint8Array.from(await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), {})));
}

export async function NodePlatform_File_Async_ReadText(path: string): Promise<string> {
  return await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), { encoding: 'utf8' }));
}

export async function NodePlatform_File_Async_WriteBytes(path: string, bytes: Uint8Array): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.writeFile(NodePlatform_Path_Join(path), bytes));
}

export async function NodePlatform_File_Async_WriteText(path: string, text: string): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.writeFile(NodePlatform_Path_Join(path), text));
}

export async function NodePlatform_Path_Async_GetStats(path: string): Promise<NODE_FS.Stats> {
  return await internal_error_call_async(Error().stack, NODE_FS.promises.stat(NodePlatform_Path_Join(path)));
}

export async function NodePlatform_Path_Async_IsDirectory(path: string): Promise<boolean> {
  return (await NodePlatform_Path_Async_GetStats(path)).isDirectory();
}

export async function NodePlatform_Path_Async_IsFile(path: string): Promise<boolean> {
  return (await NodePlatform_Path_Async_GetStats(path)).isFile();
}

export async function NodePlatform_Path_Async_IsSymbolicLink(path: string): Promise<boolean> {
  return (await NodePlatform_Path_Async_GetStats(path)).isSymbolicLink();
}

export function NodePlatform_Path_CountSegments(path: string): number {
  if (path.length === 0) {
    return 0;
  }
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  // Slashes ARE removed from segments.
  let count__segments = 1;
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      ++count__segments;
    }
  }
  return count__segments;
}

export function NodePlatform_Path_GetBaseName(path: string): string {
  /**
   * Returns the rightmost segment of the path (trailing slash excluded).
   */
  const rightmost_segment = NodePlatform_Path_Slice(path, -1);

  // if segment contains more than 1 character
  if (rightmost_segment.length > 1) {
    const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // remove trailing slash
      return rightmost_segment.slice(0, -1);
    }
  }

  return rightmost_segment;
}

export function NodePlatform_Path_GetDirName(path: string): string {
  /**
   * Returns the path after removing the rightmost segment (trailing slash included).
   * If the path contains only one segment, returns . for relative paths and the entire segment for absolute paths.
   */
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return '.' + NODE_PATH.sep;
  }
  if (segment_count === 1) {
    // absolute path mac/linux
    if (['/', '\\'].includes(path)) {
      return path;
    }
    // absolute path windows
    if (path.endsWith(':')) {
      return path;
    }
    const rightmost_character = path[path.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // return . with existing trailing slash
      return '.' + rightmost_character;
    }
    // return . with platform specific trailing slash
    return '.' + NODE_PATH.sep;
  }
  // return path excluding rightmost segment
  return NodePlatform_Path_Slice(path, 0, -1);
}

export function NodePlatform_Path_GetExtension(path: string): string {
  /**
   * Returns all characters in the basename that appear right of the rightmost dot, including the dot.
   * If the basename has no dots, returns empty string.
   * If the basename is '.' or '..', returns empty string.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  if (['.', '..'].includes(basename)) {
    return '';
  }
  const index__rightmost_dot = basename.lastIndexOf('.');
  if (index__rightmost_dot === -1) {
    return '';
  }
  return basename.slice(index__rightmost_dot);
}

export function NodePlatform_Path_GetName(path: string): string {
  /**
   * Returns all characters in the basename that appear left of the rightmost dot, excluding the dot.
   * If the basename has no dots, returns the entire string.
   * If the basename is '.' or '..', returns the entire string.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  if (['.', '..'].includes(basename)) {
    return basename;
  }
  const index__rightmost_dot = basename.lastIndexOf('.');
  if (index__rightmost_dot === -1) {
    return basename;
  }
  return basename.slice(0, index__rightmost_dot);
}

export function NodePlatform_Path_GetSegments(path: string): string[] {
  if (path.length === 0) {
    return [];
  }
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  // Slashes ARE removed from segments.
  const array__segments: string[] = [];
  let index__start = 0;
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      array__segments.push(path.slice(index__start, i));
      index__start = i;
    }
  }
  // add remaining segment
  array__segments.push(path.slice(index__start));
  // remove trailing slashes
  for (let i = 0; i < array__segments.length; i++) {
    if (array__segments[i].length > 1) {
      if (['/', '\\'].includes(array__segments[i][array__segments[i].length - 1])) {
        array__segments[i] = array__segments[i].slice(0, -1);
      }
    }
  }
  return array__segments;
}

export function NodePlatform_Path_Join(...paths: string[]): string {
  return (paths[0] === '.' ? '.' + NODE_PATH.sep : '') + NODE_PATH.join(...paths);
}

export function NodePlatform_Path_JoinStandard(...paths: string[]): string {
  return (paths[0] === '.' ? './' : '') + NODE_PATH.join(...paths).replaceAll('\\', '/');
}

export function NodePlatform_Path_ReplaceBaseName(path: string, value: string): string {
  /**
   * Replaces the basename of `path` with `value` (keeps existing trailing slash).
   */
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return value;
  }
  if (segment_count === 1) {
    // absolute path mac/linux
    if (['/', '\\'].includes(path)) {
      return value;
    }
    // absolute path windows
    if (path.endsWith(':')) {
      return value;
    }
    const rightmost_character = path[path.length - 1];
    if (['/', '\\'].includes(rightmost_character)) {
      // keep trailing slash
      return value + rightmost_character;
    }
    return value;
  }
  let rightmost_segment = NodePlatform_Path_Slice(path, -1);
  const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
  if (['/', '\\'].includes(rightmost_character)) {
    // keep trailing slash
    return NodePlatform_Path_Slice(path, 0, -1) + value + rightmost_character;
  }
  return NodePlatform_Path_Slice(path, 0, -1) + value;
}

export function NodePlatform_Path_ReplaceExtension(path: string, value: string): string {
  /**
   * Replaces the extension portion of basename of `path` with `value` (keeps existing trailing slash).
   */
  // add dot separator if needed
  if (value[0] !== '.') {
    value = '.' + value;
  }
  const name = NodePlatform_Path_GetName(path);
  // absolute path mac/linux
  if (['/', '\\'].includes(name)) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  // absolute path windows
  if (name.endsWith(':')) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  return NodePlatform_Path_ReplaceBaseName(path, name + value);
}

export function NodePlatform_Path_ReplaceName(path: string, value: string): string {
  /**
   * Replaces the name portion of basename of `path` with `value` (keeps existing trailing slash).
   */
  return NodePlatform_Path_ReplaceBaseName(path, value + NodePlatform_Path_GetExtension(path));
}

export function NodePlatform_Path_Resolve(...paths: string[]): string {
  // return Core.Map.GetOrDefault(PATH__RESOLVE_CACHE, path, () => {
  return NODE_PATH.resolve(...paths);
  // });
}

export function NodePlatform_Path_ResolveStandard(...paths: string[]): string {
  // return Core.Map.GetOrDefault(PATH__RESOLVE_CACHE, path, () => {
  return NODE_PATH.resolve(...paths).replaceAll('\\', '/');
  // });
}

export function NodePlatform_Path_Slice(path: string, start?: number, end?: number): string {
  // Trailing slashes are not removed during slicing.
  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  /**
   * `start` (Optional)
   *  Zero-based index at which to start extraction, converted to an integer.
   *   - Negative index counts back from the end of the array:
   *   - If -array.length <= start < 0, start + array.length is used.
   *   - If start < -array.length or start is omitted, 0 is used.
   *   - If start >= array.length, an empty array is returned.
   *
   * `end` (Optional)
   *  Zero-based index at which to end extraction, converted to an integer. slice() extracts up to but not including end.
   *   - Negative index counts back from the end of the array
   *   - If -array.length <= end < 0, end + array.length is used.
   *   - If end < -array.length, 0 is used.
   *   - If end >= array.length or end is omitted or undefined, array.length is used, causing all elements until the end to be extracted.
   *   - If end implies a position before or at the position that start implies, an empty array is returned.
   */
  // The first segment starts at character 0 and includes the first slash if there is one.
  // The rightmost segment starts after the rightmost slash, or the second rightmost slash if the rightmost slash is the rightmost character of the path.
  const array__segment_indices: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    // if previous character is a slash, then this index is the start of the next segment
    if (['/', '\\'].includes(path[i - 1])) {
      array__segment_indices.push(i);
    }
  }

  start ??= 0;
  if (start < -1 * array__segment_indices.length) {
    start = 0;
  } else if (-1 * array__segment_indices.length <= start && start < 0) {
    start = start + array__segment_indices.length;
  }

  end ??= array__segment_indices.length;
  if (end < -1 * array__segment_indices.length) {
    end = 0;
  } else if (-1 * array__segment_indices.length <= end && end < 0) {
    end = end + array__segment_indices.length;
  } else if (end > array__segment_indices.length) {
    end = array__segment_indices.length;
  }

  if (start >= array__segment_indices.length) {
    return ''; // use empty array
  }
  if (end <= start) {
    return ''; // use empty array
  }

  const index__end = array__segment_indices.at(end);
  return path.slice(array__segment_indices.at(start), index__end ? index__end : undefined);
}

export function NodePlatform_Shell_Cursor_EraseCurrentLine(): void {
  process.stdout.write(`${SHELL__KEYS_CSI}2K`);
}

export function NodePlatform_Shell_Cursor_HideCursor(): void {
  process.stdout.write(`${SHELL__KEYS_CSI}?25l`);
  if (internal_shell_data.exit_trap_is_set === false) {
    internal_shell_setup_exit_trap_for_cursor();
  }
}

export function NodePlatform_Shell_Cursor_MoveCursorDown(count = 0, to_start = false): void {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}E`);
  }
  process.stdout.write(`${SHELL__KEYS_CSI}${count}B`);
}

export function NodePlatform_Shell_Cursor_MoveCursorLeft(count = 0): void {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}D`);
}

export function NodePlatform_Shell_Cursor_MoveCursorRight(count = 0): void {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}C`);
}

export function NodePlatform_Shell_Cursor_MoveCursorStart(): void {
  process.stdout.write('\r');
}

export function NodePlatform_Shell_Cursor_MoveCursorToColumn(count = 0): void {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}G`);
}

export function NodePlatform_Shell_Cursor_MoveCursorUp(count = 0, to_start = false): void {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}F`);
  }
  process.stdout.write(`${SHELL__KEYS_CSI}${count}A`);
}

export function NodePlatform_Shell_Cursor_ShowCursor(): void {
  process.stdout.write(`${SHELL__KEYS_CSI}?25h`);
}

export function NodePlatform_Shell_StdIn_AddListener(listener: (bytes: Uint8Array, text: string, removeSelf: () => boolean) => void | Promise<void>): void {
  SHELL__STDIN__LISTENERSET.add(listener);
}

export function NodePlatform_Shell_StdIn_LockReader(): () => void {
  const release = () => {
    SHELL__STDIN__READERLOCKS.delete(release);
    NodePlatform_Shell_StdIn_StopReader();
  };
  SHELL__STDIN__READERLOCKS.add(release);
  return release;
}

export function NodePlatform_Shell_StdIn_ReaderHandler(bytes: Uint8Array): void {
  const text = Core_Utility_DecodeBytes(bytes);
  for (const listener of SHELL__STDIN__LISTENERSET) {
    Core_Promise_Orphan(listener(bytes, text, () => SHELL__STDIN__LISTENERSET.delete(listener)));
  }
}

export function NodePlatform_Shell_StdIn_StartReader(): void {
  if (internal_shell_data.stdin_reader_enabled === true && internal_shell_data.stdin_raw_mode_enabled === true) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_data.stdin_reader_enabled === false) {
    process.stdin //
      .addListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
      .resume();
    internal_shell_data.stdin_reader_enabled = true;
    internal_shell_data.stdin_raw_mode_enabled = false;
  }
}

export function NodePlatform_Shell_StdIn_StartReaderInRawMode(): void {
  if (internal_shell_data.stdin_reader_enabled === true && internal_shell_data.stdin_raw_mode_enabled === false) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_data.stdin_reader_enabled === false) {
    process.stdin //
      .setRawMode(true)
      .addListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
      .resume();
    internal_shell_data.stdin_reader_enabled = true;
    internal_shell_data.stdin_raw_mode_enabled = true;
  }
}

export function NodePlatform_Shell_StdIn_StopReader(): void {
  if (SHELL__STDIN__READERLOCKS.size === 0) {
    if (internal_shell_data.stdin_reader_enabled === true) {
      process.stdin //
        .pause()
        .removeListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
        .setRawMode(false);
      internal_shell_data.stdin_reader_enabled = true;
      internal_shell_data.stdin_raw_mode_enabled = false;
    }
  }
}
