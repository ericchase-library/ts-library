import { SetLoggerOptions } from '../src/lib/ericchase/Utility/Logger.js';
import { Builder } from './lib/Builder.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_Format } from './lib/steps/FS-Format.js';
import { Step_Lint } from './lib/steps/FS-Lint.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';
import { Step_Async } from './lib/steps/Steps-Async.js';
import { Step_Log } from './lib/steps/Steps-Log.js';
import { Step_Project_PushLib } from './Step-Dev-Project-PushLib.js';
import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

const builder = new Builder();

builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }, 'quiet'),
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_Format('quiet'),
  Step_Lint('quiet'),
  //
);

builder.setCleanUpSteps(
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts'] }),
  // Update Template Project
  Step_Project_PushLib('../@Template'),
  //
  Step_Log('-'),
  // Push Files
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  Step_Log('-'),
  // Double Check
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  //
);

await builder.start();
