export function* SlidingWindow(array, count) {
  if (count > 0) {
    if (count < array.length) {
      let i = count;
      for (;i < array.length; i++) {
        yield { begin: i - count, end: i, slice: array.slice(i - count, i) };
      }
      yield { begin: i - count, end: array.length, slice: array.slice(i - count) };
    } else {
      yield { begin: 0, end: array.length, slice: array.slice() };
    }
  }
}
export function* SlidingWindowFilter(array, count, filter) {
  if (typeof filter !== "function") {
    throw new Error('Parameter `filter` must be of type "function".');
  }
  for (const { begin, end, slice } of SlidingWindow(array, count)) {
    if (filter(slice)) {
      yield { begin, end, slice };
    }
  }
}
