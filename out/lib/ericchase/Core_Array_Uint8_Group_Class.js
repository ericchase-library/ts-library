export class Class_Core_Array_Uint8_Group_Class {
  arrays = new Array();
  byteLength = 0;
  constructor() {}
  add(bytes) {
    this.arrays.push(bytes);
    this.byteLength += bytes.byteLength;
    return this.byteLength;
  }
  get(count, offset = 0) {
    const out = new Uint8Array(count);
    if (offset < 0) {
      offset = 0;
    }
    let i_out = 0;
    let i_total = 0;
    for (const u8 of this.arrays) {
      for (let i_u8 = 0; i_u8 < u8.length && i_out < out.length; i_u8++, i_total++) {
        if (i_total < offset) {
          continue;
        }
        out[i_out] = u8[i_u8];
        i_out++;
      }
    }
    return out;
  }
}
export function Core_Array_Uint8_Group_Class() {
  return new Class_Core_Array_Uint8_Group_Class();
}
