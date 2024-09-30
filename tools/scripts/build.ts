import { Broadcast } from '../../src/lib/ericchase/Design Pattern/Observer/Broadcast.js';
import { RunSync } from '../../src/lib/ericchase/Platform/Bun/Child Process.js';
import { GlobScanner } from '../../src/lib/ericchase/Platform/Bun/Glob.js';
import { CleanDirectory } from '../../src/lib/ericchase/Platform/Node/Fs.js';
import { Path, ResolvePath } from '../../src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleLog, ConsoleNewline } from '../../src/lib/ericchase/Utility/Console.js';

import { command_map } from '../dev.js';
import { BuildRunner, compile, copy, IntoPatterns } from '../lib/build.js';
import { Cache_FileStats_Lock, Cache_FileStats_Reset, Cache_FileStats_Unlock } from '../lib/cache/FileStatsCache.js';
import { Cache_Unlock, TryLock, TryLockEach } from '../lib/cache/LockCache.js';

// user config
const source_extensions = ['.ts']; // extensions for source files for building
const exclusion_suffixes_for_stripped_dir = ['.deprecated', '.example', '.test']; // will be skipped when copying to stripped

// directories
export const out_dir = new Path('build'); // build files will appear here
export const src_dir = new Path('src'); // all library files should be here
export const stripped_dir = new Path('src-stripped'); // copy of .ts files here

// computed patterns
const source_patterns = IntoPatterns('**/*', source_extensions);
const exclusion_patterns_for_stripped_dir = IntoPatterns('**/*', exclusion_suffixes_for_stripped_dir, source_extensions);

// build mode
export const build_mode = {
  silent: false,
  watch: false,
};

// bundler
const bundler = new BuildRunner(onLog);

// step: clean
export async function buildStep_Clean() {
  ConsoleLog('Build Step: Clean');
  bundler.killAll();
  Cache_FileStats_Reset();
  await CleanDirectory(out_dir.path);
  await CleanDirectory(stripped_dir.path);
}

// step: compile
export async function buildStep_Compile() {
  ConsoleLog('Build Step: Compile');
  const compiled_paths = await compile({
    out_dir: out_dir,
    to_compile: new GlobScanner().scan(stripped_dir, ...source_patterns),
  });
  for (const path of compiled_paths.paths) {
    onLog(`Compiled: ${path}`);
  }
  if (build_mode.watch === false) {
    onLog(`${[...compiled_paths.paths].length} files compiled.`);
  }
}

// step: copy
export async function buildStep_Copy() {
  ConsoleLog('Build Step: Copy');
  const src_copied_paths = await copy({
    out_dirs: [stripped_dir],
    to_copy: new GlobScanner().scan(src_dir, ...source_patterns),
    to_exclude: new GlobScanner().scan(src_dir, ...exclusion_patterns_for_stripped_dir),
  });
  for (const path of src_copied_paths.paths) {
    onLog(`Copied: ${path}`);
  }
  if (build_mode.watch === false) {
    onLog(`${[...src_copied_paths.paths].length} files copied.`);
  }
}

// step: save exports
export async function buildStep_SaveExports() {
  ConsoleLog('Build Step: Save Exports');
  const dir = ResolvePath(stripped_dir.appendSegment('lib/ericchase').path);
  const entries = (await Array.fromAsync(new Bun.Glob('**/*.ts').scan({ cwd: dir, absolute: true, dot: true }))).sort();
  const transpiler = new Bun.Transpiler({ loader: 'tsx' });
  const output: Record<string, any> = {};
  for (const path of entries) {
    output[path.slice(dir.length + 1)] = transpiler.scan(await Bun.file(path).text()).exports.sort();
  }
  await Bun.write(new Path(`./tools/exports/${new Date().toISOString().split('T')[0]}.json`).path, JSON.stringify(output));
}

// logger
export const on_log = new Broadcast<void>();
export function onLog(data: string) {
  if (build_mode.silent === false) {
    ConsoleLog(`[${new Date().toLocaleTimeString()}] > ${data}`);
    on_log.send();
  }
}

// direct run
if (Bun.argv[1] === __filename) {
  TryLockEach([command_map.build, command_map.format]);

  RunSync.Bun('update');
  Cache_Unlock(command_map.format);
  RunSync.BunRun('format', 'silent');
  TryLock(command_map.format);

  if (Cache_FileStats_Lock()) {
    ConsoleNewline();
    await buildStep_Clean();
    ConsoleNewline();
    await buildStep_Copy();
    ConsoleNewline();
    await buildStep_Compile();
    ConsoleNewline();
    await buildStep_SaveExports();
  }
  Cache_FileStats_Unlock();

  Cache_Unlock(command_map.format);
  RunSync.BunRun('format');
  RunSync.Bun('test');
}
