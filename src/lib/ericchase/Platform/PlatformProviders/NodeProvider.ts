import { default as node_fs } from 'node:fs';
import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { PlatformProvider } from 'src/lib/ericchase/Platform/PlatformProvider.js';

const NodeProvider = PlatformProvider();

NodeProvider.Directory.create = async function create(path: CPath, recursive = true) {
  try {
    await node_fs.promises.mkdir(path.raw, { recursive });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  return (await node_fs.promises.stat(path.raw)).isDirectory();
};

NodeProvider.Directory.delete = async (path, recursive) => {
  try {
    await node_fs.promises.rm(path.raw, { recursive, force: true });
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  return node_fs.existsSync(path.raw) === false;
};

NodeProvider.Directory.watch = (path, callback, recursive = true) => {
  const watcher = node_fs.watch(path.raw, { persistent: true, recursive }, (event, filename) => {
    callback(event, Path(filename ?? ''));
  });
  return () => {
    watcher.close();
  };
};

export default NodeProvider;
