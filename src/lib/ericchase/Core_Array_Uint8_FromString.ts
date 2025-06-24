export function Core_Array_Uint8_FromString(from: string): Uint8Array {
  return new TextEncoder().encode(from);
}
