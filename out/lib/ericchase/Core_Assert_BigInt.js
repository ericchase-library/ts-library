export function Core_Assert_BigInt(value) {
  if (typeof value !== "bigint") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal bigint`);
  }
  return true;
}
