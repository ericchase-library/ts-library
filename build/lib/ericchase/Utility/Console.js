var Console;
((Console) => {
  Console.newline_count = 0;
  Console.marks = new Set();
})((Console ||= {}));
function updateMarks() {
  for (const mark of Console.marks) {
    Console.marks.delete(mark);
    mark.updated = true;
  }
}
export function GetConsoleMark() {
  const mark = { updated: false };
  Console.marks.add(mark);
  return mark;
}
export function ConsoleError(...items) {
  console['error'](...items);
  Console.newline_count = 0;
  updateMarks();
}
export function ConsoleErrorWithDate(...items) {
  console['error'](`[${new Date().toLocaleTimeString()}]`, ...items);
  Console.newline_count = 0;
  updateMarks();
}
export function ConsoleLog(...items) {
  console['log'](...items);
  Console.newline_count = 0;
  updateMarks();
}
export function ConsoleLogWithDate(...items) {
  console['log'](`[${new Date().toLocaleTimeString()}]`, ...items);
  Console.newline_count = 0;
  updateMarks();
}
export function ConsoleNewline(ensure_count = 1) {
  for (let i = Console.newline_count; i < ensure_count; i++) {
    console['log']();
    Console.newline_count++;
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
