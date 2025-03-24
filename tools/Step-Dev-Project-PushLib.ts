import { CPath, Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';
import { Step_CopyFiles } from './lib/steps/FS-CopyFiles.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';

const logger = Logger(Step_Project_PushLib.name);

export function Step_Project_PushLib(project_dir: CPath | string, overwrite = false): Step {
  return new CStep_Project_PushLib(Path(project_dir), overwrite);
}

class CStep_Project_PushLib implements Step {
  channel = logger.newChannel();

  constructor(
    readonly external_directory: CPath,
    readonly overwrite = false,
  ) {}
  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    this.channel.log('Push Lib');
    const steps = [
      Step_MirrorDirectory({
        from: Path('src/lib/ericchase'),
        to: Path(this.external_directory, 'src/lib/ericchase'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),
      Step_MirrorDirectory({
        from: Path('tools/lib'),
        to: Path(this.external_directory, 'tools/lib'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),
      Step_CopyFiles({
        from: './',
        to: Path(this.external_directory, './'),
        include_patterns: [
          '.gitignore',
          '.prettierignore',
          '.prettierrc',
          'biome.json',
          'package.json',
          'tsconfig.json',
          //
        ],
        overwrite: this.overwrite,
      }),
    ];
    for (const step of steps) {
      await step.run(builder);
    }
  }
}
