import { U8StreamReadAll } from 'src/lib/ericchase/Algorithm/Stream.js';
import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/Builder-Internal.js';

class CBuildStep_IOFormat implements BuildStep {
  async run(builder: BuilderInternal) {
    const p0 = Bun.spawn(['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write'], { stderr: 'pipe', stdout: 'pipe' });
    const p1 = Bun.spawn(['prettier', '**/*.{html,md,yaml}', '--write'], { stderr: 'pipe', stdout: 'pipe' });
    await Promise.allSettled([p0.exited, p1.exited]);
    ConsoleLog(U8ToString(await U8StreamReadAll(p0.stdout)));
    ConsoleLog(U8ToString(await U8StreamReadAll(p0.stderr)));
    ConsoleLog(U8ToString(await U8StreamReadAll(p1.stdout)));
    ConsoleLog(U8ToString(await U8StreamReadAll(p1.stderr)));
    ConsoleLog();
  }
}

const cache = new CBuildStep_IOFormat();
export function BuildStep_IOFormat(): BuildStep {
  return cache;
}
