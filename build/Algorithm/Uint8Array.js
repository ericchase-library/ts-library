import { SplitLines } from '../Utility/String.js';
export function U8(from = []) {
  return Uint8Array.from(from);
}
export function U8Clamped(from = []) {
  return Uint8Array.from(Uint8ClampedArray.from(from));
}
export function U8Concat(arrays) {
  let totalLength = 0;
  for (const array of arrays) {
    totalLength += array.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}
export function U8Copy(bytes, count, offset = 0) {
  return bytes.slice(offset, offset + count);
}
export function U8FromString(from) {
  return new TextEncoder().encode(from);
}
export function U8FromUint32(from) {
  const u8s = new Uint8Array(4);
  const view = new DataView(u8s.buffer);
  view.setUint32(0, from >>> 0, false);
  return u8s;
}
export function U8Split(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice()];
  }
  if (count > 0) {
    const parts = [];
    for (let i = 0; i < bytes.length; i += count) {
      parts.push(bytes.slice(i, i + count));
    }
    return parts;
  }
  return [bytes.slice()];
}
export function U8Take(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array()];
  }
  if (count > 0) {
    const chunkA = bytes.slice(0, count);
    const chunkB = bytes.slice(count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array(), bytes.slice()];
}
export function U8TakeEnd(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array()];
  }
  if (count > 0) {
    const chunkA = bytes.slice(bytes.byteLength - count);
    const chunkB = bytes.slice(0, bytes.byteLength - count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array(), bytes.slice()];
}
export function U8ToASCII(bytes) {
  let ascii = '';
  for (const byte of bytes) {
    ascii += String.fromCharCode(byte >>> 0);
  }
  return ascii;
}
export function U8ToDecimal(bytes) {
  const decimal = new Array(bytes.byteLength);
  for (let i = 0; i < bytes.byteLength; i += 1) {
    decimal[i] = (bytes[i] >>> 0).toString(10);
  }
  return decimal;
}
export function U8ToHex(bytes) {
  const hex = new Array(bytes.byteLength);
  for (let i = 0; i < bytes.byteLength; i += 1) {
    hex[i] = (bytes[i] >>> 0).toString(16).padStart(2, '0');
  }
  return hex;
}
export function U8ToLines(bytes) {
  return SplitLines(U8ToString(bytes));
}
export function U8ToString(bytes) {
  return new TextDecoder().decode(bytes);
}
