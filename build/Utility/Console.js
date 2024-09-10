export function ConsoleLog(...items) {
  console['log'](...items);
}
export function ConsoleError(...items) {
  console['error'](...items);
}
