import { default as NODE_FS } from "node:fs";
import { default as NODE_PATH } from "node:path";
import { default as NODE_URL } from "node:url";
import { Core } from "./core.js";

export { NODE_FS, NODE_PATH, NODE_URL };
const PATH__RESOLVE_CACHE = new Map;
const PATH__RESOLVED_CWD = path__join(process.cwd());
const SHELL__GENERALASCIICODES = shell__createasciicodemap(String.raw`
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
    DOWN: Core.JSON.ParseRawString(String.raw`\u001B[B`),
    LEFT: Core.JSON.ParseRawString(String.raw`\u001B[D`),
    RIGHT: Core.JSON.ParseRawString(String.raw`\u001B[C`),
    UP: Core.JSON.ParseRawString(String.raw`\u001B[A`)
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
    VT: SHELL__GENERALASCIICODES.VT
  },
  SIGINT: Core.JSON.ParseRawString(String.raw`\u0003`)
};
const SHELL__STDIN__LISTENERSET = new Set;
const SHELL__STDIN__READERLOCKS = new Set;
let shell__exittrapisset = false;
let shell__stdin__rawmodeenabled = false;
let shell__stdin__readerenabled = false;
function error__cleanstack(stack = "") {
  const lines = Core.String.SplitLines(stack ?? "");
  if (lines[0].trim() === "Error") {
    lines[0] = "Fixed Call Stack:";
  }
  return lines.join(`
`);
}
async function error__callasync(stack, promise) {
  try {
    return await promise;
  } catch (async_error) {
    if (typeof async_error === "object") {
      const error = new Error(`${async_error.message}
${error__cleanstack(stack ?? "")}`);
      for (const key in async_error) {
        Object.defineProperty(error, key, { value: async_error[key] });
      }
      throw error;
    }
    throw new Error(`${async_error}
${error__cleanstack(stack ?? "")}`);
  }
}
function shell__createasciicodemap(table) {
  const map = {};
  for (const [name, code] of Core.Array.Split(Core.String.Split(table.trim(), "|", true), 3)) {
    map[name.trim()] = Core.JSON.ParseRawString(Core.String.SplitMultipleSpaces(code, true)[0]);
  }
  return map;
}
function shell__listeneruncaughtexception(error, origin) {
  shell__cursor__showcursor();
  if (process.listeners("uncaughtException").length === 1) {
    Core.Console.Error("Uncaught exception:", error);
    process.exit();
  }
}
function shell__setupexittrapforcursor() {
  shell__exittrapisset = true;
  process.on("exit", shell__cursor__showcursor);
  process.on("SIGINT", shell__cursor__showcursor);
  process.on("uncaughtException", () => shell__listeneruncaughtexception);
}
async function directory__async_create(path, recursive = true) {
  try {
    if (PATH__RESOLVED_CWD !== path__join(path)) {
      await error__callasync(Error().stack, NODE_FS.promises.mkdir(path__join(path), { recursive }));
    }
  } catch (error) {
    switch (error.code) {
      case "EEXIST":
        break;
      default:
        throw error;
    }
  }
  return (await NODE_FS.promises.stat(path__join(path))).isDirectory();
}
async function directory__async_delete(path, recursive = false) {
  try {
    if (recursive === false) {
      await error__callasync(Error().stack, NODE_FS.promises.rmdir(path__join(path)));
    } else {
      await error__callasync(Error().stack, NODE_FS.promises.rm(path__join(path), { recursive: true, force: true }));
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
  return NODE_FS.existsSync(path__join(path)) === false;
}
async function directory__async_readdir(path, recursive = true) {
  try {
    return await error__callasync(Error().stack, NODE_FS.promises.readdir(path__join(path), {
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
function directory__watch(path, callback, recursive = true) {
  const watcher = NODE_FS.watch(path__join(path), { persistent: true, recursive }, (event, filename) => {
    callback(event, filename ?? "");
  });
  return () => {
    watcher.close();
  };
}
async function file__async_appendbytes(path, bytes) {
  await error__callasync(Error().stack, directory__async_create(path__getparentpath(path)));
  return await error__callasync(Error().stack, NODE_FS.promises.appendFile(path__join(path), bytes));
}
async function file__async_appendtext(path, text) {
  await error__callasync(Error().stack, directory__async_create(path__getparentpath(path)));
  return await error__callasync(Error().stack, NODE_FS.promises.appendFile(path__join(path), text));
}
async function file__async_readbytes(path) {
  return Uint8Array.from(await error__callasync(Error().stack, NODE_FS.promises.readFile(path__join(path), {})));
}
async function file__async_readtext(path) {
  return await error__callasync(Error().stack, NODE_FS.promises.readFile(path__join(path), { encoding: "utf8" }));
}
async function file__async_writebytes(path, bytes) {
  await error__callasync(Error().stack, directory__async_create(path__getparentpath(path)));
  return await error__callasync(Error().stack, NODE_FS.promises.writeFile(path__join(path), bytes));
}
async function file__async_writetext(path, text) {
  await error__callasync(Error().stack, directory__async_create(path__getparentpath(path)));
  return await error__callasync(Error().stack, NODE_FS.promises.writeFile(path__join(path), text));
}
async function path__async_getstats(path) {
  return await error__callasync(Error().stack, NODE_FS.promises.stat(path__join(path)));
}
async function path__async_isdirectory(path) {
  return (await path__async_getstats(path)).isDirectory();
}
async function path__async_isfile(path) {
  return (await path__async_getstats(path)).isFile();
}
async function path__async_issymboliclink(path) {
  return (await path__async_getstats(path)).isSymbolicLink();
}
function path__getbasename(path) {
  return path__slice(path, -1);
}
function path__getextension(path) {
  const basename = path__getbasename(path);
  return basename.indexOf(".") > 0 ? basename.slice(basename.lastIndexOf(".")) : "";
}
function path__getname(path) {
  const basename = path__getbasename(path);
  return basename.indexOf(".") > 0 ? basename.slice(0, basename.lastIndexOf(".")) : basename;
}
function path__getparentpath(path) {
  return path__slice(path, 0, -1);
}
function path__newbasename(path, value) {
  const segments = path__join(path).split(/[\\\/]/).filter(({ length }) => length > 0);
  if (segments.length > 0) {
    segments[segments.length - 1] = value;
  } else {
    segments[0] = value;
  }
  return segments.join(NODE_PATH.sep);
}
function path__newextension(path, value) {
  const name = path__getname(path);
  if (value[0] !== ".") {
    return path__newbasename(path, `${name}.${value}`);
  } else {
    return path__newbasename(path, name + value);
  }
}
function path__newname(path, value) {
  return path__newbasename(path, value + path__getextension(path));
}
function path__join(...paths) {
  return NODE_PATH.join(...paths);
}
function path__joinstandard(...paths) {
  return NODE_PATH.join(...paths).replaceAll("\\", "/");
}
function path__resolve(...paths) {
  return NODE_PATH.resolve(...paths);
}
function path__resolvestandard(...paths) {
  return NODE_PATH.resolve(...paths).replaceAll("\\", "/");
}
function path__slice(path, begin, end) {
  const segments = path__join(path).split(/[\\\/]/).filter(({ length }) => length > 0);
  return segments.slice(begin, end).join(NODE_PATH.sep);
}
function path__slicestandard(path, begin, end) {
  const segments = path__join(path).split(/[\\\/]/).filter(({ length }) => length > 0);
  return segments.slice(begin, end).join("/");
}
function shell__cursor__erasecurrentline() {
  process.stdout.write(`${SHELL__KEYS_CSI}2K`);
}
function shell__cursor__hidecursor() {
  process.stdout.write(`${SHELL__KEYS_CSI}?25l`);
  if (shell__exittrapisset === false) {
    shell__setupexittrapforcursor();
  }
}
function shell__cursor__movecursordown(count = 0, to_start = false) {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}E`);
  } else {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}B`);
  }
}
function shell__cursor__movecursorleft(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}D`);
}
function shell__cursor__movecursorright(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}C`);
}
function shell__cursor__movecursorstart() {
  process.stdout.write("\r");
}
function shell__cursor__movecursortocolumn(count = 0) {
  process.stdout.write(`${SHELL__KEYS_CSI}${count}G`);
}
function shell__cursor__movecursorup(count = 0, to_start = false) {
  if (to_start === true) {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}F`);
  } else {
    process.stdout.write(`${SHELL__KEYS_CSI}${count}A`);
  }
}
function shell__cursor__showcursor() {
  process.stdout.write(`${SHELL__KEYS_CSI}?25h`);
}
function shell__stdin__addlistener(listener) {
  SHELL__STDIN__LISTENERSET.add(listener);
}
function shell__stdin__lockreader() {
  const release = () => {
    SHELL__STDIN__READERLOCKS.delete(release);
    shell__stdin__stopreader();
  };
  SHELL__STDIN__READERLOCKS.add(release);
  return release;
}
function shell__stdin__readerhandler(bytes) {
  const text = Core.Utility.DecodeBytes(bytes);
  for (const listener of SHELL__STDIN__LISTENERSET) {
    Core.Promise.Orphan(listener(bytes, text, () => SHELL__STDIN__LISTENERSET.delete(listener)));
  }
}
function shell__stdin__startreader() {
  if (shell__stdin__readerenabled === true && shell__stdin__rawmodeenabled === true) {
    shell__stdin__stopreader();
  }
  if (shell__stdin__readerenabled === false) {
    process.stdin.addListener("data", shell__stdin__readerhandler).resume();
    shell__stdin__readerenabled = true;
    shell__stdin__rawmodeenabled = false;
  }
}
function shell__stdin__startreaderinrawmode() {
  if (shell__stdin__readerenabled === true && shell__stdin__rawmodeenabled === false) {
    shell__stdin__stopreader();
  }
  if (shell__stdin__readerenabled === false) {
    process.stdin.setRawMode(true).addListener("data", shell__stdin__readerhandler).resume();
    shell__stdin__readerenabled = true;
    shell__stdin__rawmodeenabled = true;
  }
}
function shell__stdin__stopreader() {
  if (SHELL__STDIN__READERLOCKS.size === 0) {
    if (shell__stdin__readerenabled === true) {
      process.stdin.pause().removeListener("data", shell__stdin__readerhandler).setRawMode(false);
      shell__stdin__readerenabled = true;
      shell__stdin__rawmodeenabled = false;
    }
  }
}
export var NodePlatform;
((NodePlatform) => {
  let Directory;
  ((Directory) => {
    Directory.Async_Create = directory__async_create;
    Directory.Async_Delete = directory__async_delete;
    Directory.Async_ReadDir = directory__async_readdir;
    Directory.Watch = directory__watch;
  })(Directory = NodePlatform.Directory ||= {});
  let File;
  ((File) => {
    File.Async_AppendBytes = file__async_appendbytes;
    File.Async_AppendText = file__async_appendtext;
    File.Async_ReadBytes = file__async_readbytes;
    File.Async_ReadText = file__async_readtext;
    File.Async_WriteBytes = file__async_writebytes;
    File.Async_WriteText = file__async_writetext;
  })(File = NodePlatform.File ||= {});
  let Path;
  ((Path) => {
    Path.Async_GetStats = path__async_getstats;
    Path.Async_IsDirectory = path__async_isdirectory;
    Path.Async_IsFile = path__async_isfile;
    Path.Async_IsSymbolicLink = path__async_issymboliclink;
    Path.GetBaseName = path__getbasename;
    Path.GetExtension = path__getextension;
    Path.GetName = path__getname;
    Path.GetParentPath = path__getparentpath;
    Path.NewBaseName = path__newbasename;
    Path.NewExtension = path__newextension;
    Path.NewName = path__newname;
    Path.Join = path__join;
    Path.JoinStandard = path__joinstandard;
    Path.Resolve = path__resolve;
    Path.ResolveStandard = path__resolvestandard;
    Path.Slice = path__slice;
    Path.SliceStandard = path__slicestandard;
  })(Path = NodePlatform.Path ||= {});
  let Shell;
  ((Shell) => {
    let Cursor;
    ((Cursor) => {
      Cursor.EraseCurrentLine = shell__cursor__erasecurrentline;
      Cursor.HideCursor = shell__cursor__hidecursor;
      Cursor.MoveCursorDown = shell__cursor__movecursordown;
      Cursor.MoveCursorLeft = shell__cursor__movecursorleft;
      Cursor.MoveCursorRight = shell__cursor__movecursorright;
      Cursor.MoveCursorStart = shell__cursor__movecursorstart;
      Cursor.MoveCursorToColumn = shell__cursor__movecursortocolumn;
      Cursor.MoveCursorUp = shell__cursor__movecursorup;
      Cursor.ShowCursor = shell__cursor__showcursor;
    })(Cursor = Shell.Cursor ||= {});
    Shell.KEYS = SHELL__KEYS;
    let StdIn;
    ((StdIn) => {
      StdIn.AddListener = shell__stdin__addlistener;
      StdIn.LockReader = shell__stdin__lockreader;
      StdIn.StartReader = shell__stdin__startreader;
      StdIn.StartReaderInRawMode = shell__stdin__startreaderinrawmode;
      StdIn.StopReader = shell__stdin__stopreader;
    })(StdIn = Shell.StdIn ||= {});
  })(Shell = NodePlatform.Shell ||= {});
})(NodePlatform ||= {});
