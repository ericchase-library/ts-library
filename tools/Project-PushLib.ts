import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';
import { Step_FS_CopyFiles } from 'tools/lib/steps/FS-CopyFiles.js';
import { Step_FS_MirrorDirectory } from 'tools/lib/steps/FS-MirrorDirectory.js';

class CStep_Project_PushLib implements BuildStep {
  constructor(readonly external_directory: CPath) {}
  async run(builder: BuilderInternal) {
    const steps = [
      // Mirror Server
      Step_FS_MirrorDirectory({
        from: 'server',
        to: Path(this.external_directory, 'server'),
        include_patterns: ['**/*'],
        exclude_patterns: ['node_modules/**/*', 'bun.lockb'],
        //
      }),

      // Mirror Lib
      Step_FS_MirrorDirectory({
        from: 'src/lib/ericchase',
        to: Path(this.external_directory, 'src/lib/ericchase'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Mirror Tools Lib
      Step_FS_MirrorDirectory({
        from: 'tools/lib',
        to: Path(this.external_directory, 'tools/lib'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        //
      }),

      // Copy Default Build Scripts
      Step_FS_CopyFiles({
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
      Step_FS_CopyFiles({
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
      ConsoleLogWithDate(step.constructor.name);
      await step.run(builder);
    }
  }
}

export function Step_Project_PushLib(project_dir: CPath | string): BuildStep {
  return new CStep_Project_PushLib(Path(project_dir));
}
