import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_Bun_Run } from '../../core/step/Step_Bun_Run.js';

export function Step_Dev_Lint(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_Dev_Lint.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly config: Config) {
    this.config.showlogs ??= true;
  }
  async onRun(builder: Builder.Internal): Promise<void> {
    await Step_Bun_Run({ cmd: ['biome', 'lint', '--error-on-warnings', '--write'], showlogs: this.config.showlogs }).onRun?.(builder);
  }
}
interface Config {
  showlogs?: boolean;
}
