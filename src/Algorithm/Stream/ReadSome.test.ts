import { describe, expect, test } from 'bun:test';
import { U8 } from '../Array/Uint8Array.js';
import { U8StreamReadSome } from './ReadSome.js';

describe(U8StreamReadSome.name, () => {
  test('[1, 2, 3, 4]', async () => {
    const bytes = U8([1, 2, 3, 4]);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });
    expect([...(await U8StreamReadSome(stream, 2))]).toEqual([1, 2]);
  });
  test('10000 bytes', async () => {
    const bytes = new Uint8Array(10000);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = i;
    }
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });
    expect((await U8StreamReadSome(stream, 1234)).byteLength).toBe(1234);
  });
});
