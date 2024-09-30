let newline_count = 0;
const marks = new Set();
function updateMarks() {
  for (const mark of marks) {
    marks.delete(mark);
    mark.updated = true;
  }
}
export function GetConsoleMark() {
  const mark = { updated: false };
  marks.add(mark);
  return mark;
}
export function ConsoleError(...items) {
  console['error'](...items);
  newline_count = 0;
  updateMarks();
}
export function ConsoleLog(...items) {
  console['log'](...items);
  newline_count = 0;
  updateMarks();
}
export function ConsoleNewline(ensure_count = 1) {
  for (let i = newline_count; i < ensure_count; i++) {
    console['log']();
    newline_count++;
  }
  updateMarks();
}
export function ConsoleLogToLines(items) {
  for (const item of items) {
    ConsoleLog(item);
  }
}
export function ConsoleErrorToLines(items) {
  for (const item of items) {
    ConsoleError(item);
  }
}
