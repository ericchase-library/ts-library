import { Builder } from 'tools/lib/Builder.js';
import { BuildStep_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { BuildStep_FSCleanDirectory } from 'tools/lib/steps/FS-CleanDirectory.js';
import { BuildStep_FSCopy } from 'tools/lib/steps/FS-Copy.js';
import { BuildStep_IOFormat } from 'tools/lib/steps/IO-Format.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  BuildStep_BunInstall(),
  BuildStep_IOFormat(),
  //
]);

builder.setProcessorModules([
  //
]);

builder.setCleanupSteps([
  // Clean Template Folders
  BuildStep_FSCleanDirectory([
    '../Project@Template/server/src',
    '../Project@Template/server/tools',
    '../Project@Template/src/lib/ericchase/',
    '../Project@Template/tools/lib/',
    //
  ]),

  // Copy Server Folder
  BuildStep_FSCopy({
    from: 'server/src/',
    to: '../Project@Template/server/src/',
    include_patterns: ['**/*.ts'],
    exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
    overwrite: true,
  }),
  BuildStep_FSCopy({
    from: 'server/tools/',
    to: '../Project@Template/server/tools/',
    include_patterns: ['**/*.ts'],
    overwrite: true,
  }),
  BuildStep_FSCopy({
    from: 'server/',
    to: '../Project@Template/server/',
    include_patterns: ['LICENSE-APACHE', 'NOTICE', 'console.html', 'package.json', 'tsconfig.json', 'README.md'],
    overwrite: true,
  }),

  // Copy Project Folder
  BuildStep_FSCopy({
    from: 'src/',
    to: '../Project@Template/src/',
    include_patterns: ['**/*.ts'],
    exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
    overwrite: true,
  }),
  BuildStep_FSCopy({
    from: 'tools/lib/',
    to: '../Project@Template/tools/lib/',
    include_patterns: ['**/*.ts'],
    overwrite: true,
  }),
  BuildStep_FSCopy({
    from: './',
    to: '../Project@Template/',
    include_patterns: ['.gitignore', '.prettierignore', '.prettierrc', 'LICENSE-APACHE', 'NOTICE', 'biome.json', 'package.json', 'tsconfig.json', 'README.md'],
    overwrite: true,
  }),
  //
]);

await builder.start();
