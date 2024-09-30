const decoder = new TextDecoder();
const encoder = new TextEncoder();
export function DecodeText(buffer) {
  return decoder.decode(buffer);
}
export function EncodeText(text) {
  return encoder.encode(text);
}
