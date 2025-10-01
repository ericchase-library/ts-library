import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';

import path_json from './synced-projects.jsonc' assert { type: 'jsonc' };

const template_path = 'C:/Code/Base/JavaScript-TypeScript/@Template';
const paths: string[] = [template_path, ...path_json];

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  ...paths.map((path) => Step_Dev_Project_Update_Config({ project_dir: path })),
  ...paths.map((path) => Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], cwd: path, showlogs: false })),
  ...paths.map((path) => Step_Bun_Run({ cmd: ['bun', 'install'], cwd: path, showlogs: false })),
  ...paths.map((path) => Step_Bun_Run({ cmd: ['bun', 'run', 'build'], cwd: path, showlogs: false })),
  //
);

await Builder.Start();
