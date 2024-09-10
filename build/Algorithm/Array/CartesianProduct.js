export function* CartesianProduct(array_a, array_b) {
  for (let i = 0; i < array_a.length; ++i) {
    for (let j = 0; j < array_b.length; ++j) {
      yield [array_a[i], array_b[j]];
    }
  }
}
export function* ConsecutiveCartesianProduct(...arrays) {
  for (const item of arrays.reduce((sum, cur) => Array.from(CartesianProduct(sum, cur)).map((_) => _.flat(1)), [[]])) {
    yield item;
  }
}
export function* SelfCartesianProduct(array) {
  for (let i = 0; i < array.length; ++i) {
    for (let j = i + 1; j < array.length; ++j) {
      yield [array[i], array[j]];
    }
  }
}
