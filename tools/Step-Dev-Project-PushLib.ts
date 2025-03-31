import { CPath, Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Safe$Step$onCleanUp, Safe$Step$onRun, Safe$Step$onStartUp, Step } from './lib/Builder.js';
import { Step_CopyFiles } from './lib/steps/FS-CopyFiles.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';

const logger = Logger(Step_Project_PushLib.name);

export function Step_Project_PushLib(external_directory: CPath | string): Step {
  return new CStep_Project_PushLib(external_directory);
}

class CStep_Project_PushLib implements Step {
  channel = logger.newChannel();

  steps: Step[] = [];

  constructor(readonly external_directory: CPath | string) {}
  async onStartUp(builder: BuilderInternal): Promise<void> {
    this.steps = [
      Step_MirrorDirectory({
        from: Path('src/lib/ericchase'),
        to: Path(this.external_directory, 'src/lib/ericchase'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'], //
      }),
      Step_MirrorDirectory({
        from: Path('tools/lib'),
        to: Path(this.external_directory, 'tools/lib'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'], //
      }),
      Step_CopyFiles({
        from: './',
        to: Path(this.external_directory, './'),
        include_patterns: [
          '.vscode/settings.json',
          '.gitignore',
          '.prettierignore',
          '.prettierrc',
          'biome.json',
          'package.json',
          'tsconfig.json', //
        ],
        overwrite: false,
      }),
    ];
    for (const step of this.steps) {
      await Safe$Step$onStartUp(builder, step);
    }
  }
  async onRun(builder: BuilderInternal): Promise<void> {
    for (const step of this.steps) {
      await Safe$Step$onRun(builder, step);
    }
  }
  async onCleanUp(builder: BuilderInternal): Promise<void> {
    for (const step of this.steps) {
      await Safe$Step$onCleanUp(builder, step);
    }
  }
}
