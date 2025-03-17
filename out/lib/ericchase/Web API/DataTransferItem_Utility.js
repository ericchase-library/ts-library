import { Compat_DataTransferItem } from "src/lib/ericchase/Web API/DataTransferItem.js";

export class DataTransferItemIterator {
  list = [];
  constructor(items) {
    if (items) {
      if (Array.isArray(items)) {
        this.list = items;
      } else if ("length" in items) {
        this.list = Array.from(items);
      } else {
        this.list = [items];
      }
    }
  }
  *getAsEntries() {
    for (const item of this.list) {
      const entry = Compat_DataTransferItem(item).getAsEntry();
      if (entry)
        yield entry;
    }
  }
  *getAsFiles() {
    for (const item of this.list) {
      const file = Compat_DataTransferItem(item).getAsFile();
      if (file)
        yield file;
    }
  }
  async* getAsStrings() {
    for (const item of this.list) {
      const task = await Compat_DataTransferItem(item).getAsString();
      if (task)
        yield task;
    }
  }
}
