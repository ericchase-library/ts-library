export function JSONGet(obj, key) {
  return obj[key];
}
export function JSONStringifyAll(...objects) {
  return objects.map((obj) => JSON.stringify(obj));
}
