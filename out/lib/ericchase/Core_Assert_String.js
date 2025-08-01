export function Core_Assert_String(value) {
  if (typeof value !== "string") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal string`);
  }
  return true;
}
