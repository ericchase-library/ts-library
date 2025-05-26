import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Dev_Format } from './lib-dev/step/Step_Dev_Format.js';
import { Step_Dev_Lint } from './lib-dev/step/Step_Dev_Lint.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

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
  // Build Projects
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'build'], dir: path }))),
  //
);

await builder.start();
