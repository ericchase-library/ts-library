import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { ConsoleError, ConsoleLog, ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { RemoveWhiteSpaceOnlyLines } from 'src/lib/ericchase/Utility/String.js';
import { BuildStep } from 'tools/lib/Builder-Internal.js';

export class Step_BunInstall implements BuildStep {
  async run() {
    const command0 = ['bun', 'install'];
    ConsoleLogWithDate('>', command0.join(' '));
    const process0 = Bun.spawnSync(command0, { stderr: 'pipe', stdout: 'pipe' });
    if (process0.stderr.length > 0) {
      ConsoleError(U8ToString(process0.stderr));
      ConsoleError();
    }
    if (process0.stdout.length > 0) {
      ConsoleLog(RemoveWhiteSpaceOnlyLines(U8ToString(process0.stdout)).join('\n'));
      ConsoleLog();
    }
  }
}
