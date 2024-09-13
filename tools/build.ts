import { Broadcast } from '../src/Design Pattern/Observer/Broadcast.js';
import { GlobManager } from '../src/Platform/Bun/Path.js';
import { Run } from '../src/Platform/Bun/Process.js';
import { CleanDirectory } from '../src/Platform/Node/Fs.js';
import { NormalizePath } from '../src/Platform/Node/Path.js';
import { ConsoleLog } from '../src/Utility/Console.js';
import { compile, copy } from './lib/build.js';
import { CacheClear } from './lib/cache.js';

export const onLog = new Broadcast<void>();
export function Log(data: string) {
  ConsoleLog(`${new Date().toLocaleTimeString()} > ${data}`);
  onLog.send();
}

// User Values
const buildDir = NormalizePath('build');
const stripDir = NormalizePath('src-stripped');
const srcDir = NormalizePath('src');

export async function buildSteps() {
  // Copy
  const copiedPaths = await copy({
    outDir: stripDir,
    toCopy: new GlobManager().scan(srcDir, '**/*.ts'),
    toExclude: new GlobManager().scan(srcDir, '**/*.example.ts', '**/*.test.ts'),
  });
  for (const path of copiedPaths.paths) {
    Log('copied: ' + path);
  }
  // Compile
  const compiledPaths = await compile({
    outDir: buildDir,
    toCompile: new GlobManager().scan(stripDir, '**/*.ts'),
  });
  for (const path of compiledPaths.paths) {
    Log('compiled: ' + path);
  }
}

export async function buildClear() {
  CacheClear();
  await CleanDirectory(buildDir);
  await CleanDirectory(stripDir);
}

if (Bun.argv[1] === __filename) {
  await Run('bun update');
  await buildClear();
  await buildSteps();
  await Run('bun run format');
  await Run('bun test');
}
