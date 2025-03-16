import { default as AdmZip } from 'adm-zip';
import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from 'tools/lib/Builder.js';

const logger = Logger(__filename, Step_ArchiveDirectory.name);

export function Step_ArchiveDirectory(dir: CPath | string, outfile: CPath | string): Step {
  return new CStep_ArchiveDirectory(Path(dir), Path(outfile));
}

class CStep_ArchiveDirectory implements Step {
  logger = logger.newChannel();

  zip = new AdmZip();

  constructor(
    readonly dir: CPath,
    readonly outpath: CPath,
  ) {}
  async run(builder: BuilderInternal) {
    this.logger.logWithDate();
    try {
      this.zip.addLocalFolder(this.dir.raw);
      this.zip.writeZip(this.outpath.raw);
      const stats = await builder.platform.Path.getStats(this.outpath);
      if (stats.isFile() === true) {
        this.logger.log(`ZIP: [${stats.size}] ${this.outpath.raw}`);
      }
    } catch (error) {
      this.logger.log(`Error while creating archive for "${this.dir.raw}".`);
      throw error;
    }
  }
}
