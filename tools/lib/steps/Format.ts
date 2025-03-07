import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { BuildStep } from 'tools/lib/Builder.js';

export class Step_Format implements BuildStep {
  async run() {
    {
      console.log('>', ['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write'].join(' '));
      const { stderr, stdout } = Bun.spawnSync(['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write'], { stderr: 'pipe', stdout: 'pipe' });
      if (stderr.length > 0) {
        console.log(U8ToString(stderr));
        console.log();
      }
      if (stdout.length > 0) {
        console.log(U8ToString(stdout));
        console.log();
      }
    }
    // --debug-check
    // --log-level silent|debug
    {
      console.log('>', ['prettier', './**/*.{html,md}', '--write'].join(' '));
      const { stderr, stdout } = Bun.spawnSync(['prettier', './**/*.{html,md}', '--write'], { stderr: 'pipe', stdout: 'pipe' });
      if (stderr.length > 0) {
        console.log(U8ToString(stderr));
        console.log();
      }
      if (stdout.length > 0) {
        console.log(U8ToString(stdout));
        console.log();
      }
    }
  }
}
