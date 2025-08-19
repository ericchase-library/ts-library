export const UTILITY__CRC32__TABLE = new Uint32Array(256);
const UTILITY__CRC32__MAGIC = new Uint32Array([3988292384]);
for (let i = 0; i < 256; i++) {
  UTILITY__CRC32__TABLE[i] = i;
  for (let k = 0; k < 8; k++) {
    if ((UTILITY__CRC32__TABLE[i] >>> 0) & 1) {
      UTILITY__CRC32__TABLE[i] = UTILITY__CRC32__MAGIC[0] ^ (UTILITY__CRC32__TABLE[i] >>> 1);
    } else {
      UTILITY__CRC32__TABLE[i] >>>= 1;
    }
  }
}
export function Core_Utility_CRC32(bytes) {
  const crc = new Uint32Array([4294967295]);
  for (let index = 0; index < bytes.length; index++) {
    crc[0] = UTILITY__CRC32__TABLE[(crc[0] ^ bytes[index]) & 255] ^ (crc[0] >>> 8);
  }
  return (crc[0] ^ (4294967295 >>> 0)) >>> 0;
}
