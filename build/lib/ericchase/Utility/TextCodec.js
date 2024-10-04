const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
export function DecodeBytes(buffer) {
  return textDecoder.decode(buffer);
}
export function EncodeText(text) {
  return textEncoder.encode(text);
}
