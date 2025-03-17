import { U8StreamReadAll } from 'src/lib/ericchase/Algorithm/Stream.js';
import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from 'tools/lib/Builder.js';

const logger = Logger(__filename, Step_Lint.name);

export function Step_Lint(logging?: 'quiet'): Step {
  return new CStep_Lint(logging ?? 'normal');
}

class CStep_Lint implements Step {
  logger = logger.newChannel();

  constructor(readonly logging: 'normal' | 'quiet') {}
  async run(builder: BuilderInternal) {
    this.logger.logWithDate();
    const p0 = Bun.spawn(['biome', 'lint', '--error-on-warnings', '--write'], { stderr: 'pipe', stdout: 'pipe' });
    await Promise.allSettled([p0.exited]);
    if (this.logging === 'normal') {
      this.logger.log('> biome lint --error-on-warnings --write');
      this.logger.logNotEmpty(U8ToString(await U8StreamReadAll(p0.stdout)));
      this.logger.errorNotEmpty(U8ToString(await U8StreamReadAll(p0.stderr)));
    }
  }
}
