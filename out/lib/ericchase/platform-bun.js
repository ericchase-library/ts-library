import { Core_Stream_Uint8_Async_Compare } from "./core.js";
import { NodePlatform_Directory_Async_Create, NodePlatform_Path_GetParentPath, NodePlatform_Path_Join } from "./platform-node.js";
export function BunPlatform_Args_Has(arg) {
  return Bun.argv.includes(arg);
}
export function BunPlatform_File_Async_Compare(frompath, topath) {
  return Core_Stream_Uint8_Async_Compare(Bun.file(NodePlatform_Path_Join(frompath)).stream(), Bun.file(NodePlatform_Path_Join(topath)).stream());
}
export async function BunPlatform_File_Async_Copy(frompath, topath, overwrite = false) {
  if (NodePlatform_Path_Join(frompath) === NodePlatform_Path_Join(topath)) {
    return false;
  }
  if (overwrite !== true && await Bun.file(NodePlatform_Path_Join(topath)).exists() === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform_Path_Join(topath)), Bun.file(NodePlatform_Path_Join(frompath)));
  return BunPlatform_File_Async_Compare(NodePlatform_Path_Join(frompath), NodePlatform_Path_Join(topath));
}
export async function BunPlatform_File_Async_Delete(path) {
  await Bun.file(NodePlatform_Path_Join(path)).delete();
  return await Bun.file(NodePlatform_Path_Join(path)).exists() === false;
}
export async function BunPlatform_File_Async_Move(frompath, topath, overwrite = false) {
  if (NodePlatform_Path_Join(frompath) === NodePlatform_Path_Join(topath)) {
    return false;
  }
  if (overwrite !== true && await Bun.file(NodePlatform_Path_Join(topath)).exists() === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform_Path_Join(topath)), Bun.file(NodePlatform_Path_Join(frompath)));
  if (await BunPlatform_File_Async_Compare(NodePlatform_Path_Join(frompath), NodePlatform_Path_Join(topath)) === false) {
    return false;
  }
  return BunPlatform_File_Async_Delete(NodePlatform_Path_Join(frompath));
}
export function BunPlatform_File_Async_ReadBytes(path) {
  return Bun.file(NodePlatform_Path_Join(path)).bytes();
}
export function BunPlatform_File_Async_ReadText(path) {
  return Bun.file(NodePlatform_Path_Join(path)).text();
}
export async function BunPlatform_File_Async_WriteBytes(path, bytes, createpath = true) {
  if (createpath === true) {
    await NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(NodePlatform_Path_Join(path)));
  }
  return Bun.write(NodePlatform_Path_Join(path), bytes);
}
export async function BunPlatform_File_Async_WriteText(path, text, createpath = true) {
  if (createpath === true) {
    await NodePlatform_Directory_Async_Create(NodePlatform_Path_GetParentPath(NodePlatform_Path_Join(path)));
  }
  return Bun.write(NodePlatform_Path_Join(path), text);
}
export async function* BunPlatform_Glob_AsyncGen_Scan(path, pattern, options) {
  for await (const value of new Bun.Glob(pattern).scan({
    absolute: options?.absolutepaths ?? false,
    cwd: NodePlatform_Path_Join(path),
    dot: true,
    onlyFiles: options?.onlyfiles ?? true
  })) {
    yield value;
  }
}
export async function BunPlatform_Glob_Ex_Async_Scan(path, include_patterns, exclude_patterns, options) {
  const included = [];
  for (const pattern of include_patterns) {
    included.push(...await Array.fromAsync(BunPlatform_Glob_AsyncGen_Scan(path, pattern, options)));
  }
  const excluded = [];
  for (const pattern of exclude_patterns) {
    excluded.push(...await Array.fromAsync(BunPlatform_Glob_AsyncGen_Scan(path, pattern, options)));
  }
  return new Set(included).difference(new Set(excluded));
}
export function BunPlatform_Glob_Ex_Match(query, include_patterns, exclude_patterns) {
  let matched = false;
  for (const pattern of include_patterns) {
    if (BunPlatform_Glob_Match(query, pattern) === true) {
      matched = true;
      break;
    }
  }
  for (const pattern of exclude_patterns) {
    if (BunPlatform_Glob_Match(query, pattern) === true) {
      matched = false;
      break;
    }
  }
  return matched;
}
export function BunPlatform_Glob_Match(query, pattern) {
  return new Bun.Glob(pattern).match(query);
}
