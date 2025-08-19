import { Async_Core_Stream_Uint8_Read_Lines_Generator } from './Core_Stream_Uint8_Read_Lines_Generator.js';
export async function Async_Core_Stream_Uint8_Read_Lines(stream, callback) {
  for await (const lines of Async_Core_Stream_Uint8_Read_Lines_Generator(stream)) {
    for (const line of lines) {
      if ((await callback(line)) === false) {
        return;
      }
    }
  }
}
