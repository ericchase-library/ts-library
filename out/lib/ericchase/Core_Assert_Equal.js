export function Core_Assert_Equal(value1, value2) {
  if (value1 !== value2) {
    throw new Error(`Assertion Failed: value1(${value1}) should equal value2(${value2})`);
  }
  return true;
}
