export function Core_Utility_DecodeBytes(buffer: Uint8Array): string {
  return new TextDecoder().decode(buffer);
}
