import { Compat_DataTransferItem } from './DataTransferItem.js';

export class DataTransferItemIterator {
  list = [];
  constructor(items) {
    if (items) {
      if (Array.isArray(items)) {
        this.list = items;
      } else if ('length' in items) {
        this.list = Array.from(items);
      } else {
        this.list = [items];
      }
    }
  }
  *getAsEntry() {
    for (const item of this.list) {
      const entry = Compat_DataTransferItem(item).getAsEntry();
      if (entry) yield entry;
    }
  }
  *getAsFile() {
    for (const item of this.list) {
      const file = Compat_DataTransferItem(item).getAsFile();
      if (file) yield file;
    }
  }
  async *getAsString() {
    for (const item of this.list) {
      const task = await Compat_DataTransferItem(item).getAsString();
      if (task) yield task;
    }
  }
}
