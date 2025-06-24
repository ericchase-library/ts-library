import { BunPlatform_Glob_Ex_Match } from '../../../src/lib/ericchase/api.platform-bun.js';
import { NodePlatform_PathObject } from '../../../src/lib/ericchase/NodePlatform_PathObject.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

/**
 * @defaults
 * @param include_patterns `[]`
 * @param exclude_patterns `[]`
 * @param config.include_libdir `true`
 */
export function Processor_Set_Writable(patterns: { include_patterns?: string[]; exclude_patterns?: string[] }, config?: Config): Builder.Processor {
  return new Class(patterns.include_patterns ?? [], patterns.exclude_patterns ?? [], config ?? {});
}
class Class implements Builder.Processor {
  ProcessorName = Processor_Set_Writable.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor(
    readonly include_patterns: string[],
    readonly exclude_patterns: string[],
    readonly config: Config,
  ) {
    this.config.include_libdir ??= false;
  }
  async onStartUp(): Promise<void> {
    if (this.config.include_libdir === false) {
      this.exclude_patterns.push(`${Builder.Dir.Lib}/**/*`);
    }
  }
  async onAdd(files: Set<Builder.File>): Promise<void> {
    for (const file of files) {
      const src_path = NodePlatform_PathObject(file.src_path).str('/');
      if (BunPlatform_Glob_Ex_Match(src_path, this.exclude_patterns, []) === true) {
        file.iswritable = false;
        continue;
      }
      if (BunPlatform_Glob_Ex_Match(src_path, this.include_patterns, []) === true) {
        file.iswritable = true;
      }
    }
  }
}
interface Config {
  include_libdir?: boolean;
}
