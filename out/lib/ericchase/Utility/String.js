export function GetLeftMarginSize(text) {
  let i = 0;
  for (;i < text.length; i++) {
    if (text[i] !== " ") {
      break;
    }
  }
  return i;
}
export function LineIsOnlyWhiteSpace(line) {
  return /^\s*$/.test(line);
}
export function RemoveWhiteSpaceOnlyLines(text) {
  const lines = SplitLines(text);
  return lines.filter((line) => !LineIsOnlyWhiteSpace(line));
}
export function RemoveWhiteSpaceOnlyLinesFromTopAndBottom(text) {
  const lines = SplitLines(text);
  return lines.slice(lines.findIndex((line) => LineIsOnlyWhiteSpace(line) === false), 1 + lines.findLastIndex((line) => LineIsOnlyWhiteSpace(line) === false));
}
export function Split(text, delimiter, remove_empty_items = false) {
  const items = text.split(delimiter);
  return remove_empty_items === false ? items : items.filter((item) => item.length > 0);
}
export function SplitLines(text, remove_empty_items = false) {
  return Split(text, /\r?\n/, remove_empty_items);
}
export function SplitMultipleSpaces(text, remove_empty_items = false) {
  return Split(text, / +/, remove_empty_items);
}
export function SplitMultipleWhiteSpace(text, remove_empty_items = false) {
  return Split(text, /\s+/, remove_empty_items);
}
export function ToSnakeCase(text) {
  return text.toLowerCase().replace(/ /g, "-");
}
export function TrimLines(lines) {
  return lines.map((line) => line.trim());
}
