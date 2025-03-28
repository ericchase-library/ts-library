import { U8, U8Concat, U8Take } from "./Uint8Array.js";
import { SplitLines } from "../Utility/String.js";
export async function* AsyncReader(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
export async function* AsyncLineReader(stream) {
  const reader = stream.pipeThrough(new TextDecoderStream).getReader();
  try {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.length > 0) {
          yield [buffer];
        }
        return;
      }
      const lines = SplitLines(buffer + value);
      buffer = lines[lines.length - 1] ?? "";
      yield lines.slice(0, -1);
    }
  } finally {
    reader.releaseLock();
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
const EMPTY_UI8A = new Uint8Array;

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
export async function U8StreamReadAll(stream) {
  const reader = stream.getReader();
  try {
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
    return U8Concat(chunks);
  } finally {
    reader.releaseLock();
  }
}
export async function U8StreamReadSome(stream, count) {
  if (count < 1) {
    return U8();
  }
  const reader = stream.getReader();
  try {
    const chunks = [];
    let size_read = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      size_read += value.byteLength;
      if (size_read >= count) {
        break;
      }
    }
    return U8Take(U8Concat(chunks), count)[0];
  } finally {
    reader.releaseLock();
  }
}
export async function U8StreamReadLines(stream, callback) {
  for await (const lines of AsyncLineReader(stream)) {
    for (const line of lines) {
      if (await callback(line) === false) {
        return;
      }
    }
  }
}
