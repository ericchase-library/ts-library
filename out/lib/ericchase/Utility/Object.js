export function defineProperties(object, other) {
  return Object.defineProperties(object, Object.getOwnPropertyDescriptors(other));
}
export function getPrototypeChainProperties(object) {
  const aggregate = {};
  for (let ref = object;ref; ref = Object.getPrototypeOf(ref)) {
    Object.defineProperties(aggregate, Object.getOwnPropertyDescriptors(object));
  }
  return aggregate;
}
