import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Log } from './core/step/Step_Log.js';

import path_json from './git-projects.jsonc' assert { type: 'jsonc' };

const template_path = 'C:/Code/Base/JavaScript-TypeScript/@Template';
const paths: string[] = [template_path, ...path_json];

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  Step_Log('--- pull ---'),
  ...paths.map((path) => Step_Bun_Run({ cmd: ['git', 'pull', '--all'], cwd: path })),
  Step_Log('--- pull again ---'),
  ...paths.map((path) => Step_Bun_Run({ cmd: ['git', 'pull', '--all'], cwd: path })),
  //
);

await Builder.Start();
