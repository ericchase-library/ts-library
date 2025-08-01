export function Core_Array_Uint8_To_Decimal(bytes) {
  const decimal = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    decimal[i] = (bytes[i] >>> 0).toString(10);
  }
  return decimal;
}
