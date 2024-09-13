// ! using old library code

import { CopyFile } from '../src/Platform/Bun/Fs.js';
import { FilterDirectoryTree } from '../src/Platform/Cxx/LSD.js';
import { DeleteFile } from '../src/Platform/Node/Fs.js';
import { ConsoleLog } from '../src/Utility/Console.js';

const src = {
  dir: './src',
  ext: '.ts',
  exclude: '.test.ts',
};

const dest = {
  dir: './src',
  ext: '.ts',
};

const { files } = await FilterDirectoryTree({
  path: src.dir, //
  include: ['*' + src.ext],
  exclude: ['*' + src.exclude],
});

const success: string[] = [];
const failure: string[] = [];

for (const from of files) {
  const to = dest.dir + from.slice(src.dir.length, from.lastIndexOf(src.ext)) + dest.ext;
  try {
    if (await CopyFile({ from, to })) {
      await DeleteFile(from);
      success.push(from);
    } else {
      failure.push(from);
    }
  } catch (error) {
    failure.push(from);
  }
}

if (success.length > 0) {
  for (const path of success) {
    ConsoleLog('\x1b[32mpass\x1b[0m', path);
  }
}
if (failure.length > 0) {
  for (const path of failure) {
    ConsoleLog('\x1b[31mfail\x1b[0m', path);
  }
}
