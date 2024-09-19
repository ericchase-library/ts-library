import { Broadcast } from '../src/Design Pattern/Observer/Broadcast.js';
import { GlobManager } from '../src/Platform/Bun/Glob.js';
import { Run } from '../src/Platform/Bun/Process.js';
import { CleanDirectory } from '../src/Platform/Node/Fs.js';
import { Path } from '../src/Platform/Node/Path.js';
import { ConsoleLog } from '../src/Utility/Console.js';
import { compile, copy } from './lib/build.js';
import { CacheClear } from './lib/cache.js';

// User Values
const build_dir = new Path('build');
const src_dir = new Path('src');
const stripped_dir = new Path('src-stripped');

export async function buildStep_Clean() {
  CacheClear();
  await CleanDirectory(build_dir.path);
  await CleanDirectory(stripped_dir.path);
}

export async function buildStep_CopyStripped() {
  const copied_paths = await copy({
    out_dir: stripped_dir,
    to_copy: new GlobManager().scan(src_dir, '**/*.ts'),
    to_exclude: new GlobManager().scan(src_dir, '**/*.deprecated.ts', '**/*.example.ts', '**/*.test.ts'),
  });
  for (const path of copied_paths.paths) {
    Log(`copied: ${path}`);
  }
}

export async function buildStep_Compile() {
  const compiled_paths = await compile({
    out_dir: build_dir,
    to_compile: new GlobManager().scan(stripped_dir, '**/*.ts'),
  });
  for (const path of compiled_paths.paths) {
    Log(`compiled: ${path}`);
  }
}

export const onLog = new Broadcast<void>();
export function Log(data: string) {
  ConsoleLog(`${new Date().toLocaleTimeString()} > ${data}`);
  onLog.send();
}

if (Bun.argv[1] === __filename) {
  await Run('bun update');
  await Run('bun run format-silent');
  await buildStep_Clean();
  await buildStep_CopyStripped();
  await buildStep_Compile();
  await Run('bun run format-silent');
  await Run('bun test');
}
