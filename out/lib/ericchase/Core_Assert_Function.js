export function Core_Assert_Function(value) {
  if (typeof value !== 'function') {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal function`);
  }
  return true;
}
