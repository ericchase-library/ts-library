import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetCleanUpSteps(
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'build'], dir: path, showlogs: true }))),
  //
);

await Builder.Start();
