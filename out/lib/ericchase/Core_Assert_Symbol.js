export function Core_Assert_Symbol(value) {
  if (typeof value !== "symbol") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal symbol`);
  }
  return true;
}
