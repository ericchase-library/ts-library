export function Core_Array_Uint8_From_String(from) {
  return new TextEncoder().encode(from);
}
