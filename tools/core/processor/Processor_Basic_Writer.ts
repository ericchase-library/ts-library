import { BunPlatform_Glob_Ex_Match } from '../../../src/lib/ericchase/platform-bun.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

/**
 * Excludes files from `builder.dir.lib` folder by default.
 */
export function Processor_Basic_Writer(include_patterns: string[], exclude_patterns: string[], config?: Config): Builder.Processor {
  return new Class(include_patterns, exclude_patterns, config ?? {});
}
class Class implements Builder.Processor {
  ProcessorName = Processor_Basic_Writer.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor(
    readonly include_patterns: string[],
    readonly exclude_patterns: string[],
    readonly config: Config,
  ) {
    this.config.exclude_libdir ??= true;
  }
  async onStartUp(builder: Builder.Internal): Promise<void> {
    if (this.config.exclude_libdir === true) {
      this.exclude_patterns.push(`${builder.dir.lib}/**/*`);
    }
  }
  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    for (const file of files) {
      if (BunPlatform_Glob_Ex_Match(file.src_path.toStandard(), this.include_patterns, this.exclude_patterns) === true) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    await file.write();
  }
}
interface Config {
  exclude_libdir?: boolean;
}
