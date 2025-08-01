export function Core_Array_Uint8_To_Hex(bytes) {
  const hex = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    hex[i] = (bytes[i] >>> 0).toString(16).padStart(2, "0");
  }
  return hex;
}
