import { NodePlatform_Directory_Async_ReadDir, NodePlatform_Path_Join } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Copy_Files } from '../../core/step/Step_FS_Copy_Files.js';
import { Step_FS_Mirror_Directory } from '../../core/step/Step_FS_Mirror_Directory.js';

export function Step_Dev_Project_Sync_Lib(from_directory: string, to_directory: string): Builder.Step {
  return new Class(from_directory, to_directory);
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Sync_Lib.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(
    readonly from_directory: string,
    readonly to_directory: string,
  ) {}
  async onStartUp(builder: Builder.Internal): Promise<void> {
    this.steps = [
      Step_FS_Copy_Files({
        from: NodePlatform_Path_Join(this.from_directory, builder.dir.src, '@types'),
        to: NodePlatform_Path_Join(this.to_directory, builder.dir.src, '@types'),
        include_patterns: ['**/*'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
      }),
      Step_FS_Mirror_Directory({
        from: NodePlatform_Path_Join(this.from_directory, builder.dir.lib, 'ericchase'),
        to: NodePlatform_Path_Join(this.to_directory, builder.dir.lib, 'ericchase'),
        include_patterns: ['**/*'],
        exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
      }),
      // Loose Files
      Step_FS_Copy_Files({
        from: NodePlatform_Path_Join(this.from_directory),
        to: NodePlatform_Path_Join(this.to_directory),
        include_patterns: [
          '.vscode/settings.json',
          '.gitignore',
          '.prettierignore',
          '.prettierrc',
          'index.html',
          'biome.json',
          'package.json',
          'tsconfig.json',
          //
        ],
        overwrite: false,
      }),
      Step_FS_Copy_Files({
        from: NodePlatform_Path_Join(this.from_directory, builder.dir.tools),
        to: NodePlatform_Path_Join(this.to_directory, builder.dir.tools),
        include_patterns: [
          'pull.ts',
          //
        ],
        overwrite: true,
      }),
      // Server
      Step_FS_Mirror_Directory({
        from: NodePlatform_Path_Join(this.from_directory, 'server'),
        to: NodePlatform_Path_Join(this.to_directory, 'server'),
        include_patterns: ['**/*'],
        exclude_patterns: ['.git/**/*', 'node_modules/**/*'],
      }),
    ];
    // Tools
    for (const entry of await NodePlatform_Directory_Async_ReadDir(builder.dir.tools, false)) {
      if (entry.isDirectory()) {
        this.steps.push(
          Step_FS_Mirror_Directory({
            from: NodePlatform_Path_Join(this.from_directory, entry.parentPath, entry.name),
            to: NodePlatform_Path_Join(this.to_directory, entry.parentPath, entry.name),
            include_patterns: ['**/*'],
            exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
          }),
        );
      }
    }

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
