import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CBuildStep_BunUpdate implements BuildStep {
  async run(builder: BuilderInternal) {
    Bun.spawnSync(['bun', 'update'], { stderr: 'inherit', stdout: 'inherit' });
    ConsoleLog();
  }
}

export function BuildStep_BunUpdate(): BuildStep {
  return new CBuildStep_BunUpdate();
}
