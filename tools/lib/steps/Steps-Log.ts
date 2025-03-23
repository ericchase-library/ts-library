import { Logger } from '../../../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from '../Builder.js';

const logger = Logger(Step_Log.name);

export function Step_Log(...items: any[]): Step {
  return new CStep_Log(items);
}

class CStep_Log implements Step {
  constructor(readonly items: any[]) {}
  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    logger.log(...this.items);
  }
}
