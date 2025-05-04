import AdmZip from 'adm-zip';
import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_FS_Archive_Directory(dir: string, outfile: string): Builder.Step {
  return new Class(NodePlatform.Path.Join(dir), NodePlatform.Path.Join(outfile));
}
class Class implements Builder.Step {
  StepName = Step_FS_Archive_Directory.name;
  channel = Logger(this.StepName).newChannel();

  constructor(
    readonly dir: string,
    readonly outpath: string,
  ) {}
  async onRun(builder: Builder.Internal): Promise<void> {
    try {
      const zip_instance = new AdmZip();
      zip_instance.addLocalFolder(this.dir);
      zip_instance.writeZip(this.outpath);
      const stats = await NodePlatform.Path.Async_GetStats(this.outpath);
      if (stats.isFile() === true) {
        this.channel.log(`ZIP: [${stats.size}] ${this.outpath}`);
      }
    } catch (error) {
      this.channel.log(`Error while creating archive for "${this.dir}".`);
      throw error;
    }
  }
}
