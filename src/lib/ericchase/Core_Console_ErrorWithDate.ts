export function Core_Console_ErrorWithDate(...items: any[]): void {
  console['error'](`[${new Date().toLocaleString()}]`, ...items);
}
