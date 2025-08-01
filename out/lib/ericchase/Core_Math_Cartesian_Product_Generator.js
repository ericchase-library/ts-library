export function* Core_Math_Cartesian_Product_Generator(array_a, array_b) {
  for (let i = 0;i < array_a.length; i++) {
    for (let j = 0;j < array_b.length; j++) {
      yield [array_a[i], array_b[j]];
    }
  }
}
