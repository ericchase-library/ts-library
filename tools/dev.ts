import { Debounce } from '../src/Algorithm/Debounce.js';
import { Run } from '../src/Platform/Bun/Process.js';
import { Watcher } from '../src/Platform/Node/Watch.js';

const runBuild = Debounce(async () => {
  await Run('bun run build');
}, 250);

runBuild();

try {
  const watcher = new Watcher('./src', 250);
  watcher.observe(() => {
    runBuild();
  });
  console.log();
  await watcher.done;
} catch (error) {
  console.log(error);
}
