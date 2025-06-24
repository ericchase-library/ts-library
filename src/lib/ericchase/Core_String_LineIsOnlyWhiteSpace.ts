export function Core_String_LineIsOnlyWhiteSpace(line: string): boolean {
  return /^\s*$/.test(line);
}
