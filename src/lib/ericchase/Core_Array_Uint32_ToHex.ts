import { Core_Array_Uint8_FromUint32 } from './Core_Array_Uint8_FromUint32.js';
import { Core_Array_Uint8_ToHex } from './Core_Array_Uint8_ToHex.js';

export function Core_Array_Uint32_ToHex(uint: number): string[] {
  return Core_Array_Uint8_ToHex(Core_Array_Uint8_FromUint32(uint));
}
