import { NODE_PATH } from '../src/lib/ericchase/NodePlatform.js';
import { Step_Dev_Project_Sync_Server } from './core-dev/step/Step_Dev_Project_Sync_Server.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_Log } from './core/step/Step_Log.js';
import { Step_Sync } from './core/step/Step_Sync.js';

const template_path = 'C:/Code/Base/JavaScript-TypeScript/@Template';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  // Update Template Project
  Step_FS_Clean_Directory(NODE_PATH.join(template_path, 'server')),
  Step_Dev_Project_Sync_Server({ from_path: '.', to_path: template_path }),
  Step_Bun_Run({ cmd: ['bun', 'install'], dir: template_path, showlogs: false }),
  Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: template_path, showlogs: false }),
  // Sync Server
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Server({ from_path: template_path, to_path: path }))),
  Step_Log('--- push again ---'),
  Step_Async(
    project_paths.map((path: string) =>
      Step_Sync([
        Step_Dev_Project_Sync_Server({ from_path: template_path, to_path: path }),
        Step_Dev_Project_Update_Config({ project_path: path }),
        Step_Bun_Run({ cmd: ['bun', 'install'], dir: path, showlogs: false }),
        Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: path, showlogs: false }),
        //
      ]),
    ),
  ),
);

await Builder.Start();
