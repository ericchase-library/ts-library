export function Core_Array_Uint8_ToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
