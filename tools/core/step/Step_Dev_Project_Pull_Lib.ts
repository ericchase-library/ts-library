import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Copy_Files } from './Step_FS_Copy_Files.js';
import { Step_Mirror_Directory } from './Step_FS_Mirror_Directory.js';

export function Step_Dev_Project_Pull_Lib(external_directory: string): Builder.Step {
  return new Class(external_directory);
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Pull_Lib.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(readonly external_directory: string) {}
  async onStartUp(builder: Builder.Internal): Promise<void> {
    this.steps = [
      Step_FS_Copy_Files({
        from: NodePlatform.Path.Join(this.external_directory, 'src/@types'),
        to: NodePlatform.Path.Join(builder.dir.src, '@types'),
        include_patterns: ['**/*.ts'],
        overwrite: true,
      }),
      Step_Mirror_Directory({
        from: NodePlatform.Path.Join(this.external_directory, 'src/lib/ericchase'),
        to: NodePlatform.Path.Join(builder.dir.lib, 'ericchase'),
        include_patterns: ['**/*.ts'],
      }),
      Step_Mirror_Directory({
        from: NodePlatform.Path.Join(this.external_directory, 'tools/lib'),
        to: NodePlatform.Path.Join(builder.dir.tools, 'lib'),
        include_patterns: ['**/*.ts'],
      }),
      Step_FS_Copy_Files({
        from: NodePlatform.Path.Join(this.external_directory, './'),
        to: './',
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
