export function Core_String_Split(text, delimiter, remove_empty_items = false) {
  const items = text.split(delimiter);
  if (remove_empty_items === true) {
    return items.filter((item) => item.length > 0);
  }
  return items;
}
