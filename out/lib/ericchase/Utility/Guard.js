export function HasMethod(item, key) {
  return typeof item === "object" && item !== null && key in item && typeof item[key] === "function";
}
export function HasProperty(item, key) {
  return typeof item === "object" && item !== null && key in item && typeof item[key] !== "undefined";
}
