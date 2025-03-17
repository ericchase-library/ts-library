export function* CartesianProduct(array_a, array_b) {
  for (let i = 0;i < array_a.length; i++) {
    for (let j = 0;j < array_b.length; j++) {
      yield [array_a[i], array_b[j]];
    }
  }
}
export function* nCartesianProduct(...arrays) {
  const count = arrays.reduce((product, arr) => product * BigInt(arr.length), 1n);
  const out = arrays.map((arr) => arr[0]);
  const indices = new Array(arrays.length).fill(0);
  const lengths = arrays.map((arr) => arr.length);
  for (let c = 0n;c < count; c++) {
    yield out.slice();
    let i = arrays.length - 1;
    for (let j = 0;j < arrays.length; j++, i--) {
      indices[i]++;
      if (indices[i] < lengths[i]) {
        out[i] = arrays[i][indices[i]];
        break;
      }
      indices[i] = 0;
      out[i] = arrays[i][0];
    }
  }
}
