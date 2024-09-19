import { Debouncer } from '../src/Algorithm/Debounce.js';
import { Watcher } from '../src/Platform/Node/Watch.js';
import { ConsoleError } from '../src/Utility/Console.js';
import { buildStep_Clean, buildStep_Compile, buildStep_CopyStripped } from './build.js';

const builder = new Debouncer(async () => {
  await buildStep_CopyStripped();
  await buildStep_Compile();
}, 100);

await buildStep_Clean();
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
