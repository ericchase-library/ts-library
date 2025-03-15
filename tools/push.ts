import { Step_Project_PushLib } from 'tools/Dev-Project-PushLib.js';
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
  Step_Project_PushLib('C:/Code/Base/Javascript-Typescript/Project@Template'),
  Step_Project_PushLib('C:/Code/Base/Javascript-Typescript/Templates/Website'),
  // Step_Project_PushLib(''),
  //
]);

await builder.start();
