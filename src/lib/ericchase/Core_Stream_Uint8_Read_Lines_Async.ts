import { Core_Stream_Uint8_Read_Lines_Async_Generator } from './Core_Stream_Uint8_Read_Lines_Async_Generator.js';

export async function Core_Stream_Uint8_Read_Lines_Async(stream: ReadableStream<Uint8Array<ArrayBufferLike>>, callback: (line: string) => Promise<boolean | void> | (boolean | void)): Promise<void> {
  for await (const lines of Core_Stream_Uint8_Read_Lines_Async_Generator(stream)) {
    for (const line of lines) {
      if ((await callback(line)) === false) {
        return;
      }
    }
  }
}
