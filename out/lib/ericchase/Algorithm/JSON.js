export function JSONGet(obj, key) {
  return obj[key];
}
export function JSONStringifyAll(...objects) {
  return objects.map((obj) => JSON.stringify(obj));
}
export function JSONRawStringParse(str) {
  return JSON.parse(`"${str}"`);
}
