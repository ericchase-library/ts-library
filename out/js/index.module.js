// src/lib/ericchase/core.ts
var ARRAY__UINT8__BYTE_TO_B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var ARRAY__UINT8__B64_TO_BYTE = new Map([...ARRAY__UINT8__BYTE_TO_B64].map((char, byte) => [char, byte]));
var ARRAY__UINT8__EMPTY = Uint8Array.from([]);
var MATH__FACTORIAL__CACHE = [BigInt(1), BigInt(1)];
var UTILITY__CRC32__TABLE = new Uint32Array(256);
var UTILITY__CRC32__MAGIC = new Uint32Array([3988292384]);
for (let i = 0;i < 256; i++) {
  UTILITY__CRC32__TABLE[i] = i;
  for (let k = 0;k < 8; k++) {
    if (UTILITY__CRC32__TABLE[i] >>> 0 & 1) {
      UTILITY__CRC32__TABLE[i] = UTILITY__CRC32__MAGIC[0] ^ UTILITY__CRC32__TABLE[i] >>> 1;
    } else {
      UTILITY__CRC32__TABLE[i] >>>= 1;
    }
  }
}

class ClassArrayUint8Group {
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
class ClassUtilityCRC32 {
  $state = new Uint32Array([4294967295]);
  update(bytes) {
    for (let index = 0;index < bytes.length; index++) {
      this.$state[0] = UTILITY__CRC32__TABLE[(this.$state[0] ^ bytes[index]) & 255] ^ this.$state[0] >>> 8;
    }
  }
  get value() {
    return (this.$state[0] ^ 4294967295 >>> 0) >>> 0;
  }
}

// src/lib/ericchase/api.core.ts
function Core_Utility_Async_Sleep(duration_ms) {
  return new Promise((resolve) => setTimeout(resolve, duration_ms));
}

// src/js/index.module.ts
import { asdf } from "./other.module.js";
await Core_Utility_Async_Sleep(100);
asdf();
