import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { ConsoleError, ConsoleLog, ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { RemoveWhiteSpaceOnlyLines } from 'src/lib/ericchase/Utility/String.js';
import { BuildStep } from 'tools/lib/Builder-Internal.js';

export class Step_Format implements BuildStep {
  async run() {
    {
      // Biome
      const command0 = ['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write'];
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

    // Prettier
    const command1 = ['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write'];
    ConsoleLogWithDate('>', command1.join(' '));
    const process1 = Bun.spawnSync(command1, { stderr: 'pipe', stdout: 'pipe' });
    if (process1.stderr.length > 0) {
      ConsoleError(U8ToString(process1.stderr));
      ConsoleError();
    }
    if (process1.stdout.length > 0) {
      ConsoleLog(RemoveWhiteSpaceOnlyLines(U8ToString(process1.stdout)).join('\n'));
      ConsoleLog();
    }

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
