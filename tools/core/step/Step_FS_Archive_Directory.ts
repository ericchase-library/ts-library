import AdmZip from 'adm-zip';
import { NodePlatform_Path_GetStats_Async } from '../../../src/lib/ericchase/NodePlatform_Path_GetStats_Async.js';
import { NodePlatform_Path_Join } from '../../../src/lib/ericchase/NodePlatform_Path_Join.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_FS_Archive_Directory(dir: string, outfile: string): Builder.Step {
  return new Class(NodePlatform_Path_Join(dir), NodePlatform_Path_Join(outfile));
}
class Class implements Builder.Step {
  StepName = Step_FS_Archive_Directory.name;
  channel = Logger(this.StepName).newChannel();

  constructor(
    readonly dir: string,
    readonly outpath: string,
  ) {}
  async onRun(): Promise<void> {
    try {
      const zip_instance = new AdmZip();
      zip_instance.addLocalFolder(this.dir);
      zip_instance.writeZip(this.outpath);
      const stats = await NodePlatform_Path_GetStats_Async(this.outpath);
      if (stats.isFile() === true) {
        this.channel.log(`ZIP: [${stats.size}] ${this.outpath}`);
      }
    } catch (error) {
      this.channel.log(`Error while creating archive for "${this.dir}".`);
      throw error;
    }
  }
}
