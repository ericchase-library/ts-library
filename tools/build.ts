import { Builder } from 'tools/lib/Builder.js';
import { Processor_HTMLCustomComponent } from 'tools/lib/processors/HTML-Custom-Component.js';
import { Processor_HTMLImportConverter } from 'tools/lib/processors/HTML-Import-Converter.js';
import { Processor_IOBasicWriter } from 'tools/lib/processors/IO-Basic-Writer.js';
import { Processor_TypeScriptGenericBundlerImportRemapper } from 'tools/lib/processors/TypeScript-Generic-Bundler-Import-Remapper.js';
import { Processor_TypeScriptGenericBundler } from 'tools/lib/processors/TypeScript-Generic-Bundler.js';
import { ProjectManager } from 'tools/lib/ProjectManager.js';
import { Step_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { Step_CleanDirectory } from 'tools/lib/steps/Clean-Directory.js';
import { Step_Format } from 'tools/lib/steps/Format.js';

const manager = new ProjectManager({ out_dir: 'out', src_dir: 'src' }, { runtime: 'bun' });

const builder = new Builder(manager, {
  init_steps: [
    new Step_BunInstall(),
    new Step_CleanDirectory([manager.out_dir]),
    new Step_Format(),
    //
  ],
  processors: [
    new Processor_HTMLCustomComponent(),
    new Processor_HTMLImportConverter(),
    new Processor_TypeScriptGenericBundler({ sourcemap: 'none', target: 'bun' }),
    new Processor_TypeScriptGenericBundlerImportRemapper(),
    new Processor_IOBasicWriter(),
    //
  ],
});

await builder.start();
