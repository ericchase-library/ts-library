let newline_count = 0;
export function ConsoleError(...items) {
  console["error"](...items);
  newline_count = 0;
}
export function ConsoleErrorNotEmpty(...items) {
  for (const item of items) {
    if (Array.isArray(item) && item.length === 0)
      continue;
    if (ArrayBuffer.isView(item) && item.byteLength === 0)
      continue;
    if (typeof item === "string" && item.length === 0)
      continue;
    console["error"](...items);
    newline_count = 0;
    break;
  }
}
export function ConsoleErrorWithDate(...items) {
  console["error"](`[${new Date().toLocaleString()}]`, ...items);
  newline_count = 0;
}
export function ConsoleLog(...items) {
  console["log"](...items);
  newline_count = 0;
}
export function ConsoleLogNotEmpty(...items) {
  for (const item of items) {
    if (Array.isArray(item) && item.length === 0)
      continue;
    if (ArrayBuffer.isView(item) && item.byteLength === 0)
      continue;
    if (typeof item === "string" && item.length === 0)
      continue;
    console["log"](...items);
    newline_count = 0;
    break;
  }
}
export function ConsoleLogWithDate(...items) {
  console["log"](`[${new Date().toLocaleString()}]`, ...items);
  newline_count = 0;
}
export function ConsoleNewline(ensure_count = 1) {
  for (let i = newline_count;i < ensure_count; i++) {
    console["log"]();
    newline_count++;
  }
}
export function ConsoleLogToLines(items) {
  if (typeof items === "string") {
    ConsoleLog(items);
  } else {
    for (const item of items) {
      ConsoleLog(item);
    }
  }
}
export function ConsoleErrorToLines(items) {
  if (typeof items === "string") {
    ConsoleError(items);
  } else {
    for (const item of items) {
      ConsoleError(item);
    }
  }
}
