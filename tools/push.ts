import { SetLoggerOptions } from 'src/lib/ericchase/Utility/Logger.js';
import { Builder } from 'tools/lib/Builder.js';
import { Step_Bun_Run } from 'tools/lib/steps/Bun-Run.js';
import { Step_Format } from 'tools/lib/steps/FS-Format.js';
import { Step_Lint } from 'tools/lib/steps/FS-Lint.js';
import { Step_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';
import { Step_Async } from 'tools/lib/steps/Steps-Async.js';
import { Step_Log } from 'tools/lib/steps/Steps-Log.js';
import { Step_Project_PushLib } from 'tools/Step-Dev-Project-PushLib.js';
import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

const builder = new Builder();

builder.setStartupSteps([
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }, 'quiet'),
  Step_Format('quiet'),
  Step_Lint('quiet'),
  //
]);

builder.setCleanupSteps([
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts', 'Utility/UpdateMarker.ts'] }),
  // Update Template Project
  Step_Project_PushLib('../Project@Template'),
  Step_Log('-'),
  // Push Files (double check)
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  Step_Log('-'),
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
]);

await builder.start();
