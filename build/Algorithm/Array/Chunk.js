export function* GenerateChunkSlices(array, size) {
  if (size < 1) {
    yield [];
  } else {
    let index = size;
    for (; index < array.length; index += size) {
      const slice = array.slice(index - size, index);
      yield { slice, begin: index - size, end: index };
    }
    const slice = array.slice(index - size);
    yield { slice, begin: index - size, end: array.length };
  }
}
export function* GenerateChunks(array, size) {
  if (size < 1) {
    yield [];
  } else {
    let index = size;
    for (; index < array.length; index += size) {
      yield array.slice(index - size, index);
    }
    yield array.slice(index - size);
  }
}
