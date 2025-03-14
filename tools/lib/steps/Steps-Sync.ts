import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CStep_Sync implements BuildStep {
  constructor(readonly steps: BuildStep[]) {}
  async run(builder: BuilderInternal) {
    for (const step of this.steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run(builder);
    }
  }
}

export function Step_Sync(steps: BuildStep[]): BuildStep {
  return new CStep_Sync(steps);
}
