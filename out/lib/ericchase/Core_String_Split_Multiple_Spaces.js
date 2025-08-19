import { Core_String_Split } from './Core_String_Split.js';
export function Core_String_Split_Multiple_Spaces(text, remove_empty_items = false) {
  return Core_String_Split(text, / +/, remove_empty_items);
}
