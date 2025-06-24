export function Core_String_Split(text: string, delimiter: string | RegExp, remove_empty_items = false): string[] {
  const items = text.split(delimiter);
  if (remove_empty_items === false) {
    return items;
  } else {
    return items.filter((item) => item.length > 0);
  }
}
