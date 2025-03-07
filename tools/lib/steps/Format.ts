import { RunSync } from 'src/lib/ericchase/Platform/Bun/Child Process.js';
import { BuildStep } from 'tools/lib/Builder.js';

export class Step_Format implements BuildStep {
  async run() {
    RunSync.Bun('biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write');
    // --debug-check
    // --log-level silent|debug
    RunSync.Bun('prettier', './**/*.{html,md}', '--write');
  }
}
