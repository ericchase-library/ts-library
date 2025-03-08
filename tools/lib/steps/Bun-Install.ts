import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/Builder-Internal.js';

class CBuildStep_BunInstall implements BuildStep {
  async run(builder: BuilderInternal) {
    Bun.spawnSync(['bun', 'install'], { stderr: 'inherit', stdout: 'inherit' });
    ConsoleLog();
  }
}

const cache = new CBuildStep_BunInstall();
export function BuildStep_BunInstall(): BuildStep {
  return cache;
}
