export function Core_Array_Uint8_To_String(bytes) {
  return new TextDecoder().decode(bytes);
}
