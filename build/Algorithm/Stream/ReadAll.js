import { U8Concat } from '../Array/Uint8Array.js';
export async function U8StreamReadAll(stream) {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    if (done) {
      break;
    }
  }
  return U8Concat(chunks);
}
