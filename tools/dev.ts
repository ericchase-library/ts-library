import { Debouncer } from '../src/Algorithm/Debounce.js';
import { Watcher } from '../src/Platform/Node/Watch.js';
import { ConsoleError } from '../src/Utility/Console.js';
import { buildStep_Clean, buildStep_Compile, buildStep_Copy } from './build.js';

process.stdin.setRawMode(true); // Enable raw mode (capture keypresses one at a time)
process.stdin.resume(); // Start reading input from stdin
process.stdin.setEncoding('utf8'); // Set encoding to UTF-8

const CTRL_C = '\u0003';
const UP = '\x1b\x5b\x41';
const DOWN = '\x1b\x5b\x42';
const LEFT = '\x1b\x5b\x44';
const RIGHT = '\x1b\x5b\x43';

try {
  await buildStep_Clean();

  const build = new Debouncer(async () => {
    await buildStep_Copy();
    await buildStep_Compile();
  }, 100);
  await build.run();

  const watcher_src = new Watcher('./src', 100);
  watcher_src.observe(async () => {
    await build.run();
  });

  const onData = async (buf: string) => {
    switch (buf) {
      case CTRL_C:
        process.exit();
        break;
      case 'r':
        await buildStep_Clean();
        await build.run();
        ConsoleError('Full Rebuild');
        break;
      // case UP:
      //   console.log('up');
      //   break;
      // case DOWN:
      //   console.log('down');
      //   break;
      // case LEFT:
      //   console.log('left');
      //   break;
      // case RIGHT:
      //   console.log('right');
      //   break;
    }
  };
  process.stdin.addListener('data', onData);

  await watcher_src.done;
} catch (error) {
  ConsoleError(error);
}
