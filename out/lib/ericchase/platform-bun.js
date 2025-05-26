import { Core } from "./core.js";
import { NodePlatform } from "./platform-node.js";
function args__has(arg) {
  return Bun.argv.includes(arg);
}
function file__async_compare(frompath, topath) {
  return Core.Stream.Uint8.Async_Compare(Bun.file(NodePlatform.Path.Join(frompath)).stream(), Bun.file(NodePlatform.Path.Join(topath)).stream());
}
async function file__async_copy(frompath, topath, overwrite = false) {
  if (NodePlatform.Path.Join(frompath) === NodePlatform.Path.Join(topath)) {
    return false;
  }
  if (overwrite !== true && await Bun.file(NodePlatform.Path.Join(topath)).exists() === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform.Path.Join(topath)), Bun.file(NodePlatform.Path.Join(frompath)));
  return file__async_compare(NodePlatform.Path.Join(frompath), NodePlatform.Path.Join(topath));
}
async function file__async_delete(path) {
  await Bun.file(NodePlatform.Path.Join(path)).delete();
  return await Bun.file(NodePlatform.Path.Join(path)).exists() === false;
}
async function file__async_move(frompath, topath, overwrite = false) {
  if (NodePlatform.Path.Join(frompath) === NodePlatform.Path.Join(topath)) {
    return false;
  }
  if (overwrite !== true && await Bun.file(NodePlatform.Path.Join(topath)).exists() === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform.Path.Join(topath)), Bun.file(NodePlatform.Path.Join(frompath)));
  if (await file__async_compare(NodePlatform.Path.Join(frompath), NodePlatform.Path.Join(topath)) === false) {
    return false;
  }
  return file__async_delete(NodePlatform.Path.Join(frompath));
}
function file__async_readbytes(path) {
  return Bun.file(NodePlatform.Path.Join(path)).bytes();
}
function file__async_readtext(path) {
  return Bun.file(NodePlatform.Path.Join(path)).text();
}
async function file__async_writebytes(path, bytes, createpath = true) {
  if (createpath === true) {
    await NodePlatform.Directory.Async_Create(NodePlatform.Path.GetParentPath(NodePlatform.Path.Join(path)));
  }
  return Bun.write(NodePlatform.Path.Join(path), bytes);
}
async function file__async_writetext(path, text, createpath = true) {
  if (createpath === true) {
    await NodePlatform.Directory.Async_Create(NodePlatform.Path.GetParentPath(NodePlatform.Path.Join(path)));
  }
  return Bun.write(NodePlatform.Path.Join(path), text);
}
async function* glob__asyncgen_scan(path, pattern, options) {
  for await (const value of new Bun.Glob(pattern).scan({
    absolute: options?.absolutepaths ?? false,
    cwd: NodePlatform.Path.Join(path),
    dot: true,
    onlyFiles: options?.onlyfiles ?? true
  })) {
    yield value;
  }
}
async function glob__ex__async_scan(path, include_patterns, exclude_patterns, options) {
  const included = [];
  for (const pattern of include_patterns) {
    included.push(...await Array.fromAsync(glob__asyncgen_scan(path, pattern, options)));
  }
  const excluded = [];
  for (const pattern of exclude_patterns) {
    excluded.push(...await Array.fromAsync(glob__asyncgen_scan(path, pattern, options)));
  }
  return new Set(included).difference(new Set(excluded));
}
function glob__match(query, pattern) {
  return new Bun.Glob(pattern).match(query);
}
function glob__ex__match(query, include_patterns, exclude_patterns) {
  let matched = false;
  for (const pattern of include_patterns) {
    if (glob__match(query, pattern) === true) {
      matched = true;
      break;
    }
  }
  for (const pattern of exclude_patterns) {
    if (glob__match(query, pattern) === true) {
      matched = false;
      break;
    }
  }
  return matched;
}
export var BunPlatform;
((BunPlatform) => {
  let Args;
  ((Args) => {
    Args.Has = args__has;
  })(Args = BunPlatform.Args ||= {});
  let File;
  ((File) => {
    File.Async_Compare = file__async_compare;
    File.Async_Copy = file__async_copy;
    File.Async_Delete = file__async_delete;
    File.Async_Move = file__async_move;
    File.Async_ReadBytes = file__async_readbytes;
    File.Async_ReadText = file__async_readtext;
    File.Async_WriteBytes = file__async_writebytes;
    File.Async_WriteText = file__async_writetext;
  })(File = BunPlatform.File ||= {});
  let Glob;
  ((Glob) => {
    let Ex;
    ((Ex) => {
      Ex.Async_Scan = glob__ex__async_scan;
      Ex.Match = glob__ex__match;
    })(Ex = Glob.Ex ||= {});
    Glob.AsyncGen_Scan = glob__asyncgen_scan;
    Glob.Match = glob__match;
  })(Glob = BunPlatform.Glob ||= {});
})(BunPlatform ||= {});
