import { Step_Dev_Project_Sync_Core } from './core-dev/step/Step_Dev_Project_Sync_Core.js';
import { Step_Dev_Project_Sync_Server } from './core-dev/step/Step_Dev_Project_Sync_Server.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Log } from './core/step/Step_Log.js';

const template_path = 'C:/Code/Base/JavaScript-TypeScript/@Template';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  // Update Template Project
  Step_Dev_Project_Sync_Core({ from_path: '.', to_path: template_path }),
  Step_Dev_Project_Sync_Server({ from_path: '.', to_path: template_path }),
  Step_Bun_Run({ cmd: ['bunx', 'prettier', '--write', '.'], dir: template_path, showlogs: false }),
  // Sync Core
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Core({ from_path: template_path, to_path: path }))),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Server({ from_path: template_path, to_path: path }))),
  Step_Log('--- push again ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Core({ from_path: template_path, to_path: path }))),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Server({ from_path: template_path, to_path: path }))),
);

await Builder.Start();
