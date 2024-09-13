// ! using old library code

import { FilterDirectoryTree } from '../src/Platform/Cxx/LSD.js';
import { ConsoleLog } from '../src/Utility/Console.js';

const { files } = await FilterDirectoryTree({
  path: '.', //
  include: ['*.rs'],
  ignore_paths: ['/target/'],
});

for (const path of files) {
  ConsoleLog(path);
  const proc = Bun.spawn(['rustfmt', '--config-path', './rustfmt.toml', path]);
  ConsoleLog(await new Response(proc.stdout).text());
}
