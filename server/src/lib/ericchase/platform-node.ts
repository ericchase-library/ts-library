import { default as NODE_FS } from 'node:fs';
import { default as NODE_PATH } from 'node:path';
import { default as NODE_URL } from 'node:url';
import { Core_Array_Split, Core_Console_Error, Core_JSON_ParseRawString, Core_Promise_Orphan, Core_String_Split, Core_String_SplitLines, Core_String_SplitMultipleSpaces, Core_Utility_DecodeBytes } from './core.js';

export { NODE_FS, NODE_PATH, NODE_URL };

const PATH__RESOLVE_CACHE = new Map<string, string>();
const PATH__RESOLVED_CWD = NodePlatform_Path_Join(process.cwd());

/**
 * The Core_JSON_ParseRawString(String.raw``)s are to keep bundlers (i.e Bun)
 * from replacing the unicode code points with an alternative representation.
 */
const SHELL__GENERALASCIICODES = internal_shell_create_ascii_code_map(String.raw`
| BEL | \u0007 | Terminal bell
| BS  | \u0008 | Backspace
| HT  | \u0009 | Horizontal TAB
| LF  | \u000A | Linefeed (newline)
| VT  | \u000B | Vertical TAB
| FF  | \u000C | Formfeed (also: New page NP)
| CR  | \u000D | Carriage return
| ESC | \u001B | Escape character
| DEL | \u007F | Delete character
`);
const SHELL__KEYS_ESC = SHELL__GENERALASCIICODES.ESC;
const SHELL__KEYS_CSI = `${SHELL__KEYS_ESC}[`;
const SHELL__KEYS_DCS = `${SHELL__KEYS_ESC}P`;
const SHELL__KEYS_OSC = `${SHELL__KEYS_ESC}]`;

const SHELL__KEYS = {
  ARROWS: {
    DOWN: Core_JSON_ParseRawString(String.raw`\u001B[B`),
    LEFT: Core_JSON_ParseRawString(String.raw`\u001B[D`),
    RIGHT: Core_JSON_ParseRawString(String.raw`\u001B[C`),
    UP: Core_JSON_ParseRawString(String.raw`\u001B[A`),
  },
  GENERAL: {
    BEL: SHELL__GENERALASCIICODES.BEL,
    BS: SHELL__GENERALASCIICODES.BS,
    CR: SHELL__GENERALASCIICODES.CR,
    CSI: SHELL__KEYS_CSI,
    DCS: SHELL__KEYS_DCS,
    DEL: SHELL__GENERALASCIICODES.DEL,
    ESC: SHELL__KEYS_ESC,
    FF: SHELL__GENERALASCIICODES.FF,
    HT: SHELL__GENERALASCIICODES.HT,
    LF: SHELL__GENERALASCIICODES.LF,
    OSC: SHELL__KEYS_OSC,
    VT: SHELL__GENERALASCIICODES.VT,
  },
  SIGINT: Core_JSON_ParseRawString(String.raw`\u0003`), // Kill the currently running task in terminal.
};

/**
 * Gotchas:
 * If the stdin stream is switched to utf8 mode, it cannot be switched back to byte
 * mode (need to verify again). Instead, leave it in byte mode, and decode the bytes.
 */
const SHELL__STDIN__LISTENERSET = new Set<(bytes: Uint8Array, text: string, removeSelf: () => boolean) => void | Promise<void>>();
const SHELL__STDIN__READERLOCKS = new Set<() => void>();

let internal_shell_exit_trap_is_set = false;
let internal_shell_stdin_raw_mode_enabled = false;
let internal_shell_stdin_reader_enabled = false;

function internal_error_clean_call_stack(stack = ''): string {
  const lines = Core_String_SplitLines(stack ?? '');
  if (lines[0].trim() === 'Error') {
    lines[0] = 'Fixed Call Stack:';
  }
  return lines.join('\n');
}

async function internal_error_call_async<T>(stack: string | undefined, promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (async_error: any) {
    if (typeof async_error === 'object') {
      const error = new Error(`${async_error.message}\n${internal_error_clean_call_stack(stack ?? '')}`);
      for (const key in async_error) {
        Object.defineProperty(error, key, { value: async_error[key] });
      }
      throw error;
    }
    throw new Error(`${async_error}\n${internal_error_clean_call_stack(stack ?? '')}`);
  }
}

function internal_shell_create_ascii_code_map(table: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [name, code] of Core_Array_Split(Core_String_Split(table.trim(), '|', true), 3)) {
    map[name.trim()] = Core_JSON_ParseRawString(Core_String_SplitMultipleSpaces(code, true)[0]);
  }
  return map;
}

function internal_shell_listen_for_uncaught_exception(error: Error, origin: NodeJS.UncaughtExceptionOrigin): void {
  NodePlatform_Shell_Cursor_ShowCursor();
  if (process.listeners('uncaughtException').length === 1) {
    Core_Console_Error('Uncaught exception:', error);
    process.exit();
  }
}

function internal_shell_setup_exit_trap_for_cursor(): void {
  internal_shell_exit_trap_is_set = true;
  process.on('exit', NodePlatform_Shell_Cursor_ShowCursor);
  process.on('SIGINT', NodePlatform_Shell_Cursor_ShowCursor);
  process.on('uncaughtException', () => internal_shell_listen_for_uncaught_exception);
}

// Exports

export const NodePlatform_Shell_Keys = SHELL__KEYS;

export type WatchCallback = (event: 'rename' | 'change', path: string) => void;

export async function NodePlatform_Directory_Async_Create(path: string, recursive = true): Promise<boolean> {
  try {
    if (PATH__RESOLVED_CWD !== NodePlatform_Path_Join(path)) {
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
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), bytes));
}

export async function NodePlatform_File_Async_AppendText(path: string, text: string): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), text));
}

export async function NodePlatform_File_Async_ReadBytes(path: string): Promise<Uint8Array<ArrayBuffer>> {
  return Uint8Array.from(await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), {})));
}

export async function NodePlatform_File_Async_ReadText(path: string): Promise<string> {
  return await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), { encoding: 'utf8' }));
}

export async function NodePlatform_File_Async_WriteBytes(path: string, bytes: Uint8Array): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.writeFile(NodePlatform_Path_Join(path), bytes));
}

export async function NodePlatform_File_Async_WriteText(path: string, text: string): Promise<void> {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(path)));
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

export function NodePlatform_Path_GetBaseName(path: string): string {
  /**
   * Gets the rightmost segment of the path.
   */
  return NodePlatform_Path_Slice(path, -1);
}

export function NodePlatform_Path_GetExtension(path: string): string {
  /**
   * Gets all characters in the basename that appear right of the final dot,
   * including the dot. If the basename starts with a dot and has no other
   * dots, returns empty string. If the basename has no dots, returns empty
   * string.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  return basename.indexOf('.') > 0 //
    ? basename.slice(basename.lastIndexOf('.'))
    : '';
}

export function NodePlatform_Path_GetName(path: string): string {
  /**
   * Gets all characters in the basename that appear left of the final dot,
   * excluding the dot. If the basename starts with a dot and has no other
   * dots, returns the entire segment.
   */
  const basename = NodePlatform_Path_GetBaseName(path);
  return basename.indexOf('.') > 0 //
    ? basename.slice(0, basename.lastIndexOf('.'))
    : basename;
}

export function NodePlatform_Path_GetParentPath(path: string): string {
  /**
   * Gets the path excluding the rightmost segment.
   */
  return NodePlatform_Path_Slice(path, 0, -1);
}

export function NodePlatform_Path_Join(...paths: string[]): string {
  return NODE_PATH.join(...paths);
}

export function NodePlatform_Path_JoinStandard(...paths: string[]): string {
  return NODE_PATH.join(...paths).replaceAll('\\', '/');
}

export function NodePlatform_Path_NewBaseName(path: string, value: string): string {
  /**
   * Returns a new path string with the rightmost segment of the path st to
   * value.
   */
  const segments = NodePlatform_Path_Join(path)
    .split(/[\\\/]/)
    .filter(({ length }) => length > 0);
  if (segments.length > 0) {
    segments[segments.length - 1] = value;
  } else {
    segments[0] = value;
  }
  return segments.join(NODE_PATH.sep);
}

export function NodePlatform_Path_NewExtension(path: string, value: string): string {
  /**
   * Returns a new path string with all characters in the basename that
   * appear right of the final dot set to `value`.
   */
  const name = NodePlatform_Path_GetName(path);
  if (value[0] !== '.') {
    return NodePlatform_Path_NewBaseName(path, `${name}.${value}`);
  } else {
    return NodePlatform_Path_NewBaseName(path, name + value);
  }
}

export function NodePlatform_Path_NewName(path: string, value: string): string {
  /**
   * Returns a new path string with all characters in the basename that
   * appear left of the final dot set to `value`.
   */
  return NodePlatform_Path_NewBaseName(path, value + NodePlatform_Path_GetExtension(path));
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

export function NodePlatform_Path_Slice(path: string, begin: number, end?: number): string {
  const segments = NodePlatform_Path_Join(path)
    .split(/[\\\/]/)
    .filter(({ length }) => length > 0);
  return segments.slice(begin, end).join(NODE_PATH.sep);
}

export function NodePlatform_Path_SliceStandard(path: string, begin: number, end?: number): string {
  const segments = NodePlatform_Path_Join(path)
    .split(/[\\\/]/)
    .filter(({ length }) => length > 0);
  return segments.slice(begin, end).join('/');
}

export function NodePlatform_Shell_Cursor_EraseCurrentLine(): void {
  process.stdout.write(`${SHELL__KEYS_CSI}2K`);
}

export function NodePlatform_Shell_Cursor_HideCursor(): void {
  process.stdout.write(`${SHELL__KEYS_CSI}?25l`);
  if (internal_shell_exit_trap_is_set === false) {
    internal_shell_setup_exit_trap_for_cursor();
  }
}

export function NodePlatform_Shell_Cursor_MoveCursorDown(count = 0, to_start = false): void {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}E`);
  } else {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}B`);
  }
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
  } else {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}A`);
  }
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
  if (internal_shell_stdin_reader_enabled === true && internal_shell_stdin_raw_mode_enabled === true) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_stdin_reader_enabled === false) {
    process.stdin //
      .addListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
      .resume();
    internal_shell_stdin_reader_enabled = true;
    internal_shell_stdin_raw_mode_enabled = false;
  }
}

export function NodePlatform_Shell_StdIn_StartReaderInRawMode(): void {
  if (internal_shell_stdin_reader_enabled === true && internal_shell_stdin_raw_mode_enabled === false) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_stdin_reader_enabled === false) {
    process.stdin //
      .setRawMode(true)
      .addListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
      .resume();
    internal_shell_stdin_reader_enabled = true;
    internal_shell_stdin_raw_mode_enabled = true;
  }
}

export function NodePlatform_Shell_StdIn_StopReader(): void {
  if (SHELL__STDIN__READERLOCKS.size === 0) {
    if (internal_shell_stdin_reader_enabled === true) {
      process.stdin //
        .pause()
        .removeListener('data', NodePlatform_Shell_StdIn_ReaderHandler)
        .setRawMode(false);
      internal_shell_stdin_reader_enabled = true;
      internal_shell_stdin_raw_mode_enabled = false;
    }
  }
}
