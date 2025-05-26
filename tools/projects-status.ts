import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Sync } from './core/step/Step_Sync.js';

import project_paths from './synced-projects.jsonc' assert { type: 'jsonc' };

SetLoggerOptions({ ceremony: false });

const builder = Builder();

builder.setStartUpSteps(
  Step_Sync(project_paths.map((path: string) => Step_Bun_Run({ cmd: ['git', '-c', 'color.ui=always', 'status'], dir: path }))),
  //
);

await builder.start();
