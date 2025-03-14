import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CStep_FS_CleanDirectory implements BuildStep {
  constructor(readonly paths: CPath[]) {}
  async run(builder: BuilderInternal) {
    ConsoleLogWithDate(this.constructor.name);
    for (const path of this.paths) {
      await builder.platform.Directory.delete(path);
      await builder.platform.Directory.create(path);
    }
  }
}

export function Step_FS_CleanDirectory(paths: (CPath | string)[]): BuildStep {
  return new CStep_FS_CleanDirectory(paths.map((path) => Path(path)));
}
