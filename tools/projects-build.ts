import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Step_Async } from './core/step/Step_Async.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

Builder.SetStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_Dev_Format({ showlogs: false }),
  //
);

Builder.SetProcessorModules(
  Processor_Set_Writable({ exclude_patterns: ['**/*'] }),
  //
);

Builder.SetCleanUpSteps(
  // Build Projects
  Step_Async(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['bun', 'run', 'build'], dir: path }))),
  //
);

await Builder.Start();
