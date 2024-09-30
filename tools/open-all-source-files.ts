// does exactly what the name sounds like

import { type SpawnerSubprocess, Spawn } from '../src/lib/ericchase/Platform/Bun/Child Process.js';

const entries = await Array.fromAsync(
  new Bun.Glob('**/*.ts') //
    .scan({ cwd: './src', absolute: true, dot: true }),
);
const sep = entries[0].indexOf('\\') === -1 ? '/' : '\\';
const sorted = entries //
  .sort((a, b) => a.slice(0, a.lastIndexOf(sep)).localeCompare(b.slice(0, b.lastIndexOf(sep))));

// Attempt to open files in absolute path order. Might not happen though.
const jobs: SpawnerSubprocess[] = [];
for (const path of sorted) {
  jobs.push(Spawn('code', path));
  await Bun.sleep(50);
}
await Promise.allSettled(jobs);
