import { RunSync } from 'src/lib/ericchase/Platform/Bun/Child Process.js';
import { BuildStep } from 'tools/lib/Builder.js';

export class Step_BunInstall implements BuildStep {
  async run() {
    RunSync.Bun('install');
  }
}
