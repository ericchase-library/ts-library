import { Core_Array_Uint8_Concat } from "./Core_Array_Uint8_Concat.js";
export async function Async_Core_Stream_Uint8_Read_All(stream) {
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
    return Core_Array_Uint8_Concat(chunks);
  } finally {
    reader.releaseLock();
  }
}
