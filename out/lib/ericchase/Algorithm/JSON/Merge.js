import { JSONAnalyze } from "src/lib/ericchase/Algorithm/JSON/Analyze.js";
export function JSONMerge(...sources) {
  if (sources.length === 0)
    return null;
  if (sources.length === 1)
    return JSONAnalyze(sources[0]).source;
  const head = JSONAnalyze(sources[0]);
  for (const source of sources.slice(1)) {
    if (JSONAnalyze(source).type !== head.type) {
      throw TypeError("Cannot merge JSON strings of different types. Every JSON string must be all arrays, all objects, or all primitives.");
    }
  }
  if (head.type === "array") {
    const result = [];
    for (const source of sources) {
      result.push(...source);
    }
    return result;
  }
  if (head.type === "object") {
    let mergeInto = function(result, source) {
      for (const key in source) {
        if (Object.hasOwn(source, key)) {
          if (Object.hasOwn(result, key)) {
            const { type: r_type } = JSONAnalyze(result[key]);
            const { type: s_type } = JSONAnalyze(source[key]);
            if (r_type === "object" && s_type === "object") {
              mergeInto(result[key], source[key]);
            } else if (r_type === "array" && s_type === "array") {
              result[key] = [...result[key], ...source[key]];
            } else {
              result[key] = source[key];
            }
          } else {
            result[key] = source[key];
          }
        }
      }
      return result;
    };
    const result = {};
    for (const source of sources) {
      mergeInto(result, source);
    }
    return result;
  }
  return JSONAnalyze(sources[sources.length - 1]).source;
}
