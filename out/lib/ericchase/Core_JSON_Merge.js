import { Core_JSON_Analyze } from './Core_JSON_Analyze.js';
export function Core_JSON_Merge(...sources) {
  if (sources.length === 0) return null;
  if (sources.length === 1) return Core_JSON_Analyze(sources[0]).source;
  const head = Core_JSON_Analyze(sources[0]);
  for (const source of sources.slice(1)) {
    if (Core_JSON_Analyze(source).type !== head.type) {
      throw TypeError('Cannot merge JSON strings of different types. Every JSON string must be all arrays, all objects, or all primitives.');
    }
  }
  if (head.type === 'array') {
    const result = [];
    for (const source of sources) {
      result.push(...source);
    }
    return result;
  }
  if (head.type === 'object') {
    let mergeinto = function (result, source) {
      for (const key in source) {
        if (Object.hasOwn(result, key) === false) {
          result[key] = {};
        }
        const { type: r_type } = Core_JSON_Analyze(result[key]);
        const { type: s_type } = Core_JSON_Analyze(source[key]);
        if (r_type === 'object' && s_type === 'object') {
          mergeinto(result[key], source[key]);
        } else if (r_type === 'array' && s_type === 'array') {
          result[key] = [...result[key], ...source[key]];
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };
    const result = {};
    for (const source of sources) {
      mergeinto(result, source);
    }
    return result;
  }
  return Core_JSON_Analyze(sources[sources.length - 1]).source;
}
