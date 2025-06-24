import { NodePlatform_Directory_Create_Async } from '../../../src/lib/ericchase/NodePlatform_Directory_Create_Async.js';
import { NodePlatform_Directory_Delete_Async } from '../../../src/lib/ericchase/NodePlatform_Directory_Delete_Async.js';
import { NodePlatform_Path_Join } from '../../../src/lib/ericchase/NodePlatform_Path_Join.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_FS_Clean_Directory(...paths: string[]): Builder.Step {
  return new Class(paths.map((path) => NodePlatform_Path_Join(path)));
}
class Class implements Builder.Step {
  StepName = Step_FS_Clean_Directory.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly paths: string[]) {}
  async onRun(): Promise<void> {
    for (const path of this.paths) {
      if ((await NodePlatform_Directory_Delete_Async(path, true)) === true) {
        if ((await NodePlatform_Directory_Create_Async(path, true)) === true) {
          this.channel.log(`Cleaned "${path}"`);
        }
      }
    }
  }
}
