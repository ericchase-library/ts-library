import { UTILITY__CRC32__TABLE } from "./Core_Utility_CRC32.js";

export class Class_Core_Utility_CRC32_Class {
  $state = new Uint32Array([4294967295]);
  constructor() {}
  update(bytes) {
    for (let index = 0;index < bytes.length; index++) {
      this.$state[0] = UTILITY__CRC32__TABLE[(this.$state[0] ^ bytes[index]) & 255] ^ this.$state[0] >>> 8;
    }
  }
  get value() {
    return (this.$state[0] ^ 4294967295 >>> 0) >>> 0;
  }
}
export function Core_Utility_CRC32_Class() {
  return new Class_Core_Utility_CRC32_Class;
}
