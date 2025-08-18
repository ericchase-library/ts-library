import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { NODE_PATH } from '../src/lib/ericchase/NodePlatform.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Step_Run_Dev_Server } from './core-web/step/Step_Run_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { PATTERN, Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_FS_Mirror_Directory } from './core/step/Step_FS_Mirror_Directory.js';

const template_path = 'C:/Code/Base/JavaScript-TypeScript/@Template';

if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  //
);

Builder.SetProcessorModules(
  Processor_TypeScript_Generic_Bundler({}, { bundler_mode: 'iife' }),
  Processor_TypeScript_Generic_Bundler({ external: ['lodash/shuffle'] }, { bundler_mode: 'module' }),
  Processor_TypeScript_Generic_Transpiler({}, { exclude_patterns: ['**/*.d.ts', `**/*${PATTERN.IIFE_MODULE}`, `**/*{.test}${PATTERN.JS_JSX_TS_TSX}`] }),
  //
);

Builder.SetAfterProcessingSteps(
  Step_Run_Dev_Server(),
  //
);

Builder.SetCleanUpSteps(
  // Update Local Server Files
  Step_FS_Mirror_Directory({
    from_path: NODE_PATH.join(Builder.Dir.Lib, 'ericchase'),
    to_path: NODE_PATH.join('server', 'src', 'lib', 'ericchase'),
    include_patterns: [
      'Core_Console_Error.ts',
      'Core_Console_Log.ts',
      'NodePlatform_Directory_ReadDir.ts',
      'NodePlatform_Path_Is_Directory.ts',
      'NodePlatform_Path_Is_SymbolicLink.ts',
      'NodePlatform_PathObject_Relative_Class.ts',
      'NodePlatform.ts',
      //
    ],
  }),
);

await Builder.Start();
