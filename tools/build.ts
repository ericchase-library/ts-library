import { BunPlatform } from '../src/lib/ericchase/platform-bun.js';
import { Builder } from './core/Builder.js';
import { Processor_Basic_Writer } from './core/processor/Processor_Basic_Writer.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_Dev_Format } from './core/step/Step_Dev_Format.js';
import { Step_Dev_Lint } from './core/step/Step_Dev_Lint.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';
import { Step_Dev_Project_Push_Lib } from './lib-library/step/Step_Dev_Project_Push_Lib.js';
import { Step_Dev_Server } from './lib-web/step/Step_Dev_Server.js';

const builder = Builder({
  mode: BunPlatform.Args.Has('--dev') ? Builder.BUILD_MODE.DEV : Builder.BUILD_MODE.BUILD,
  verbosity: Builder.LOG_VERBOSITY._1_LOG,
});

builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(builder.dir.out),
  Step_Dev_Format({ showlogs: false }),
  Step_Dev_Lint({ showlogs: false }),
  //
);

builder.setProcessorModules(
  Processor_TypeScript_Generic_Transpiler(['**/*.ts'], ['**/*.d.ts', '**/*{.deprecated,.example,.test}.ts'], { target: 'browser' }),
  Processor_Basic_Writer(['**/*.ts'], ['**/*{.deprecated,.example,.test}.ts']),
  //
);

builder.setAfterProcessingSteps(
  Step_Dev_Server(),
  //
);

builder.setCleanUpSteps(
  // Update Local Server Files
  Step_Mirror_Directory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['core.ts', 'platform-node.ts'] }),
  // Update Template Project
  Step_Dev_Project_Push_Lib('../@Template'),
  //
);

await builder.start();
