import { Step_Dev_Project_Sync_Config } from './core-dev/step/Step_Dev_Project_Sync_Config.js';
import { Step_Dev_Project_Sync_Lib } from './core-dev/step/Step_Dev_Project_Sync_Lib.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Log } from './core/step/Step_Log.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetProcessorModules(
  Processor_Set_Writable({ exclude_patterns: ['**/*'] }),
  //
);

Builder.SetCleanUpSteps(
  // Update Template Project
  Step_Dev_Project_Sync_Lib({ from: './', to: 'C:/Code/Base/JavaScript-TypeScript/@Template' }),
  Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: 'C:/Code/Base/JavaScript-TypeScript/@Template', showlogs: false }),

  // Sync Files
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib({ from: 'C:/Code/Base/JavaScript-TypeScript/@Template', to: path }))),
  Step_Log('--- push again ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib({ from: 'C:/Code/Base/JavaScript-TypeScript/@Template', to: path }))),
  // Update Config
  Step_Log('--- sync config ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Config({ to: path }))),
  // Format
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: path, showlogs: false }))),
);

await Builder.Start();
