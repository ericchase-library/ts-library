import { Core_Array_Uint8_ToString } from './Core_Array_Uint8_ToString.js';
import { Core_String_SplitLines } from './Core_String_SplitLines.js';

export function Core_Array_Uint8_ToLines(bytes: Uint8Array): string[] {
  // Array.split() beats Array[index] here for overall performance
  return Core_String_SplitLines(Core_Array_Uint8_ToString(bytes));
}
