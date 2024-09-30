import { JSONGet } from '../src/Algorithm/JSON.js';
import { RunSync } from '../src/Platform/Bun/Child Process.js';
import { Path } from '../src/Platform/Node/Path.js';
import { StdinRawModeReader } from '../src/Platform/Node/Process.js';
import { KEYS } from '../src/Platform/Node/Shell.js';
import { ConsoleError, GetConsoleMark } from '../src/Utility/Console.js';
import { PrepareHelpMessage } from '../src/Utility/Help.js';
import { TryLock } from './lib/cache/LockCache.js';

export const command_map = {
  build: 'build.ts',
  dev: 'dev.ts',
  format: 'format.ts',
  move: 'move-deprecated.ts',
  watch: 'watch.ts',
};

if (Bun.argv[1] === __filename) {
  const command = Bun.argv.at(2);
  const command_args = Bun.argv.slice(3);

  const scripts_dir = new Path('./tools/scripts/');

  if (command === undefined || command.trim() === 'watch') {
    const stdin = new StdinRawModeReader();

    // CLI: Force Quit Watcher
    stdin.addHandler(async (text) => {
      if (text === KEYS.SIGINT) {
        await stdin.stop();
        watcher_process.stdin.write(`${KEYS.SIGINT}`);
        await Bun.sleep(25);
        watcher_process.kill();
        await watcher_process.exited;
        process.exit();
      }
    });

    TryLock(command_map.dev);

    function run_watcher() {
      return Bun.spawn(['bun', scripts_dir.join(command_map.watch).path], { stdin: 'pipe', stdout: 'inherit' });
    }

    let watcher_process = run_watcher();

    stdin.addHandler(async (text, actions) => {
      const q = text === 'q';
      const r = text === 'r';
      const b = text === 'b';

      if (q || r || b) {
        ConsoleError('Waiting for Watcher to Exit');
        actions.stopHandlerChain();
        watcher_process.stdin.write(`${KEYS.SIGINT}`);
        await watcher_process.exited;
      }

      switch (text) {
        // CLI: Safe Shutdown
        case 'q': {
          await stdin.stop();
          process.exit();
          break;
        }
        // CLI: Restart Watcher
        case 'r': {
          ConsoleError('Starting Watcher');
          watcher_process = run_watcher();
          break;
        }
        // CLI: Run Full Build
        case 'b': {
          ConsoleError('Full Rebuild');
          RunSync.BunRun('build');
          ConsoleError('Starting Watcher');
          watcher_process = run_watcher();
          break;
        }
        default: {
          printHelp();
          break;
        }
      }
    });

    // CLI: Send Remaining Keys Through
    stdin.addHandler((text) => {
      watcher_process.stdin.write(text);
    });

    stdin.start();
  } else {
    const script = JSONGet(command_map, command);
    if (script) {
      RunSync.Bun(scripts_dir.join(script).path, ...command_args);
    } else {
      ConsoleError(`Invalid Command > ${command}`);
    }
  }
}

let console_mark = { updated: true };
function printHelp() {
  const help = `
    Keypress Commands:
      'q' to quit
      'r' to restart the watcher
      'b' to restart the watcher after a full rebuild

    SIGINT [Ctrl-C] Will Force Quit.
  `;
  if (console_mark.updated) {
    ConsoleError(PrepareHelpMessage(help, 4, 1));
    console_mark = GetConsoleMark();
  }
}
