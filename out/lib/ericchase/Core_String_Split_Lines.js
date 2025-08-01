import { Core_String_Split } from "./Core_String_Split.js";
export function Core_String_Split_Lines(text, remove_empty_items = false) {
  return Core_String_Split(text, /\r?\n/, remove_empty_items);
}
