import { U8FromUint32, U8ToHex } from './Uint8Array.js';
export function Uint32ToHex(uint) {
  return U8ToHex(U8FromUint32(uint));
}
