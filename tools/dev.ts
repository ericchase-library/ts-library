import { Debounce } from '../src/Algorithm/Debounce.js';
import { Run } from '../src/Platform/Bun/Process.js';
import { Watcher } from '../src/Platform/Node/Watch.js';
import { ConsoleError, ConsoleLog } from '../src/Utility/Console.js';

const runBuild = Debounce(async () => {
  await Run('bun run build');
  await Run('bun run strip');
}, 250);

runBuild();

try {
  const watcher_src = new Watcher('./src', 250);
  ConsoleLog();
  watcher_src.observe(() => runBuild());
  await watcher_src.done;
} catch (error) {
  ConsoleError(error);
}
