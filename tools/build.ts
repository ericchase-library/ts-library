import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Server } from './core-web/step/Step_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_FS_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';

if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  // Step_Dev_Project_Sync_Config({ project_path: './' }),
  Step_Dev_Format({ showlogs: false }),
  //
);

Builder.SetProcessorModules(
  Processor_TypeScript_Generic_Bundler({ external: ['lodash/shuffle'] }),
  Processor_TypeScript_Generic_Transpiler(
    {
      include_patterns: ['**/*{.ts,.tsx}'],
      exclude_patterns: ['**/*.d.ts', '**/*{.module,.iife}{.ts,.tsx}', '**/*{.deprecated,.example,.test}{.ts,.tsx}'],
    },
    { target: 'browser' },
  ),
  Processor_Set_Writable(
    {
      include_patterns: ['**/*{.ts,.tsx}'],
      exclude_patterns: ['**/*{.deprecated,.example,.test}{.ts,.tsx}'],
    },
    { include_libdir: true },
  ),
  //
);

Builder.SetAfterProcessingSteps(
  Step_Dev_Server(),
  //
);

Builder.SetCleanUpSteps(
  // Update Local Server Files
  Step_FS_Mirror_Directory({
    from_path: 'src/lib/ericchase/',
    to_path: 'server/src/lib/ericchase/',
    include_patterns: [
      'Core_Console_Log.ts', //
      'NodePlatform_Directory_ReadDir.ts',
      'NodePlatform_Path_Is_Directory.ts',
      'NodePlatform_Path_Is_SymbolicLink.ts',
      'NodePlatform_PathObject_Relative_Class.ts',
      'NodePlatform.ts',
    ],
  }),
  //
);

await Builder.Start();
