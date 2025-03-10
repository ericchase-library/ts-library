import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { globScan } from 'src/lib/ericchase/Platform/util.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';
import { Cache_IsFileModified } from 'tools/lib/cache/FileStatsCache.js';

class CBuildStep_FSCopy implements BuildStep {
  constructor(
    readonly options: {
      from: CPath;
      to: CPath;
      include_patterns: string[];
      exclude_patterns: string[];
      overwrite: boolean;
    },
  ) {}
  async run(builder: BuilderInternal) {
    for (const path of await globScan(builder.platform, this.options.from, this.options.include_patterns, this.options.exclude_patterns)) {
      const from = Path(this.options.from.raw, path);
      if (Cache_IsFileModified(from).data === true) {
        await builder.platform.File.copy(from, Path(this.options.to.raw, path), this.options.overwrite);
      }
    }
  }
}

export function BuildStep_FSCopy(options: { from: string; to: string; include_patterns?: string[]; exclude_patterns?: string[]; overwrite?: boolean }): BuildStep {
  return new CBuildStep_FSCopy({
    from: Path(options.from),
    to: Path(options.to),
    include_patterns: options.include_patterns ?? ['*'],
    exclude_patterns: options.exclude_patterns ?? [],
    overwrite: options.overwrite ?? false,
  });
}
