import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericCompiler } from './lib/processors/TypeScript-GenericCompiler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';
import { Step_Lint } from './lib/steps/FS-Lint.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';
import { Step_Project_PushLib } from './Step-Dev-Project-PushLib.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }, 'quiet'),
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_CleanDirectory(builder.dir.out),
  Step_Format('quiet'),
  Step_Lint('quiet'),
  //
);

builder.setProcessorModules(
  Processor_TypeScript_GenericCompiler(['**/*{.ts,.tsx,.jsx}'], ['**/*{.deprecated,.example,.module,.script,.test}{.ts,.tsx,.jsx}']),
  Processor_BasicWriter(['**/*{.ts,.tsx,.jsx}'], ['**/*{.deprecated,.example,.module,.script,.test}{.ts,.tsx,.jsx}']),
  //
);

builder.setCleanupSteps(
  // Update Server Lib
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts'] }),
  // Update Template Project
  Step_Project_PushLib('../Project@Template'),
  //
);

await builder.start();
