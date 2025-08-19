export function Core_Array_Are_Equal(array, other) {
  if (array.length !== other.length) {
    return false;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== other[i]) {
      return false;
    }
  }
  return true;
}
