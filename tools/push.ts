import { Builder } from 'tools/lib/Builder.js';
import { Step_Bun_Run } from 'tools/lib/steps/Bun-Run.js';
import { Step_Format } from 'tools/lib/steps/FS-Format.js';
import { Step_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';

const builder = new Builder();

builder.setStartupSteps([
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }),
  Step_Format(),
  //
]);

builder.setCleanupSteps([
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts', 'Utility/UpdateMarker.ts'] }),
  // Push Files
  Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: '../Project@Template' }),
  Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: '../Project@Library@Lint' }),
  // Step_Project_PushLib('../(Private) Projects/@mason/prodbybluezzi-beat-store'),
  // Step_Project_PushLib('../Project@Library@Lint'),
  // Step_Project_PushLib('../Templates/Discord Bot'),
  // Step_Project_PushLib('../Templates/Website'),
  //
]);

await builder.start();
