import { Step_Dev_Project_Sync_Core } from './core-dev/step/Step_Dev_Project_Sync_Core.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Log } from './core/step/Step_Log.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  // Update Template Project
  Step_Dev_Project_Sync_Core({ from_path: './', to_path: 'C:/Code/Base/JavaScript-TypeScript/@Template' }),
  Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: 'C:/Code/Base/JavaScript-TypeScript/@Template', showlogs: false }),

  // Sync Core
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Core({ from_path: 'C:/Code/Base/JavaScript-TypeScript/@Template', to_path: path }))),
  Step_Log('--- push again ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Core({ from_path: 'C:/Code/Base/JavaScript-TypeScript/@Template', to_path: path }))),
  // Update Config
  Step_Log('--- update config ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Update_Config({ project_path: path }))),
  // Format Code
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: path, showlogs: false }))),
);

await Builder.Start();
