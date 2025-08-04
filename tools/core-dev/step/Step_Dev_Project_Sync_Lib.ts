import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Async_NodePlatform_Directory_ReadDir } from '../../../src/lib/ericchase/NodePlatform_Directory_ReadDir.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Copy_Files } from '../../core/step/Step_FS_Copy_Files.js';
import { Step_FS_Mirror_Directory } from '../../core/step/Step_FS_Mirror_Directory.js';

export function Step_Dev_Project_Sync_Lib(params: { from: string; to: string }): Builder.Step {
  return new Class(params.from, params.to);
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Sync_Lib.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(
    readonly from: string,
    readonly to: string,
  ) {}
  async onStartUp(): Promise<void> {
    this.steps = [
      Step_FS_Copy_Files({
        from: NODE_PATH.join(this.from, Builder.Dir.Src, '@types'),
        to: NODE_PATH.join(this.to, Builder.Dir.Src, '@types'),
        include_patterns: ['**/*'],
        // exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
      }),
      Step_FS_Mirror_Directory({
        from: NODE_PATH.join(this.from, Builder.Dir.Lib, 'ericchase'),
        to: NODE_PATH.join(this.to, Builder.Dir.Lib, 'ericchase'),
        include_patterns: ['**/*'],
        // exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
      }),
      // Loose Files
      Step_FS_Copy_Files({
        from: NODE_PATH.join(this.from),
        to: NODE_PATH.join(this.to),
        include_patterns: [
          '.vscode/settings.json',
          '.gitignore',
          '.prettierignore',
          '.prettierrc',
          'index.html',
          // 'biome.json',
          'package.json',
          'tsconfig.json',
          //
        ],
        overwrite: false,
      }),
      Step_FS_Copy_Files({
        from: NODE_PATH.join(this.from, Builder.Dir.Tools),
        to: NODE_PATH.join(this.to, Builder.Dir.Tools),
        include_patterns: [
          'pull.ts',
          //
        ],
        overwrite: true,
      }),
      // Server
      Step_FS_Mirror_Directory({
        from: NODE_PATH.join(this.from, 'server'),
        to: NODE_PATH.join(this.to, 'server'),
        include_patterns: ['**/*'],
        exclude_patterns: ['.git/**/*', 'node_modules/**/*'],
      }),
    ];
    // Tools
    const { value: entries } = await Async_NodePlatform_Directory_ReadDir(Builder.Dir.Tools, false);
    for (const entry of entries ?? []) {
      if (entry.isDirectory()) {
        this.steps.push(
          Step_FS_Mirror_Directory({
            from: NODE_PATH.join(this.from, entry.parentPath, entry.name),
            to: NODE_PATH.join(this.to, entry.parentPath, entry.name),
            include_patterns: ['**/*'],
            // exclude_patterns: ['**/*{.deprecated,.example,.test}.ts'],
          }),
        );
      }
    }

    for (const step of this.steps) {
      await step.onStartUp?.();
    }
  }
  async onRun(): Promise<void> {
    for (const step of this.steps) {
      await step.onRun?.();
    }
  }
  async onCleanUp(): Promise<void> {
    for (const step of this.steps) {
      await step.onCleanUp?.();
    }
  }
}
