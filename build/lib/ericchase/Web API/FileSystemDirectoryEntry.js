import { HasMethod } from '../Utility/Guard.js';
export function Compat_FileSystemDirectoryEntry(entry) {
  return {
    createReader() {
      if (HasMethod(entry, 'createReader')) {
        return entry.createReader() ?? undefined;
      }
    },
    getDirectory(path, options) {
      if (HasMethod(entry, 'getDirectory')) {
        return new Promise((resolve, reject) => {
          entry.getDirectory(path, options, () => resolve, reject);
        });
      }
      return Promise.resolve(undefined);
    },
    getFile(path, options) {
      if (HasMethod(entry, 'getFile')) {
        return new Promise((resolve, reject) => {
          entry.getFile(path, options, () => resolve, reject);
        });
      }
      return Promise.resolve(undefined);
    },
  };
}
