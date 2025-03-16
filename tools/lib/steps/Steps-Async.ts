import { BuilderInternal, Step } from 'tools/lib/Builder.js';

export function Step_Async(steps: Step[]): Step {
  return new CStep_Async(steps);
}

class CStep_Async implements Step {
  constructor(readonly steps: Step[]) {}
  async run(builder: BuilderInternal) {
    const tasks: Promise<void>[] = [];
    for (const step of this.steps) {
      tasks.push(step.run(builder));
    }
    for (const task of tasks) {
      await task;
    }
  }
}
