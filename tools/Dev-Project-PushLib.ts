import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { Step } from 'tools/lib/Step.js';
import { Step_CopyFiles } from 'tools/lib/steps/FS-CopyFiles.js';
import { Step_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';

const logger = Logger(__filename, Step_Project_PushLib.name);

export function Step_Project_PushLib(project_dir: CPath | string): Step {
  return new CStep_Project_PushLib(Path(project_dir));
}

class CStep_Project_PushLib implements Step {
  logger = logger.newChannel();
  constructor(readonly external_directory: CPath) {}
  async run(builder: BuilderInternal) {
    this.logger.logWithDate(this.constructor.name);
    const steps = [
      // Mirror Server
      Step_MirrorDirectory({
        from: 'server',
        to: Path(this.external_directory, 'server'),
        include_patterns: ['**/*'],
        exclude_patterns: ['node_modules/**/*', 'bun.lockb'],
        //
      }),

      // Mirror Lib
      Step_MirrorDirectory({
        from: 'src/lib/ericchase',
        to: Path(this.external_directory, 'src/lib/ericchase'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Mirror Tools Lib
      Step_MirrorDirectory({
        from: 'tools/lib',
        to: Path(this.external_directory, 'tools/lib'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Copy Default Build Scripts
      Step_CopyFiles({
        from: 'tools',
        to: Path(this.external_directory, 'tools'),
        include_patterns: [
          'build.ts',
          'pull.ts',
          //
        ],
        overwrite: false,
      }),

      // Copy Root Files
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
        overwrite: false,
      }),
    ];
    for (const step of steps) {
      await step.run(builder);
    }
  }
}
