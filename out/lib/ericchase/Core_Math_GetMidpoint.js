export function Core_Math_GetMidpoint(a, b) {
  return (b - a) % 2 === 0 ? (a + b) / 2 : (a + b - 1) / 2;
}
