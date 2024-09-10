import { HasMethod, HasProperty } from '../Utility/Guard.js';
export function Compat_FileSystemEntry(entry) {
  return {
    get filesystem() {
      return HasProperty(entry, 'filesystem') ? entry.filesystem : undefined;
    },
    get fullPath() {
      return HasProperty(entry, 'fullPath') ? entry.fullPath : undefined;
    },
    get isDirectory() {
      return HasProperty(entry, 'isDirectory') ? entry.isDirectory : undefined;
    },
    get isFile() {
      return HasProperty(entry, 'isFile') ? entry.isFile : undefined;
    },
    get name() {
      return HasProperty(entry, 'name') ? entry.name : undefined;
    },
    getParent() {
      if (HasMethod(entry, 'getParent')) {
        return new Promise((resolve, reject) => {
          entry.getParent(resolve, reject);
        });
      }
      return Promise.resolve(undefined);
    },
  };
}
