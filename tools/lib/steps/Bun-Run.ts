import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ConsoleErrorNotEmpty, ConsoleLogNotEmpty } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';

class CStep_Bun_Run implements BuildStep {
  dir?: string;
  constructor(
    readonly cmd: string[],
    dir?: CPath | string,
    readonly quiet?: boolean,
  ) {
    if (dir) {
      this.dir = Path(dir).raw;
    }
  }
  async run(builder: BuilderInternal) {
    const p0 = Bun.spawnSync(this.cmd, { cwd: this.dir, stderr: 'pipe', stdout: 'pipe' });
    if (this.quiet !== true) {
      ConsoleLogNotEmpty(U8ToString(p0.stdout));
      ConsoleErrorNotEmpty(U8ToString(p0.stderr));
    }
  }
}

export function Step_Bun_Run({ cmd, dir, quiet = false }: { cmd: string[]; dir?: CPath | string; quiet?: boolean }): BuildStep {
  return new CStep_Bun_Run(cmd, dir, quiet);
}
