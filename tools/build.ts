import { Builder } from 'tools/lib/Builder.js';
import { Step_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { Step_Format } from 'tools/lib/steps/Format.js';

const builder = new Builder();

builder.setStartupSteps([
  new Step_BunInstall(),
  new Step_Format(),
  //
]);

builder.setProcessorModules([
  // Processor_Test(),
  //
]);

await builder.start();
