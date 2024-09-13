import { U8Concat } from '../Array/Uint8Array.js';
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
