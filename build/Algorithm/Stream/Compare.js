const EMPTY_UI8A = new Uint8Array();

export class U8StreamReader {
  reader;
  done = false;
  i = 0;
  length = 0;
  value = EMPTY_UI8A;
  constructor(reader) {
    this.reader = reader;
  }
  async next() {
    const { done, value = EMPTY_UI8A } = await this.reader.read();
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
export async function U8StreamCompare(stream1, stream2) {
  const one = new U8StreamReader(stream1.getReader());
  const two = new U8StreamReader(stream2.getReader());
  try {
    while (true) {
      let changed = false;
      if (one.done === false && one.i >= one.length) {
        if ((await one.next()).changed === true) {
          changed = true;
        }
      }
      if (two.done === false && two.i >= two.length) {
        if ((await two.next()).changed === true) {
          changed = true;
        }
      }
      if (one.done && two.done) {
        return true;
      }
      if (one.done !== two.done || changed === false) {
        return false;
      }
      while (one.i < one.length && two.i < two.length) {
        if (one.value[one.i] !== two.value[two.i]) {
          return false;
        }
        one.i++;
        two.i++;
      }
    }
  } finally {
    one.releaseLock();
    two.releaseLock();
  }
}
