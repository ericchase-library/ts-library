import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Copy_Files } from '../../core/step/Step_FS_Copy_Files.js';
import { Step_Mirror_Directory } from '../../core/step/Step_FS_Mirror_Directory.js';

export function Step_Dev_Project_Push_Lib(external_directory: string): Builder.Step {
  return new Class(NodePlatform.Path.Join(external_directory));
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Push_Lib.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(readonly external_directory: string) {}
  async onStartUp(builder: Builder.Internal): Promise<void> {
    const MirrorCodeDirectory = (path: string) => {
      return Step_Mirror_Directory({
        from: path,
        to: NodePlatform.Path.Join(this.external_directory, path),
        include_patterns: ['**/*'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
      });
    };

    this.steps = [
      Step_Mirror_Directory({
        from: 'server',
        to: NodePlatform.Path.Join(this.external_directory, 'server'),
        include_patterns: ['**/*'],
        exclude_patterns: ['.git/**/*', 'node_modules/**/*', 'bun.lock'],
      }),
      Step_FS_Copy_Files({
        from: 'src/@types',
        to: NodePlatform.Path.Join(this.external_directory, 'src/@types'),
        include_patterns: ['**/*.ts'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
        overwrite: true,
      }),
      MirrorCodeDirectory('src/lib/ericchase'),
      MirrorCodeDirectory('tools/core'),
      MirrorCodeDirectory('tools/lib-web'),
      Step_FS_Copy_Files({
        from: './',
        to: NodePlatform.Path.Join(this.external_directory, './'),
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
      await step.onStartUp?.(builder);
    }
  }
  async onRun(builder: Builder.Internal): Promise<void> {
    for (const step of this.steps) {
      await step.onRun?.(builder);
    }
  }
  async onCleanUp(builder: Builder.Internal): Promise<void> {
    for (const step of this.steps) {
      await step.onCleanUp?.(builder);
    }
  }
}
