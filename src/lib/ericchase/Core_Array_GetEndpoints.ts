export function Core_Array_GetEndpoints(array: ArrayLike<unknown>): [number, number] {
  if (!Array.isArray(array) || array.length < 1) {
    return [-1, -1];
  }
  return [0, array.length];
}
