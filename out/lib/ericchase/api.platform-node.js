import { default as NODE_FS } from "node:fs";
import { default as NODE_PATH } from "node:path";
import { default as NODE_URL } from "node:url";
import { Core_Promise_Orphan, Core_Utility_DecodeBytes } from "./api.core.js";
import { PATH__RESOLVED_CWD, SHELL__KEYS, SHELL__KEYS_CSI, SHELL__STDIN__LISTENERSET, SHELL__STDIN__READERLOCKS, internal_error_call_async, internal_shell_data, internal_shell_setup_exit_trap_for_cursor } from "./platform-node.js";

export { NODE_FS, NODE_PATH, NODE_URL };
export const NodePlatform_Shell_Keys = SHELL__KEYS;
export async function NodePlatform_Directory_Async_Create(path, recursive = true) {
  try {
    if (PATH__RESOLVED_CWD !== NodePlatform_Path_Resolve(path)) {
      await internal_error_call_async(Error().stack, NODE_FS.promises.mkdir(NodePlatform_Path_Join(path), { recursive }));
    }
  } catch (error) {
    switch (error.code) {
      case "EEXIST":
        break;
      default:
        throw error;
    }
  }
  return (await NODE_FS.promises.stat(NodePlatform_Path_Join(path))).isDirectory();
}
export async function NodePlatform_Directory_Async_Delete(path, recursive = false) {
  try {
    if (recursive === false) {
      await internal_error_call_async(Error().stack, NODE_FS.promises.rmdir(NodePlatform_Path_Join(path)));
    } else {
      await internal_error_call_async(Error().stack, NODE_FS.promises.rm(NodePlatform_Path_Join(path), { recursive: true, force: true }));
    }
  } catch (error) {
    switch (error.code) {
      case "ENOENT":
      case "ENOTEMPTY":
        break;
      case "EFAULT":
        error.message += "\nPossible Causes: Directory not empty, set parameter `recursive` to `true`";
      default:
        throw error;
    }
  }
  return NODE_FS.existsSync(NodePlatform_Path_Join(path)) === false;
}
export async function NodePlatform_Directory_Async_ReadDir(path, recursive = true) {
  try {
    return await internal_error_call_async(Error().stack, NODE_FS.promises.readdir(NodePlatform_Path_Join(path), {
      recursive,
      withFileTypes: true
    }));
  } catch (error) {
    switch (error.code) {
      default:
        throw error;
    }
  }
}
export function NodePlatform_Directory_Watch(path, callback, recursive = true) {
  const watcher = NODE_FS.watch(NodePlatform_Path_Join(path), { persistent: true, recursive }, (event, filename) => {
    callback(event, filename ?? "");
  });
  return () => {
    watcher.close();
  };
}
export async function NodePlatform_File_Async_AppendBytes(path, bytes) {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), bytes));
}
export async function NodePlatform_File_Async_AppendText(path, text) {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.appendFile(NodePlatform_Path_Join(path), text));
}
export async function NodePlatform_File_Async_ReadBytes(path) {
  return Uint8Array.from(await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), {})));
}
export async function NodePlatform_File_Async_ReadText(path) {
  return await internal_error_call_async(Error().stack, NODE_FS.promises.readFile(NodePlatform_Path_Join(path), { encoding: "utf8" }));
}
export async function NodePlatform_File_Async_WriteBytes(path, bytes) {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.writeFile(NodePlatform_Path_Join(path), bytes));
}
export async function NodePlatform_File_Async_WriteText(path, text) {
  await internal_error_call_async(Error().stack, NodePlatform_Directory_Async_Create(NodePlatform_Path_GetDirName(path)));
  return await internal_error_call_async(Error().stack, NODE_FS.promises.writeFile(NodePlatform_Path_Join(path), text));
}
export async function NodePlatform_Path_Async_GetStats(path) {
  return await internal_error_call_async(Error().stack, NODE_FS.promises.stat(NodePlatform_Path_Join(path)));
}
export async function NodePlatform_Path_Async_IsDirectory(path) {
  return (await NodePlatform_Path_Async_GetStats(path)).isDirectory();
}
export async function NodePlatform_Path_Async_IsFile(path) {
  return (await NodePlatform_Path_Async_GetStats(path)).isFile();
}
export async function NodePlatform_Path_Async_IsSymbolicLink(path) {
  return (await NodePlatform_Path_Async_GetStats(path)).isSymbolicLink();
}
export function NodePlatform_Path_CountSegments(path) {
  if (path.length === 0) {
    return 0;
  }
  let count__segments = 1;
  for (let i = 1;i < path.length; i++) {
    if (["/", "\\"].includes(path[i - 1])) {
      ++count__segments;
    }
  }
  return count__segments;
}
export function NodePlatform_Path_GetBaseName(path) {
  const rightmost_segment = NodePlatform_Path_Slice(path, -1);
  if (rightmost_segment.length > 1) {
    const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
    if (["/", "\\"].includes(rightmost_character)) {
      return rightmost_segment.slice(0, -1);
    }
  }
  return rightmost_segment;
}
export function NodePlatform_Path_GetDirName(path) {
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return "." + NODE_PATH.sep;
  }
  if (segment_count === 1) {
    if (["/", "\\"].includes(path)) {
      return path;
    }
    if (path.endsWith(":")) {
      return path;
    }
    const rightmost_character = path[path.length - 1];
    if (["/", "\\"].includes(rightmost_character)) {
      return "." + rightmost_character;
    }
    return "." + NODE_PATH.sep;
  }
  return NodePlatform_Path_Slice(path, 0, -1);
}
export function NodePlatform_Path_GetExtension(path) {
  const basename = NodePlatform_Path_GetBaseName(path);
  if ([".", ".."].includes(basename)) {
    return "";
  }
  const index__rightmost_dot = basename.lastIndexOf(".");
  if (index__rightmost_dot === -1) {
    return "";
  }
  return basename.slice(index__rightmost_dot);
}
export function NodePlatform_Path_GetName(path) {
  const basename = NodePlatform_Path_GetBaseName(path);
  if ([".", ".."].includes(basename)) {
    return basename;
  }
  const index__rightmost_dot = basename.lastIndexOf(".");
  if (index__rightmost_dot === -1) {
    return basename;
  }
  return basename.slice(0, index__rightmost_dot);
}
export function NodePlatform_Path_GetSegments(path) {
  if (path.length === 0) {
    return [];
  }
  const array__segments = [];
  let index__start = 0;
  for (let i = 1;i < path.length; i++) {
    if (["/", "\\"].includes(path[i - 1])) {
      array__segments.push(path.slice(index__start, i));
      index__start = i;
    }
  }
  array__segments.push(path.slice(index__start));
  for (let i = 0;i < array__segments.length; i++) {
    if (array__segments[i].length > 1) {
      if (["/", "\\"].includes(array__segments[i][array__segments[i].length - 1])) {
        array__segments[i] = array__segments[i].slice(0, -1);
      }
    }
  }
  return array__segments;
}
export function NodePlatform_Path_Join(...paths) {
  return (paths[0] === "." ? "." + NODE_PATH.sep : "") + NODE_PATH.join(...paths);
}
export function NodePlatform_Path_JoinStandard(...paths) {
  return (paths[0] === "." ? "./" : "") + NODE_PATH.join(...paths).replaceAll("\\", "/");
}
export function NodePlatform_Path_ReplaceBaseName(path, value) {
  const segment_count = NodePlatform_Path_CountSegments(path);
  if (segment_count === 0) {
    return value;
  }
  if (segment_count === 1) {
    if (["/", "\\"].includes(path)) {
      return value;
    }
    if (path.endsWith(":")) {
      return value;
    }
    const rightmost_character = path[path.length - 1];
    if (["/", "\\"].includes(rightmost_character)) {
      return value + rightmost_character;
    }
    return value;
  }
  let rightmost_segment = NodePlatform_Path_Slice(path, -1);
  const rightmost_character = rightmost_segment[rightmost_segment.length - 1];
  if (["/", "\\"].includes(rightmost_character)) {
    return NodePlatform_Path_Slice(path, 0, -1) + value + rightmost_character;
  }
  return NodePlatform_Path_Slice(path, 0, -1) + value;
}
export function NodePlatform_Path_ReplaceExtension(path, value) {
  if (value[0] !== ".") {
    value = "." + value;
  }
  const name = NodePlatform_Path_GetName(path);
  if (["/", "\\"].includes(name)) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  if (name.endsWith(":")) {
    return NodePlatform_Path_ReplaceBaseName(path, value);
  }
  return NodePlatform_Path_ReplaceBaseName(path, name + value);
}
export function NodePlatform_Path_ReplaceName(path, value) {
  return NodePlatform_Path_ReplaceBaseName(path, value + NodePlatform_Path_GetExtension(path));
}
export function NodePlatform_Path_Resolve(...paths) {
  return NODE_PATH.resolve(...paths);
}
export function NodePlatform_Path_ResolveStandard(...paths) {
  return NODE_PATH.resolve(...paths).replaceAll("\\", "/");
}
export function NodePlatform_Path_Slice(path, start, end) {
  const array__segment_indices = [0];
  for (let i = 1;i < path.length; i++) {
    if (["/", "\\"].includes(path[i - 1])) {
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
    return "";
  }
  if (end <= start) {
    return "";
  }
  const index__end = array__segment_indices.at(end);
  return path.slice(array__segment_indices.at(start), index__end ? index__end : undefined);
}
export function NodePlatform_Shell_Cursor_EraseCurrentLine() {
  process.stdout.write(`${SHELL__KEYS_CSI}2K`);
}
export function NodePlatform_Shell_Cursor_HideCursor() {
  process.stdout.write(`${SHELL__KEYS_CSI}?25l`);
  if (internal_shell_data.exit_trap_is_set === false) {
    internal_shell_setup_exit_trap_for_cursor();
  }
}
export function NodePlatform_Shell_Cursor_MoveCursorDown(count = 0, to_start = false) {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}E`);
  }
  process.stdout.write(`${SHELL__KEYS_CSI}${count}B`);
}
export function NodePlatform_Shell_Cursor_MoveCursorLeft(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}D`);
}
export function NodePlatform_Shell_Cursor_MoveCursorRight(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}C`);
}
export function NodePlatform_Shell_Cursor_MoveCursorStart() {
  process.stdout.write("\r");
}
export function NodePlatform_Shell_Cursor_MoveCursorToColumn(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}G`);
}
export function NodePlatform_Shell_Cursor_MoveCursorUp(count = 0, to_start = false) {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}F`);
  }
  process.stdout.write(`${SHELL__KEYS_CSI}${count}A`);
}
export function NodePlatform_Shell_Cursor_ShowCursor() {
  process.stdout.write(`${SHELL__KEYS_CSI}?25h`);
}
export function NodePlatform_Shell_StdIn_AddListener(listener) {
  SHELL__STDIN__LISTENERSET.add(listener);
}
export function NodePlatform_Shell_StdIn_LockReader() {
  const release = () => {
    SHELL__STDIN__READERLOCKS.delete(release);
    NodePlatform_Shell_StdIn_StopReader();
  };
  SHELL__STDIN__READERLOCKS.add(release);
  return release;
}
export function NodePlatform_Shell_StdIn_ReaderHandler(bytes) {
  const text = Core_Utility_DecodeBytes(bytes);
  for (const listener of SHELL__STDIN__LISTENERSET) {
    Core_Promise_Orphan(listener(bytes, text, () => SHELL__STDIN__LISTENERSET.delete(listener)));
  }
}
export function NodePlatform_Shell_StdIn_StartReader() {
  if (internal_shell_data.stdin_reader_enabled === true && internal_shell_data.stdin_raw_mode_enabled === true) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_data.stdin_reader_enabled === false) {
    process.stdin.addListener("data", NodePlatform_Shell_StdIn_ReaderHandler).resume();
    internal_shell_data.stdin_reader_enabled = true;
    internal_shell_data.stdin_raw_mode_enabled = false;
  }
}
export function NodePlatform_Shell_StdIn_StartReaderInRawMode() {
  if (internal_shell_data.stdin_reader_enabled === true && internal_shell_data.stdin_raw_mode_enabled === false) {
    NodePlatform_Shell_StdIn_StopReader();
  }
  if (internal_shell_data.stdin_reader_enabled === false) {
    process.stdin.setRawMode(true).addListener("data", NodePlatform_Shell_StdIn_ReaderHandler).resume();
    internal_shell_data.stdin_reader_enabled = true;
    internal_shell_data.stdin_raw_mode_enabled = true;
  }
}
export function NodePlatform_Shell_StdIn_StopReader() {
  if (SHELL__STDIN__READERLOCKS.size === 0) {
    if (internal_shell_data.stdin_reader_enabled === true) {
      process.stdin.pause().removeListener("data", NodePlatform_Shell_StdIn_ReaderHandler).setRawMode(false);
      internal_shell_data.stdin_reader_enabled = true;
      internal_shell_data.stdin_raw_mode_enabled = false;
    }
  }
}
