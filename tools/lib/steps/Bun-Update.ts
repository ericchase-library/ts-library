import { RunSync } from 'src/lib/ericchase/Platform/Bun/Child Process.js';
import { BuildStep } from 'tools/lib/Builder.js';

export class Step_BunUpdate implements BuildStep {
  async run() {
    RunSync.Bun('update');
  }
}
