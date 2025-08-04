import { Step_Dev_Project_Sync_Config } from './core-dev/step/Step_Dev_Project_Sync_Config.js';
import { Builder } from './core/Builder.js';
import { SetLoggerOptions } from './core/Logger.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';

SetLoggerOptions({ ceremony: false });

Builder.SetProcessorModules(
  Processor_Set_Writable({ exclude_patterns: ['**/*'] }),
  //
);

Builder.SetCleanUpSteps(
  /*
  // Update Template Project
  Step_Dev_Project_Sync_Lib({ from: './', to: 'C:/Code/Base/JavaScript-TypeScript/@Template' }),
  // Update Other Projects
  Step_Log('--- push ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib({ from: 'C:/Code/Base/JavaScript-TypeScript/@Template', to: path }))),
  Step_Log('--- push again ---'),
  Step_Async(project_paths.map((path: string) => Step_Dev_Project_Sync_Lib({ from: 'C:/Code/Base/JavaScript-TypeScript/@Template', to: path }))),
  //
  */
  Step_Dev_Project_Sync_Config(),
);

await Builder.Start();
