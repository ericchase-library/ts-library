import { Core_Stream_Uint8_Gen_ReadLines_Async } from './Core_Stream_Uint8_Gen_ReadLines_Async.js';

export async function Core_Stream_Uint8_ReadLines_Async(stream: ReadableStream<Uint8Array<ArrayBufferLike>>, callback: (line: string) => Promise<boolean | void> | (boolean | void)): Promise<void> {
  for await (const lines of Core_Stream_Uint8_Gen_ReadLines_Async(stream)) {
    for (const line of lines) {
      if ((await callback(line)) === false) {
        return;
      }
    }
  }
}
