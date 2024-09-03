// does exactly what the name sounds like

const entries = await Array.fromAsync(
  new Bun.Glob('**/*') //
    .scan({ cwd: './src', absolute: true, dot: true }),
);
const sep = entries[0].indexOf('\\') === -1 ? '/' : '\\';
const sorted = entries //
  .sort((a, b) => a.slice(0, a.lastIndexOf(sep)).localeCompare(b.slice(0, b.lastIndexOf(sep))));

// Attempt to open files in absolute path order. Might not happen though.
const jobs: Promise<number>[] = [];
for (const path of sorted) {
  jobs.push(Bun.spawn(['code', path]).exited);
  await Bun.sleep(50);
}
await Promise.allSettled(jobs);
