import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Processor_Basic_Writer(include_patterns: string[], exclude_patterns: string[]): Builder.Processor {
  return new Class(include_patterns, exclude_patterns);
}
class Class implements Builder.Processor {
  ProcessorName = Processor_Basic_Writer.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor(
    readonly include_patterns: string[],
    readonly exclude_patterns: string[],
  ) {}
  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    for (const file of files) {
      if (BunPlatform.Glob.Ex.Match(file.src_path.toStandard(), this.include_patterns, this.exclude_patterns) === true) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    await file.write();
  }
}
