import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

type Options = Bun.TranspilerOptions;
interface Config {
  define?: Options['define'] | (() => Options['define']);
  target?: Options['target'];
}

export function Processor_TypeScript_Generic_Transpiler(include_patterns: string[], exclude_patterns: string[], config: Config): Builder.Processor {
  return new Class(include_patterns, exclude_patterns, config);
}
class Class implements Builder.Processor {
  ProcessorName = Processor_TypeScript_Generic_Transpiler.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor(
    readonly include_patterns: string[],
    readonly exclude_patterns: string[],
    readonly config: Config,
  ) {}
  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    for (const file of files) {
      if (BunPlatform.Glob.Ex.Match(file.src_path.toStandard(), this.include_patterns, this.exclude_patterns) === true) {
        file.out_path.value = NodePlatform.Path.NewExtension(file.out_path.value, '.js');
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    try {
      const text = await file.getText();
      const transpiled_text = await new Bun.Transpiler({
        define: typeof this.config.define === 'function' ? this.config.define() : this.config.define,
        loader: 'tsx',
        target: this.config.target ?? 'browser',
        // disable any altering processes
        deadCodeElimination: false,
        inline: false,
        jsxOptimizationInline: false,
        minifyWhitespace: false,
        treeShaking: false,
        // necessary to remove type imports
        trimUnusedImports: true,
      }).transform(text);
      file.setText(transpiled_text);
    } catch (error) {
      this.channel.error(`ERROR: Builder.Processor: ${__filename}, File: ${file.src_path.value}`, error);
    }
  }
}
