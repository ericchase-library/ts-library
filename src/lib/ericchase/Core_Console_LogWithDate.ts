export function Core_Console_LogWithDate(...items: any[]): void {
  console['log'](`[${new Date().toLocaleString()}]`, ...items);
}
