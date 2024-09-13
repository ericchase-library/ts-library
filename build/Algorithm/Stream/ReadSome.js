import { U8, U8Concat, U8Take } from '../Array/Uint8Array.js';
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
