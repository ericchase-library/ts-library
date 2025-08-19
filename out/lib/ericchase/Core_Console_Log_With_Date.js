export function Core_Console_Log_With_Date(...items) {
  console['log'](`[${new Date().toLocaleString()}]`, ...items);
}
