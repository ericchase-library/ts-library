import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/Builder-Internal.js';

class CBuildStep_BunUpdate implements BuildStep {
  async run(builder: BuilderInternal) {
    Bun.spawnSync(['bun', 'update'], { stderr: 'inherit', stdout: 'inherit' });
    ConsoleLog();
  }
}

const cache = new CBuildStep_BunUpdate();
export function BuildStep_BunUpdate(): BuildStep {
  return cache;
}
