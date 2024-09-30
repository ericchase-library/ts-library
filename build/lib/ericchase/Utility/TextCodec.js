const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
export function DecodeText(buffer) {
  return textDecoder.decode(buffer);
}
export function EncodeText(text) {
  return textEncoder.encode(text);
}
