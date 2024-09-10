import { GlobManager } from '../src/Platform/Bun/Path.js';
import { CleanDirectory } from '../src/Platform/Node/Fs.js';
import { NormalizePath } from '../src/Platform/Node/Path.js';
import { compile } from './lib/build.js';

// User Values
const buildDir = NormalizePath('./build') + '/';
const sourceDir = NormalizePath('./src') + '/';

// Init
await CleanDirectory(buildDir);

// Compile
await compile({
  outDir: buildDir,
  toCompile: new GlobManager().scan(sourceDir, '**/*.ts'),
  toExclude: new GlobManager().scan(sourceDir, '**/*.test.ts'),
});
