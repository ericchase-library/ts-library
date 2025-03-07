import { Builder } from 'tools/lib/Builder.js';
import { ProjectManager } from 'tools/lib/ProjectManager.js';
import { Step_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { Step_Format } from 'tools/lib/steps/Format.js';

const manager = new ProjectManager({ out_dir: 'out', src_dir: 'src' }, { runtime: 'bun' });

const builder = new Builder(manager, {
  init_steps: [
    new Step_BunInstall(),
    // new Step_CleanDirectory([manager.out_dir]),
    new Step_Format(),
    //
  ],
  processors: [
    // new Processor_HTMLCustomComponent(),
    // new Processor_HTMLImportConverter(),
    // new Processor_TypeScriptGenericBundler({ sourcemap: 'none', target: 'bun' }),
    // new Processor_TypeScriptGenericBundlerImportRemapper(),
    // new Processor_IOBasicWriter(),
    //
  ],
});

await builder.start();
