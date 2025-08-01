export function Core_Array_Uint8_Copy(bytes, count, offset = 0) {
  return bytes.slice(offset, offset + count);
}
