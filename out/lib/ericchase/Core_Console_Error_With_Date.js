export function Core_Console_Error_With_Date(...items) {
  console["error"](`[${new Date().toLocaleString()}]`, ...items);
}
