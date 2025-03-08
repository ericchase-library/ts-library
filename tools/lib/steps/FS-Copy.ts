import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { BuilderInternal, BuildStep } from 'tools/lib/Builder-Internal.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';
import { globScan } from 'tools/lib/platform/utility.js';

class CBuildStep_FSCopy implements BuildStep {
  constructor(
    readonly options: {
      from: SimplePath;
      to: SimplePath;
      include_patterns: string[];
      exclude_patterns: string[];
      overwrite: boolean;
    },
  ) {}
  async run(builder: BuilderInternal) {
    for (const path of await globScan(builder.platform, this.options.from, this.options.include_patterns, this.options.exclude_patterns)) {
      await builder.platform.File.copy(new SimplePath(this.options.from.raw, path), new SimplePath(this.options.to.raw, path), this.options.overwrite);
    }
  }
}

const cache = new Map<string, BuildStep>();
export function BuildStep_FSCopy(options: { from: string; to: string; include_patterns?: string[]; exclude_patterns?: string[]; overwrite?: boolean }): BuildStep {
  const _options = {
    from: new SimplePath(options.from),
    to: new SimplePath(options.to),
    include_patterns: options.include_patterns ?? ['*'],
    exclude_patterns: options.exclude_patterns ?? [],
    overwrite: options.overwrite ?? false,
  };
  return Map_GetOrDefault(
    cache,
    `${_options.from.standard}|${_options.to.standard}|${_options.include_patterns.join(',')}|${_options.exclude_patterns.join(',')}`,
    () => new CBuildStep_FSCopy(_options),
    //
  );
}
