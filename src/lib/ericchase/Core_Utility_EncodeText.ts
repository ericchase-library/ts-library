export function Core_Utility_EncodeText(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}
