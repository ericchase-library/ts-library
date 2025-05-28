import { BunPlatform_Args_Has } from '../src/lib/ericchase/platform-bun.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_FS_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';
import { Step_Dev_Format } from './lib-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Sync_Lib } from './lib-dev/step/Step_Dev_Project_Sync_Lib.js';
import { Step_Dev_Server } from './lib-web/step/Step_Dev_Server.js';

if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  // Step_Dev_Lint({ showlogs: true }),
  //
);

Builder.SetProcessorModules(
  Processor_TypeScript_Generic_Transpiler({ include_patterns: ['**/*{.ts,.tsx}'], exclude_patterns: ['**/*.d.ts', '**/*{.deprecated,.example,.test}{.ts,.tsx}'] }, { target: 'browser' }),
  Processor_Set_Writable({ exclude_patterns: ['**/*{.deprecated,.example,.test}{.ts,.tsx}'] }, { exclude_libdir: false }),
  //
);

Builder.SetAfterProcessingSteps(
  Step_Dev_Server(),
  //
);

Builder.SetCleanUpSteps(
  // Update Local Server Files
  Step_FS_Mirror_Directory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['core.ts', 'platform-node.ts'] }),
  // Update Template Project
  Step_Dev_Project_Sync_Lib({ from: './', to: 'C:/Code/Base/JavaScript-TypeScript/@Template' }),
  //
);

await Builder.Start();
