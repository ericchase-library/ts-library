import { Core } from '../../../src/lib/ericchase/core.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

type SpawnOptions = NonNullable<Parameters<typeof Bun.spawn>[1]>;

interface Config {
  cmd: string[];
  dir?: string;
  showlogs?: boolean;
  stdin?: SpawnOptions['stdin'];
}

export function Step_Bun_Run(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_Bun_Run.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly config: Config) {
    this.config.dir ??= process.cwd();
    this.config.showlogs ??= true;
    this.config.stdin ??= 'ignore';
  }
  async onRun(builder: Builder.Internal): Promise<void> {
    try {
      const p0 = Bun.spawn(this.config.cmd, { cwd: this.config.dir, stdin: this.config.stdin, stderr: 'pipe', stdout: 'pipe' });
      this.channel.log(`Run Command: "${this.config.cmd.join(' ')}" | Directory: "${this.config.dir}"`);
      await p0.exited;
      this.channel.log(`Command End: "${this.config.cmd.join(' ')}" | Directory: "${this.config.dir}"`);
      if (this.config.showlogs === true) {
        this.channel.errorNotEmpty(Core.Array.Uint8.ToString(await Core.Stream.Uint8.Async_ReadAll(p0.stderr)));
        this.channel.logNotEmpty(Core.Array.Uint8.ToString(await Core.Stream.Uint8.Async_ReadAll(p0.stdout)));
      }
    } catch (error) {
      this.channel.error(`Command: "${this.config.cmd.join(' ')}" | Directory: "${this.config.dir}"`, error);
    }
  }
}
