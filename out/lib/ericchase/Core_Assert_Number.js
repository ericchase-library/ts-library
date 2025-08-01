export function Core_Assert_Number(value) {
  if (typeof value !== "number") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal number`);
  }
  return true;
}
