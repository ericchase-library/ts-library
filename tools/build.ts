import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { Builder } from 'tools/lib/Builder.js';
import { BuildStep, BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { BuildStep_FSCopyFiles } from 'tools/lib/steps/FS-Copy-Files.js';
import { BuildStep_FSFormat } from 'tools/lib/steps/FS-Format.js';
import { BuildStep_FSMirrorDirectory } from 'tools/lib/steps/FS-Mirror-Directory.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  // Force bun to install latest packages.
  new (class implements BuildStep {
    async run(builder: BuilderInternal) {
      Bun.spawnSync(['bun', 'update', '--latest'], { stderr: 'inherit', stdout: 'inherit' });
      ConsoleLog();
    }
  })(),
  BuildStep_FSFormat(),
  //
]);

builder.setProcessorModules([
  //
]);

builder.setCleanupSteps([
  // Mirror Server Directories "src", "tools"
  BuildStep_FSMirrorDirectory({
    from: 'server/src/',
    to: '../Project@Template/server/src/',
    include_patterns: ['**/*.ts'],
    exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
  }),
  BuildStep_FSMirrorDirectory({
    from: 'server/tools/',
    to: '../Project@Template/server/tools/',
    include_patterns: ['**/*.ts'],
  }),

  // Copy Server Root Files
  BuildStep_FSCopyFiles({
    from: 'server/',
    to: '../Project@Template/server/',
    include_patterns: ['LICENSE-APACHE', 'NOTICE', 'console.html', 'package.json', 'tsconfig.json', 'README.md'],
    overwrite: true,
  }),

  // Mirror Project Directories "src/lib/ericchase", "tools
  BuildStep_FSMirrorDirectory({
    from: 'src/lib/ericchase/',
    to: '../Project@Template/src/lib/ericchase/',
    include_patterns: ['**/*.ts'],
    exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
  }),
  BuildStep_FSMirrorDirectory({
    from: 'tools/lib/',
    to: '../Project@Template/tools/lib/',
    include_patterns: ['**/*.ts'],
  }),

  // Copy Project Root Files
  BuildStep_FSCopyFiles({
    from: './',
    to: '../Project@Template/',
    include_patterns: ['.gitignore', '.prettierignore', '.prettierrc', 'LICENSE-APACHE', 'biome.json', 'package.json', 'tsconfig.json'],
    overwrite: true,
  }),
  BuildStep_FSCopyFiles({
    from: './',
    to: '../Project@Template/',
    include_patterns: ['NOTICE', 'README.md'],
    overwrite: false,
  }),

  BuildStep_FSFormat('quiet'),
  //
]);

await builder.start();
