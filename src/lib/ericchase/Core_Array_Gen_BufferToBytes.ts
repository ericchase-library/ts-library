export function* Core_Array_Gen_BufferToBytes(buffer: ArrayBufferLike): Generator<number> {
  const view = new DataView(buffer);
  for (let i = 0; i < view.byteLength; i++) {
    yield view.getUint8(i) >>> 0;
  }
}
