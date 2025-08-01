import { Subprocess } from 'bun';
import { Core_Promise_Orphan } from '../../../src/lib/ericchase/Core_Promise_Orphan.js';
import { Async_Core_Stream_Uint8_Read_Lines } from '../../../src/lib/ericchase/Core_Stream_Uint8_Read_Lines.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { NodePlatform_Shell_StdIn_AddListener } from '../../../src/lib/ericchase/NodePlatform_Shell_StdIn.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export let DEVSERVERHOST = '127.0.0.1:8000';

/** An AfterProcessingStep for running the dev server. */
export function Step_Dev_Server(): Builder.Step {
  return new Class();
}
class Class implements Builder.Step {
  StepName = Step_Dev_Server.name;
  channel = Logger(this.StepName).newChannel();

  hotreload_enabled = true;
  process_server?: Subprocess<'ignore', 'pipe', 'pipe'>;

  async onStartUp(): Promise<void> {
    if (Builder.GetMode() !== Builder.MODE.DEV) return;

    this.channel.log('Start Server');
    const p0 = Bun.spawn(['bun', 'run', 'server/tools/start.ts'], {
      env: { ...process.env, PUBLIC_PATH: NODE_PATH.join('..', Builder.Dir.Out) },
      stderr: 'pipe',
      stdout: 'pipe',
    });
    const [stdout, stdout_tee] = p0.stdout.tee();
    // wait for server to finish starting up
    // grab host and setup listener to toggle hot reloading
    await Async_Core_Stream_Uint8_Read_Lines(stdout_tee, (line) => {
      if (line.startsWith('Serving at')) {
        DEVSERVERHOST = new URL(line.slice('Serving at'.length).trim()).host;
      } else if (line.startsWith('Console at')) {
        NodePlatform_Shell_StdIn_AddListener((bytes, text) => {
          if (text === 'h') {
            this.hotreload_enabled = !this.hotreload_enabled;
            if (this.hotreload_enabled === true) {
              this.channel.log("Hot Refresh On    (Press 'h' to toggle.)");
            } else {
              this.channel.log("Hot Refresh Off   (Press 'h' to toggle.)");
            }
          }
        });
        this.channel.log("Hot Refresh On    (Press 'h' to toggle.)");
        return false;
      }
    });
    Core_Promise_Orphan(Async_Core_Stream_Uint8_Read_Lines(p0.stderr, (line) => this.channel.error(line)));
    Core_Promise_Orphan(Async_Core_Stream_Uint8_Read_Lines(stdout, (line) => this.channel.log(line)));
    this.process_server = p0;
  }
  async onRun(): Promise<void> {
    if (this.process_server !== undefined && this.hotreload_enabled === true) {
      fetch(`http://${DEVSERVERHOST}/server/reload`)
        .then(() => {
          // a reminder to dev that the server is running
          this.channel.log(`Serving at http://${DEVSERVERHOST}/`);
          this.channel.log(`Console at http://${DEVSERVERHOST}/console`);
        })
        .catch((error) => {
          this.channel.error(error);
        });
    }
  }
  async onCleanUp(): Promise<void> {
    this.process_server?.kill(0); // 0 is important here
    this.process_server = undefined;
  }
}
