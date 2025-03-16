import { Builder } from 'tools/lib/Builder.js';
import { Step_Bun_Run } from 'tools/lib/steps/Bun-Run.js';
import { Step_StartServer } from 'tools/lib/steps/Dev-StartServer.js';
import { Step_CleanDirectory } from 'tools/lib/steps/FS-CleanDirectory.js';
import { Step_Format } from 'tools/lib/steps/FS-Format.js';
import { Step_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  // Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }),
  // Step_CleanDirectory(builder.dir.out),
  // Step_Format(),
  // Step_StartServer(),
  //
]);

builder.setCleanupSteps([
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts', 'Utility/UpdateMarker.ts'] }),
  //
]);

await builder.start();
