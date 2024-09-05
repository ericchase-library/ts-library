import { GlobManager } from '../src/Platform/Bun/Path.js';
import { CleanDirectory } from '../src/Platform/Node/Fs.js';
import { NormalizePath } from '../src/Platform/Node/Path.js';
import { copy } from './lib/build.js';

// User Values
const sourceDir = NormalizePath('./src') + '/';
const strippedDir = NormalizePath('./src-stripped') + '/';

// Init
await CleanDirectory(strippedDir);

// Setup Path Managers
const toCopy = new GlobManager() //
  .scan(sourceDir, '**/*.ts');
const toExclude = new GlobManager() //
  .scan(sourceDir, '**/Example -- */**')
  .scan(sourceDir, '**/*.test.ts');

// Copy
await copy({
  outDir: strippedDir,
  toCopy,
  toExclude,
});
