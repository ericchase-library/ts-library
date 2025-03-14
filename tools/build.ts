import { Builder } from 'tools/lib/Builder.js';
import { Step_Bun_Run } from 'tools/lib/steps/Bun-Run.js';
import { Step_FS_CopyFiles } from 'tools/lib/steps/FS-CopyFiles.js';
import { Step_Format } from 'tools/lib/steps/FS-Format.js';
import { Step_FS_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }),
  Step_Format(),
  //
]);

builder.setProcessorModules([
  //
]);

builder.setCleanupSteps([
  // Update Local Server Files
  Step_FS_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts', 'Utility/UpdateMarker.ts'] }),

  // Mirror Server Directories
  Step_FS_MirrorDirectory({ from: 'server/', to: '../Project@Template/server/', include_patterns: ['**/*'], exclude_patterns: ['node_modules/**/*', 'bun.lockb'] }),

  // Mirror Project Directories "src/lib/ericchase", "tools/lib"
  Step_FS_MirrorDirectory({ from: 'src/lib/ericchase/', to: '../Project@Template/src/lib/ericchase/', include_patterns: ['**/*.ts'], exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'] }),
  Step_FS_MirrorDirectory({ from: 'tools/lib/', to: '../Project@Template/tools/lib/', include_patterns: ['**/*.ts'], exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'] }),

  // Copy Project Root Files
  Step_FS_CopyFiles({ from: './', to: '../Project@Template/', include_patterns: ['.gitignore', '.prettierignore', '.prettierrc', 'LICENSE-APACHE', 'biome.json', 'package.json', 'tsconfig.json'], overwrite: true }),
  Step_FS_CopyFiles({ from: './', to: '../Project@Template/', include_patterns: ['NOTICE', 'README.md'], overwrite: false }),

  Step_Format('quiet'),
  //
]);

await builder.start();
