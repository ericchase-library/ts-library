import { Builder } from './core/Builder.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Dev_Project_Pull_Lib } from './core/step/Step_Dev_Project_Pull_Lib.js';

// This script pulls base lib files from another project. I use it for quickly
// updating templates and concrete projects.
const builder = Builder();

builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_Dev_Project_Pull_Lib('C:/Code/Base/JavaScript-TypeScript/@Template'),
  //
);

await builder.start();
