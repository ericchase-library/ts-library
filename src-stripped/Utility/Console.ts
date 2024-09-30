let newline_count = 0;

const marks = new Set<{ updated: boolean }>();
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

export function ConsoleError(...items: any[]) {
  // biome-ignore lint: this let's us search for undesired console[error]s
  console['error'](...items);
  newline_count = 0;
  updateMarks();
}

export function ConsoleLog(...items: any[]) {
  // biome-ignore lint: this let's us search for undesired console[log]s
  console['log'](...items);
  newline_count = 0;
  updateMarks();
}

export function ConsoleNewline(ensure_count = 1) {
  for (let i = newline_count; i < ensure_count; i++) {
    // biome-ignore lint: this let's us search for undesired console[log]s
    console['log']();
    newline_count++;
  }
  updateMarks();
}

export function ConsoleLogToLines(items: Iterable<any>) {
  for (const item of items) {
    ConsoleLog(item);
  }
}
export function ConsoleErrorToLines(items: Iterable<any>) {
  for (const item of items) {
    ConsoleError(item);
  }
}
