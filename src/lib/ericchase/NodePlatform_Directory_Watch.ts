import { NODE_FS } from './NodePlatform.js';
import { NodePlatform_Path_Join } from './NodePlatform_Path_Join.js';

export type WatchCallback = (event: 'rename' | 'change', path: string) => void;

export function NodePlatform_Directory_Watch(path: string, callback: WatchCallback, recursive = true): () => void {
  const watcher = NODE_FS.watch(NodePlatform_Path_Join(path), { persistent: true, recursive }, (event, filename) => {
    callback(event, filename ?? '');
  });
  return () => {
    watcher.close();
  };
}
