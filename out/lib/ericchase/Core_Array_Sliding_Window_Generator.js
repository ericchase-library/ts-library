export function* Core_Array_Sliding_Window_Generator(array, count) {
  if (count > 0) {
    if (count < array.length) {
      let i = count;
      for (; i < array.length; i++) {
        yield { begin: i - count, end: i, slice: array.slice(i - count, i) };
      }
      yield { begin: i - count, end: array.length, slice: array.slice(i - count) };
    } else {
      yield { begin: 0, end: array.length, slice: array.slice() };
    }
  }
}
