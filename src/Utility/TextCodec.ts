const decoder = new TextDecoder();
const encoder = new TextEncoder();

export function DecodeText(buffer: Uint8Array) {
  return decoder.decode(buffer);
}
export function EncodeText(text: string) {
  return encoder.encode(text);
}
