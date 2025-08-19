import { ARRAY__UINT8__EMPTY } from './Core_Array_Uint8.js';

export class Class_Core_Stream_Uint8_Reader_Class {
  reader;
  done = false;
  i = 0;
  length = 0;
  value = ARRAY__UINT8__EMPTY;
  constructor(reader) {
    this.reader = reader;
  }
  async next() {
    const { done, value = ARRAY__UINT8__EMPTY } = await this.reader.read();
    if (this.done === done && this.value === value) {
      return { changed: false };
    }
    this.done = done;
    this.i = 0;
    this.length = value.length;
    this.value = value;
    return { changed: true };
  }
  releaseLock() {
    this.reader.releaseLock();
  }
}
export function Core_Stream_Uint8_Reader_Class(reader) {
  return new Class_Core_Stream_Uint8_Reader_Class(reader);
}
