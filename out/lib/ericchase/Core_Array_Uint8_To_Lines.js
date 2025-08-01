import { Core_Array_Uint8_To_String } from "./Core_Array_Uint8_To_String.js";
import { Core_String_Split_Lines } from "./Core_String_Split_Lines.js";
export function Core_Array_Uint8_To_Lines(bytes) {
  return Core_String_Split_Lines(Core_Array_Uint8_To_String(bytes));
}
