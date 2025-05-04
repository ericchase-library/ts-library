import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_Async(steps: Builder.Step[]): Builder.Step {
  return new Class(steps);
}
class Class implements Builder.Step {
  StepName = Step_Async.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly steps: Builder.Step[]) {}
  async onStartUp(builder: Builder.Internal): Promise<void> {
    const tasks: Promise<void>[] = [];
    for (const step of this.steps) {
      if (step.onStartUp) {
        tasks.push(step.onStartUp(builder));
      }
    }
    await Promise.allSettled(tasks);
  }
  async onRun(builder: Builder.Internal): Promise<void> {
    const tasks: Promise<void>[] = [];
    for (const step of this.steps) {
      if (step.onRun) {
        tasks.push(step.onRun(builder));
      }
    }
    await Promise.allSettled(tasks);
  }
  async onCleanUp(builder: Builder.Internal): Promise<void> {
    const tasks: Promise<void>[] = [];
    for (const step of this.steps) {
      if (step.onCleanUp) {
        tasks.push(step.onCleanUp(builder));
      }
    }
    await Promise.allSettled(tasks);
  }
}
