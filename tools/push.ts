import { Builder } from 'tools/lib/Builder.js';
import { Step_Bun_Run } from 'tools/lib/steps/Bun-Run.js';
import { Step_Format } from 'tools/lib/steps/FS-Format.js';
import { Step_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';
import { Step_Async } from 'tools/lib/steps/Steps-Async.js';

const builder = new Builder();

builder.setStartupSteps([
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }, 'quiet'),
  Step_Format('quiet'),
  //
]);

const project_paths = [
  '../Project@Template',
  '../Project@Library@Lint',
  '../Templates/Discord Bot',
  '../Templates/Website',
  // '../(Private) Projects/@mason/prodbybluezzi-beat-store',
  //
];

builder.setCleanupSteps([
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts', 'Utility/UpdateMarker.ts'] }),
  // Push Files
  Step_Async(project_paths.map((path) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  Step_Async(project_paths.map((path) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
]);

await builder.start();
