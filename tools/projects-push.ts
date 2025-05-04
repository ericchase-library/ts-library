import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Dev_Format } from './core/step/Step_Dev_Format.js';
import { Step_Dev_Lint } from './core/step/Step_Dev_Lint.js';
import { Step_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';
import { Step_Log } from './core/step/Step_Log.js';
import { Step_Dev_Project_Push_Lib } from './lib-library/step/Step_Dev_Project_Push_Lib.js';

import project_paths from './lib-library/synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

const builder = Builder();

builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_Dev_Format({ showlogs: false }),
  Step_Dev_Lint({ showlogs: false }),
  //
);

builder.setCleanUpSteps(
  // Update Local Server Files
  Step_Mirror_Directory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['core.ts', 'platform-node.ts'] }),
  // Update Template Project
  Step_Dev_Project_Push_Lib('../@Template'),
  //
  Step_Log('--- push files ---'),
  // Push Files
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  Step_Log('--- double check ---'),
  // Double Check
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'pull'], dir: path }))),
  //
);

await builder.start();
