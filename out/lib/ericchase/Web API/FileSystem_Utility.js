import { Compat_FileSystemDirectoryEntry } from "./FileSystemDirectoryEntry.js";
import { Compat_FileSystemEntry } from "./FileSystemEntry.js";

export class FileSystemEntryIterator {
  list = [];
  constructor(entries) {
    if (entries) {
      if (Array.isArray(entries)) {
        this.list = entries;
      } else {
        this.list = [entries];
      }
    }
  }
  *getDirectoryEntries() {
    for (const entry of this.list) {
      if (Compat_FileSystemEntry(entry).isDirectory) {
        yield entry;
      }
    }
  }
  *getFileEntries() {
    for (const entry of this.list) {
      if (Compat_FileSystemEntry(entry).isFile) {
        yield entry;
      }
    }
  }
}

export class FileSystemDirectoryEntryIterator {
  list = [];
  constructor(entries) {
    if (entries) {
      if (Array.isArray(entries)) {
        this.list = entries;
      } else {
        this.list = [entries];
      }
    }
  }
  async* getEntries() {
    for (const entry of this.list) {
      const reader = Compat_FileSystemDirectoryEntry(entry).createReader();
      if (reader) {
        for (const entry of await new Promise((resolve, reject) => reader.readEntries(resolve, reject))) {
          yield entry;
        }
      }
    }
  }
}
