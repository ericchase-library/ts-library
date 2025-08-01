export function Core_Assert_Undefined(value) {
  if (typeof value !== "undefined") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal undefined`);
  }
  return true;
}
