import { SplitLines } from "../Utility/String.js";
const BYTE_TO_B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_TO_BYTE = new Map([...BYTE_TO_B64].map((char, byte) => [char, byte]));

export class U8Group {
  arrays = new Array;
  byteLength = 0;
  add(bytes) {
    this.arrays.push(bytes);
    this.byteLength += bytes.byteLength;
    return this.byteLength;
  }
  get(count, offset = 0) {
    const out = new Uint8Array(count);
    let i_out = 0;
    if (offset === 0) {
      for (const bytes of this.arrays) {
        for (let i_bytes = 0;i_bytes < bytes.byteLength; i_bytes++) {
          out[i_out] = bytes[i_bytes];
          i_out++;
          if (i_out >= count) {
            return out;
          }
        }
      }
    } else {
      let i_total = 0;
      for (const bytes of this.arrays) {
        for (let i_bytes = 0;i_bytes < bytes.byteLength; i_bytes++) {
          i_total++;
          if (i_total >= offset) {
            out[i_out] = bytes[i_bytes];
            i_out++;
            if (i_out >= count) {
              return out;
            }
          }
        }
      }
    }
    return out;
  }
}
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
export function U8FromBase64(b64_str) {
  if (b64_str.length % 4 === 0) {
    const b64_padding = (b64_str[b64_str.length - 1] === "=" ? 1 : 0) + (b64_str[b64_str.length - 2] === "=" ? 1 : 0);
    const b64_bytes = new Uint8Array(b64_str.length - b64_padding);
    for (let i = 0;i < b64_bytes.byteLength; ++i) {
      b64_bytes[i] = B64_TO_BYTE.get(b64_str[i]) ?? 0;
    }
    const u8_out = new Uint8Array(b64_str.length / 4 * 3 - b64_padding);
    let u8_offset = 0;
    let b64_index = 0;
    while (b64_index + 4 <= b64_bytes.length) {
      for (const byte of new Uint8Array([
        (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4,
        (15 & b64_bytes[b64_index + 1]) << 4 | (60 & b64_bytes[b64_index + 2]) >> 2,
        (3 & b64_bytes[b64_index + 2]) << 6 | 63 & b64_bytes[b64_index + 3]
      ])) {
        u8_out[u8_offset] = byte;
        ++u8_offset;
      }
      b64_index += 4;
    }
    switch (u8_out.length - u8_offset) {
      case 2: {
        for (const byte of new Uint8Array([
          (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4,
          (15 & b64_bytes[b64_index + 1]) << 4 | (60 & b64_bytes[b64_index + 2]) >> 2
        ])) {
          u8_out[u8_offset] = byte;
          ++u8_offset;
        }
        break;
      }
      case 1: {
        for (const byte of new Uint8Array([
          (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4
        ])) {
          u8_out[u8_offset] = byte;
          ++u8_offset;
        }
        break;
      }
    }
    return u8_out;
  }
  return new Uint8Array(0);
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
    for (let i = 0;i < bytes.length; i += count) {
      parts.push(bytes.slice(i, i + count));
    }
    return parts;
  }
  return [bytes.slice()];
}
export function U8Take(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array];
  }
  if (count > 0) {
    const chunkA = bytes.slice(0, count);
    const chunkB = bytes.slice(count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array, bytes.slice()];
}
export function U8TakeEnd(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array];
  }
  if (count > 0) {
    const chunkA = bytes.slice(bytes.byteLength - count);
    const chunkB = bytes.slice(0, bytes.byteLength - count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array, bytes.slice()];
}
export function U8ToASCII(bytes) {
  let ascii = "";
  for (const byte of bytes) {
    ascii += String.fromCharCode(byte >>> 0);
  }
  return ascii;
}
export function U8ToBase64(u8_bytes) {
  let b64_out = "";
  let u8_index = 0;
  while (u8_index + 3 <= u8_bytes.length) {
    for (const byte of new Uint8Array([
      (252 & u8_bytes[u8_index]) >> 2 | 0,
      (3 & u8_bytes[u8_index]) << 4 | (240 & u8_bytes[u8_index + 1]) >> 4,
      (15 & u8_bytes[u8_index + 1]) << 2 | (192 & u8_bytes[u8_index + 2]) >> 6,
      63 & u8_bytes[u8_index + 2] | 0
    ])) {
      b64_out += BYTE_TO_B64[byte];
    }
    u8_index += 3;
  }
  switch (u8_bytes.length - u8_index) {
    case 2: {
      for (const byte of new Uint8Array([
        (252 & u8_bytes[u8_index]) >> 2 | 0,
        (3 & u8_bytes[u8_index]) << 4 | (240 & u8_bytes[u8_index + 1]) >> 4,
        (15 & u8_bytes[u8_index + 1]) << 2 | 0
      ])) {
        b64_out += BYTE_TO_B64[byte];
      }
      b64_out += "=";
      break;
    }
    case 1: {
      for (const byte of new Uint8Array([
        (252 & u8_bytes[u8_index]) >> 2 | 0,
        (3 & u8_bytes[u8_index]) << 4 | 0
      ])) {
        b64_out += BYTE_TO_B64[byte];
      }
      b64_out += "==";
      break;
    }
  }
  return b64_out;
}
export function U8ToDecimal(bytes) {
  const decimal = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    decimal[i] = (bytes[i] >>> 0).toString(10);
  }
  return decimal;
}
export function U8ToHex(bytes) {
  const hex = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    hex[i] = (bytes[i] >>> 0).toString(16).padStart(2, "0");
  }
  return hex;
}
export function U8ToLines(bytes) {
  return SplitLines(U8ToString(bytes));
}
export function U8ToString(bytes) {
  return new TextDecoder().decode(bytes);
}
