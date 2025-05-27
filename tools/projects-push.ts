import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';
import { Step_Log } from './core/step/Step_Log.js';
import { Step_Dev_Format } from './lib-dev/step/Step_Dev_Format.js';
import { Step_Dev_Lint } from './lib-dev/step/Step_Dev_Lint.js';
import { Step_Dev_Project_Sync_Lib } from './lib-dev/step/Step_Dev_Project_Sync_Lib.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };
SetLoggerOptions({ ceremony: false });

Builder.SetStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_Dev_Format({ showlogs: false }),
  Step_Dev_Lint({ showlogs: false }),
  //
);

Builder.SetCleanUpSteps(
  // Update Local Server Files
  Step_FS_Mirror_Directory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['core.ts', 'platform-node.ts'] }),
  // Update Template Project
  Step_Dev_Project_Sync_Lib('./', 'C:/Code/Base/JavaScript-TypeScript/@Template'),
  //
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib('C:/Code/Base/JavaScript-TypeScript/@Template', path))),
  Step_Log('--- push again ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib('C:/Code/Base/JavaScript-TypeScript/@Template', path))),
  //
);

await Builder.Start();
