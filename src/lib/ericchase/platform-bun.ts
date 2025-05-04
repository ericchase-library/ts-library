import { Core } from './core.js';
import { NodePlatform } from './platform-node.js';

// Args
function args__has(arg: string): boolean {
  return Bun.argv.includes(arg);
}

// File
async function file__async__copy(frompath: string, topath: string, overwrite = false) {
  if (NodePlatform.Path.Join(frompath) === NodePlatform.Path.Join(topath)) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(NodePlatform.Path.Join(topath)).exists()) === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform.Path.Join(topath)), Bun.file(NodePlatform.Path.Join(frompath)));
  return file__compare(NodePlatform.Path.Join(frompath), NodePlatform.Path.Join(topath));
}
async function file__async__delete(path: string) {
  await Bun.file(NodePlatform.Path.Join(path)).delete();
  return (await Bun.file(NodePlatform.Path.Join(path)).exists()) === false;
}
async function file__async__move(frompath: string, topath: string, overwrite = false) {
  if (NodePlatform.Path.Join(frompath) === NodePlatform.Path.Join(topath)) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(NodePlatform.Path.Join(topath)).exists()) === true) {
    return false;
  }
  await Bun.write(Bun.file(NodePlatform.Path.Join(topath)), Bun.file(NodePlatform.Path.Join(frompath)));
  if ((await file__compare(NodePlatform.Path.Join(frompath), NodePlatform.Path.Join(topath))) === false) {
    return false;
  }
  return file__async__delete(NodePlatform.Path.Join(frompath));
}
async function file__async__readbytes(path: string) {
  return await Bun.file(NodePlatform.Path.Join(path)).bytes();
}
async function file__async__readtext(path: string) {
  return await Bun.file(NodePlatform.Path.Join(path)).text();
}
async function file__async__writebytes(path: string, bytes: Uint8Array, createpath = true) {
  if (createpath === true) {
    await NodePlatform.Directory.Async_Create(NodePlatform.Path.GetParentPath(NodePlatform.Path.Join(path)));
  }
  return Bun.write(NodePlatform.Path.Join(path), bytes);
}
async function file__async__writetext(path: string, text: string, createpath = true) {
  if (createpath === true) {
    await NodePlatform.Directory.Async_Create(NodePlatform.Path.GetParentPath(NodePlatform.Path.Join(path)));
  }
  return Bun.write(NodePlatform.Path.Join(path), text);
}

function file__compare(frompath: string, topath: string) {
  return Core.Stream.Uint8.Async_Compare(Bun.file(NodePlatform.Path.Join(frompath)).stream(), Bun.file(NodePlatform.Path.Join(topath)).stream());
}

// Utility

async function* glob__asyncgen_scan(path: string, pattern: string, options?: { absolutepaths?: boolean; onlyfiles?: boolean }): AsyncGenerator<string> {
  for await (const value of new Bun.Glob(pattern).scan({
    absolute: options?.absolutepaths ?? false,
    cwd: NodePlatform.Path.Join(path),
    dot: true,
    onlyFiles: options?.onlyfiles ?? true,
  })) {
    yield value;
  }
}

async function glob__ex__async_scan(path: string, include_patterns: string[], exclude_patterns: string[], options?: { absolutepaths?: boolean; onlyfiles?: boolean }): Promise<Set<string>> {
  const included: string[] = [];
  for (const pattern of include_patterns) {
    included.push(...(await Array.fromAsync(glob__asyncgen_scan(path, pattern, options))));
  }
  const excluded: string[] = [];
  for (const pattern of exclude_patterns) {
    excluded.push(...(await Array.fromAsync(glob__asyncgen_scan(path, pattern, options))));
  }
  return new Set(included).difference(new Set(excluded));
}

function glob__match(query: string, pattern: string): boolean {
  return new Bun.Glob(pattern).match(query);
}
function glob__ex__match(query: string, include_patterns: string[], exclude_patterns: string[]): boolean {
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

export namespace BunPlatform {
  export namespace Args {
    export const Has = args__has;
  }
  export namespace File {
    export const Async_Copy = file__async__copy;
    export const Async_Delete = file__async__delete;
    export const Async_Move = file__async__move;
    export const Async_ReadBytes = file__async__readbytes;
    export const Async_ReadText = file__async__readtext;
    export const Async_WriteBytes = file__async__writebytes;
    export const Async_WriteText = file__async__writetext;
    //
    export const Compare = file__compare;
  }
  export namespace Glob {
    export namespace Ex {
      export const Async_Scan = glob__ex__async_scan;
      //
      export const Match = glob__ex__match;
    }
    export const AsyncGen_Scan = glob__asyncgen_scan;
    //
    export const Match = glob__match;
  }
}
