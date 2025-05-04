import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_FS_Clean_Directory(...paths: string[]): Builder.Step {
  return new Class(paths.map((path) => NodePlatform.Path.Join(path)));
}
class Class implements Builder.Step {
  StepName = Step_FS_Clean_Directory.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly paths: string[]) {}
  async onRun(builder: Builder.Internal): Promise<void> {
    for (const path of this.paths) {
      if ((await NodePlatform.Directory.Async_Delete(path, true)) === true) {
        if ((await NodePlatform.Directory.Async_Create(path, true)) === true) {
          this.channel.log(`Cleaned "${path}"`);
        }
      }
    }
  }
}
