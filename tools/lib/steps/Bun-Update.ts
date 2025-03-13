import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { ConsoleErrorNotEmpty, ConsoleLogNotEmpty } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CBuildStep_BunUpdate implements BuildStep {
  constructor(readonly mode: 'normal' | 'quiet') {}
  async run(builder: BuilderInternal) {
    const p0 = Bun.spawnSync(['bun', 'update'], { stderr: 'pipe', stdout: 'pipe' });
    if (this.mode === 'normal') {
      ConsoleLogNotEmpty(U8ToString(p0.stdout));
      ConsoleErrorNotEmpty(U8ToString(p0.stderr));
    }
  }
}

export function BuildStep_BunUpdate(mode?: 'quiet'): BuildStep {
  return new CBuildStep_BunUpdate(mode ?? 'normal');
}
