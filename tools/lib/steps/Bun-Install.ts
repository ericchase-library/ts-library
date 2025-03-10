import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CBuildStep_BunInstall implements BuildStep {
  async run(builder: BuilderInternal) {
    Bun.spawnSync(['bun', 'install'], { stderr: 'inherit', stdout: 'inherit' });
    ConsoleLog();
  }
}

export function BuildStep_BunInstall(): BuildStep {
  return new CBuildStep_BunInstall();
}
