import { Core_String_LineIsOnlyWhiteSpace } from './Core_String_LineIsOnlyWhiteSpace.js';
import { Core_String_SplitLines } from './Core_String_SplitLines.js';

export function Core_String_RemoveWhiteSpaceOnlyLines(text: string): string[] {
  const lines = Core_String_SplitLines(text);
  return lines.filter((line) => !Core_String_LineIsOnlyWhiteSpace(line));
}
