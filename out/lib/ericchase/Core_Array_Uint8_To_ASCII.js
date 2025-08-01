export function Core_Array_Uint8_To_ASCII(bytes) {
  let ascii = "";
  for (const byte of bytes) {
    ascii += String.fromCharCode(byte >>> 0);
  }
  return ascii;
}
