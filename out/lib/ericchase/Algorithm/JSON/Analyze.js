export function JSONAnalyze(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      JSONAnalyze(item);
    }
    return { source: obj, type: "array" };
  }
  if (obj === null || typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return { source: obj, type: "primitive" };
  }
  if (obj === undefined || typeof obj === "bigint" || typeof obj === "symbol" || typeof obj === "undefined" || typeof obj === "function") {
    throw TypeError("Invalid");
  }
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      JSONAnalyze(obj[key]);
    }
  }
  return { source: obj, type: "object" };
}
