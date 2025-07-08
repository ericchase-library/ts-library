import { NODE_FS, NODE_PATH } from './NodePlatform.js';

export type WatchCallback = (event: 'rename' | 'change', path: string) => void;

export function NodePlatform_Directory_Watch(path: string, callback: WatchCallback, recursive = true): () => void {
  path = NODE_PATH.normalize(path);
  const watcher = NODE_FS.watch(path, { persistent: true, recursive }, (event, filename) => {
    callback(event, filename ?? '');
  });
  return () => {
    watcher.close();
  };
}
