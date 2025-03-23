import { CPath, Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';
import { Step_CopyFiles } from './lib/steps/FS-CopyFiles.js';
import { Step_MirrorDirectory } from './lib/steps/FS-MirrorDirectory.js';

const logger = Logger(Step_Project_PushLib.name);

export function Step_Project_PushLib(project_dir: CPath | string): Step {
  return new CStep_Project_PushLib(Path(project_dir));
}

class CStep_Project_PushLib implements Step {
  channel = logger.newChannel();

  constructor(readonly external_directory: CPath) {}
  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    this.channel.log('Push Lib');
    const steps = [
      // Mirror Database
      Step_MirrorDirectory({
        from: 'database',
        to: Path(this.external_directory, 'database'),
        include_patterns: ['**/*'],
        //
      }),

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
        from: Path(builder.dir.lib, 'database'),
        to: Path(this.external_directory, 'src/lib/database'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),
      Step_MirrorDirectory({
        from: Path(builder.dir.lib, 'ericchase'),
        to: Path(this.external_directory, 'src/lib/ericchase'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),
      Step_MirrorDirectory({
        from: Path(builder.dir.lib, 'server'),
        to: Path(this.external_directory, 'src/lib/server'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Mirror Tools Lib
      Step_MirrorDirectory({
        from: Path(builder.dir.tools, 'lib'),
        to: Path(this.external_directory, 'tools/lib'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Copy Example Build Scripts
      Step_CopyFiles({
        from: Path(builder.dir.tools),
        to: Path(this.external_directory, 'tools/lib/examples'),
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
