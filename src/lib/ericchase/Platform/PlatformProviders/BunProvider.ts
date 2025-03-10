import { U8StreamCompare } from 'src/lib/ericchase/Algorithm/Stream.js';
import { PlatformProvider } from 'src/lib/ericchase/Platform/PlatformProvider.js';
import NodeProvider from 'src/lib/ericchase/Platform/PlatformProviders/NodeProvider.js';

const BunProvider = PlatformProvider();

// Directory
BunProvider.Directory.create = NodeProvider.Directory.create;
BunProvider.Directory.delete = NodeProvider.Directory.delete;
BunProvider.Directory.globScan = async (path, pattern) => {
  return new Set(await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: path.raw, dot: true })));
};
BunProvider.Directory.watch = NodeProvider.Directory.watch;

// File
BunProvider.File.compare = async (from, to) => {
  return U8StreamCompare(Bun.file(from.raw).stream(), Bun.file(to.raw).stream());
};
BunProvider.File.copy = async (from, to, overwrite = false) => {
  if (from.raw === to.raw) {
    return false;
  }
  if (overwrite !== true && (await Bun.file(to.raw).exists()) === true) {
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
  if (overwrite !== true && (await Bun.file(to.raw).exists()) === true) {
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
BunProvider.File.writeBytes = async (path, bytes, createpath = true) => {
  if (createpath === true) {
    await BunProvider.Directory.create(path.slice(0, -1));
  }
  return Bun.write(path.raw, bytes);
};
BunProvider.File.writeText = async (path, text, createpath = true) => {
  if (createpath === true) {
    await BunProvider.Directory.create(path.slice(0, -1));
  }
  return Bun.write(path.raw, text);
};

// Utility
BunProvider.Utility.globMatch = (query, pattern) => {
  return new Bun.Glob(pattern).match(query);
};

export default BunProvider;
