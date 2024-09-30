import { nCartesianProduct } from '../../src/lib/ericchase/Algorithm/Math/CartesianProduct.js';
import { MoveFile } from '../../src/lib/ericchase/Platform/Bun/Fs.js';
import { GlobScanner } from '../../src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from '../../src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleLog } from '../../src/lib/ericchase/Utility/Console.js';
import { src_dir } from './build.js';

// user config
const extensions = ['.ts']; // files to be bundled ie. `name.******.ts
const deprecated_suffixes = ['.deprecated']; // will be skipped when copying to stripped

// directories
const deprecated_dir = new Path('deprecated'); // build files will appear here

// computed patterns
const deprecated_patterns = [...nCartesianProduct(['**/*'], deprecated_suffixes, extensions)].map((arr) => arr.join(''));

for (const path_group of new GlobScanner().scan(src_dir, ...deprecated_patterns).path_groups) {
  if ((await MoveFile({ from: path_group.path, to: path_group.newOrigin(deprecated_dir).path })) === true) {
    ConsoleLog(`move: ${path_group.path}`);
  }
}
