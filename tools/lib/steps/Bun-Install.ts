import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { RemoveWhiteSpaceOnlyLines } from 'src/lib/ericchase/Utility/String.js';
import { BuildStep } from 'tools/lib/Builder.js';

export class Step_BunInstall implements BuildStep {
  async run() {
    {
      console.log('>', ['bun', 'install'].join(' '));
      const { stderr, stdout } = Bun.spawnSync(['bun', 'install'], { stderr: 'pipe', stdout: 'pipe' });
      if (stderr.length > 0) {
        console.log(U8ToString(stderr));
        console.log();
      }
      if (stdout.length > 0) {
        console.log(RemoveWhiteSpaceOnlyLines(U8ToString(stdout)).join('\n'));
        console.log();
      }
    }
  }
}
