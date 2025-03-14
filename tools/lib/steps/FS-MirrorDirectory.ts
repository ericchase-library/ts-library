import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { globScan } from 'src/lib/ericchase/Platform/util.js';
import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { Cache_IsFileModified } from 'tools/lib/cache/FileStatsCache.js';
import { Step } from 'tools/lib/Step.js';

// !! WARNING: This can DELETE entire directories. Use with caution!!

const logger = Logger(__filename, Step_MirrorDirectory.name);

export function Step_MirrorDirectory(options: { from: CPath | string; to: CPath | string; include_patterns?: string[]; exclude_patterns?: string[] }): Step {
  return new CStep_MirrorDirectory({
    from: Path(options.from),
    to: Path(options.to),
    include_patterns: options.include_patterns ?? ['*'],
    exclude_patterns: options.exclude_patterns ?? [],
  });
}

class CStep_MirrorDirectory implements Step {
  logger = logger.newChannel();
  constructor(
    readonly options: {
      from: CPath;
      to: CPath;
      include_patterns: string[];
      exclude_patterns: string[];
    },
  ) {}
  async run(builder: BuilderInternal) {
    this.logger.logWithDate();
    try {
      await builder.platform.Path.getStats(this.options.from);
    } catch (error) {
      throw new Error(`The "from" path ("${this.options.from.raw}") does not exist.`);
    }
    await builder.platform.Directory.create(this.options.to);
    const set_from = await globScan(builder.platform, this.options.from, this.options.include_patterns, this.options.exclude_patterns);
    const set_to = await globScan(builder.platform, this.options.to, ['**/*'], []);
    // remove all files that shouldn't be
    for (const path of set_to.difference(set_from)) {
      const from = Path(this.options.from, path);
      const to = Path(this.options.to, path);
      if ((await builder.platform.File.delete(to)) === true) {
        this.logger.log(`Deleted "${from.raw}" -> "${to.raw}"`);
      }
    }
    // copy all files that are missing
    for (const path of set_from.difference(set_to)) {
      const from = Path(this.options.from, path);
      const to = Path(this.options.to, path);
      await Cache_IsFileModified(from);
      if ((await builder.platform.File.copy(from, to, true)) === true) {
        this.logger.log(`Copied "${from.raw}" -> "${to.raw}"`);
      }
    }
    // check matching files for modification
    for (const path of set_from.intersection(set_to)) {
      const from = Path(this.options.from, path);
      const result = await Cache_IsFileModified(from);
      if (result.data === true) {
        const to = Path(this.options.to, path);
        if ((await builder.platform.File.copy(from, to, true)) === true) {
          this.logger.log(`Replaced "${from.raw}" -> "${to.raw}"`);
        }
      } else if (result.error !== undefined) {
        throw result.error;
      }
    }
  }
}
