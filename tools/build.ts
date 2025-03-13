import { Builder } from 'tools/lib/Builder.js';
import { BuildStep_BunUpdateLatest } from 'tools/lib/steps/Bun-Update.js';
import { BuildStep_FSCopyFiles } from 'tools/lib/steps/FS-Copy-Files.js';
import { BuildStep_FSFormat } from 'tools/lib/steps/FS-Format.js';
import { BuildStep_FSMirrorDirectory } from 'tools/lib/steps/FS-Mirror-Directory.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  BuildStep_BunUpdateLatest(),
  BuildStep_FSFormat(),
  //
]);

builder.setProcessorModules([
  //
]);

builder.setCleanupSteps([
  // Update Server Lib Files
  BuildStep_FSMirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['src/lib/ericchase/Platform/FilePath.ts', 'src/lib/ericchase/Utility/Console.ts', 'src/lib/ericchase/Utility/UpdateMarker.ts'] }),

  // Mirror Server Directories
  BuildStep_FSMirrorDirectory({ from: 'server/', to: '../Project@Template/server/', include_patterns: ['**/*'], exclude_patterns: ['node_modules/**/*', 'bun.lockb'] }),

  // Mirror Project Directories "src/lib/ericchase", "tools/lib"
  BuildStep_FSMirrorDirectory({ from: 'src/lib/ericchase/', to: '../Project@Template/src/lib/ericchase/', include_patterns: ['**/*.ts'], exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'] }),
  BuildStep_FSMirrorDirectory({ from: 'tools/lib/', to: '../Project@Template/tools/lib/', include_patterns: ['**/*.ts'], exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'] }),

  // Copy Project Root Files
  BuildStep_FSCopyFiles({ from: './', to: '../Project@Template/', include_patterns: ['.gitignore', '.prettierignore', '.prettierrc', 'LICENSE-APACHE', 'biome.json', 'package.json', 'tsconfig.json'], overwrite: true }),
  BuildStep_FSCopyFiles({ from: './', to: '../Project@Template/', include_patterns: ['NOTICE', 'README.md'], overwrite: false }),

  BuildStep_FSFormat('quiet'),
  //
]);

await builder.start();
