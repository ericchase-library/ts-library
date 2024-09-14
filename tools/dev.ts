import { Debouncer } from '../src/Algorithm/Debounce.js';
import { Watcher } from '../src/Platform/Node/Watch.js';
import { ConsoleError } from '../src/Utility/Console.js';
import { buildClear, buildSteps } from './build.js';

const builder = new Debouncer(async () => {
  await buildSteps(true);
}, 100);

await buildClear();
await builder.run();

try {
  const watcher_src = new Watcher('./src', 100);
  watcher_src.observe(async () => {
    await builder.run();
  });
  await watcher_src.done;
} catch (error) {
  ConsoleError(error);
}
