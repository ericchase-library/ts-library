import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericBundlerImportRemapper } from './lib/processors/TypeScript-GenericBundler-ImportRemapper.js';
import { Processor_TypeScript_GenericBundler } from './lib/processors/TypeScript-GenericBundler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_StartServer } from './lib/steps/Dev-StartServer.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';
import { Step_Lint } from './lib/steps/FS-Lint.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';
import { Step_Project_PushLib } from './Step-Dev-Project-PushLib.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'] }),
  Step_CleanDirectory(builder.dir.out),
  Step_Format(),
  Step_Lint(),
  //
]);

builder.setBeforeProcessingSteps([
  //
]);

builder.setProcessorModules([
  Processor_TypeScript_GenericBundler({ sourcemap: 'none', target: 'bun' }),
  Processor_TypeScript_GenericBundlerImportRemapper(),
  // all files except for .ts and lib files
  Processor_BasicWriter(['**/*'], ['**/*{.ts,.tsx,.jsx}', `${builder.dir.lib.standard}/**/*`]),
  // all module and script files
  Processor_BasicWriter(['**/*{.module,.script}{.ts,.tsx,.jsx}'], []),
  //
  // Processor_TypeScript_GenericCompiler(['**/*{.ts,.tsx,.jsx}'], ['**/*{.deprecated,.example,.module,.script,.test}{.ts,.tsx,.jsx}']),
  // Processor_BasicWriter(['**/*{.ts,.tsx,.jsx}'], ['**/*{.deprecated,.example,.module,.script,.test}{.ts,.tsx,.jsx}']),
  //
]);

builder.setAfterProcessingSteps([
  Step_StartServer(),
  //
]);

builder.setCleanupSteps([
  // Update Local Server Files
  Step_MirrorDirectory({ from: 'src/lib/ericchase/', to: 'server/src/lib/ericchase/', include_patterns: ['Platform/FilePath.ts', 'Utility/Console.ts'] }),
  // Update Template Project
  Step_Project_PushLib('../Project@Template'),
  //
]);

await builder.start();
