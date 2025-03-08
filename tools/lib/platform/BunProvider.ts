import { EEXIST, ENOENT } from 'node:constants';
import { default as node_fs } from 'node:fs';
import { U8StreamCompare } from 'src/lib/ericchase/Algorithm/Stream.js';
import { Provider } from 'tools/lib/platform/Provider.js';

const BunProvider = new Provider();

BunProvider.Directory.create = async (path, recursive = true) => {
  try {
    await node_fs.promises.mkdir(path.raw, { recursive });
  } catch (error: any) {
    if (error.errno !== EEXIST) {
      throw error;
    }
  }
  return (await node_fs.promises.stat(path.raw)).isDirectory();
};
BunProvider.Directory.delete = async (path, recursive = true) => {
  try {
    await node_fs.promises.rm(path.raw, { recursive, force: true });
  } catch (error: any) {
    if (error.errno !== ENOENT) {
      throw error;
    }
  }
  return node_fs.existsSync(path.raw) === false;
};
BunProvider.Directory.globScan = async (path, pattern) => {
  return new Set(await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: path.raw, dot: true })));
};

BunProvider.File.compare = async (from, to) => {
  return U8StreamCompare(Bun.file(from.raw).stream(), Bun.file(to.raw).stream());
};
BunProvider.File.copy = async (from, to, overwrite = false) => {
  if (from.raw === to.raw) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(to.raw).exists())) {
    return false;
  }
  await Bun.write(Bun.file(to.raw), Bun.file(from.raw));
  return BunProvider.File.compare(from, to);
};
BunProvider.File.delete = async (path) => {
  await Bun.file(path.raw).delete();
  return Bun.file(path.raw).exists();
};
BunProvider.File.move = async (from, to, overwrite = false) => {
  if (from.raw === to.raw) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(to.raw).exists())) {
    return false;
  }
  await Bun.write(Bun.file(to.raw), Bun.file(from.raw));
  if ((await BunProvider.File.compare(from, to)) === false) {
    return false;
  }
  return BunProvider.File.delete(from);
};
BunProvider.File.readBytes = async (path) => await Bun.file(path.raw).bytes();
BunProvider.File.readText = async (path) => await Bun.file(path.raw).text();
BunProvider.File.write = async (path, data) => await Bun.write(path.raw, data, { createPath: true });

BunProvider.Utility.globMatch = (query, pattern) => {
  return new Bun.Glob(pattern).match(query);
};

export default BunProvider;
