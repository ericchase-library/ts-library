// ! using old library code

import { FilterDirectoryTree } from '../src/Platform/Cxx/LSD.js';

const { files } = await FilterDirectoryTree({
  path: '.', //
  include: ['*.rs'],
  ignore_paths: ['/target/'],
});

for (const path of files) {
  console.log(path);
  const proc = Bun.spawn(['rustfmt', '--config-path', './rustfmt.toml', path]);
  console.log(await new Response(proc.stdout).text());
}
