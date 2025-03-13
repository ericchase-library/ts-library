import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { globScan } from 'src/lib/ericchase/Platform/util.js';
import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
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
      const from = Path(this.options.from, path);
      const result = await Cache_IsFileModified(from);
      if (result.data === true) {
        const to = Path(this.options.to, path);
        if ((await builder.platform.File.copy(from, to, this.options.overwrite)) === true) {
          ConsoleLog(`Copied "${from.raw}" -> "${to.raw}"`);
        }
      } else if (result.error !== undefined) {
        throw result.error;
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
