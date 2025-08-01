export function Core_String_To_Snake_Case(text) {
  return text.toLowerCase().replace(/ /g, "-");
}
