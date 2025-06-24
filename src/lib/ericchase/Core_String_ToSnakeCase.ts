export function Core_String_ToSnakeCase(text: string): string {
  return text.toLowerCase().replace(/ /g, '-');
}
