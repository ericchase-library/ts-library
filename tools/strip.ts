import { GlobManager } from '../src/Platform/Bun/Path.js';
import { CleanDirectory } from '../src/Platform/Node/Fs.js';
import { NormalizePath } from '../src/Platform/Node/Path.js';
import { copy } from './lib/build.js';

// User Values
const sourceDir = NormalizePath('./src') + '/';
const strippedDir = NormalizePath('./src-stripped') + '/';

// Init
await CleanDirectory(strippedDir);

// Copy
await copy({
  outDir: strippedDir,
  toCopy: new GlobManager().scan(sourceDir, '**/*.ts'),
  toExclude: new GlobManager().scan(sourceDir, '**/*.example.ts', '**/*.test.ts'),
});
