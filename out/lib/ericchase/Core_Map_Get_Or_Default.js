export function Core_Map_Get_Or_Default(map, key, newValue) {
  if (map.has(key)) {
    return map.get(key);
  }
  const value = newValue();
  map.set(key, value);
  return value;
}
export async function Async_Core_Map_Get_Or_Default(map, key, newValue) {
  if (map.has(key)) {
    return map.get(key);
  }
  const value = await newValue();
  map.set(key, value);
  return value;
}
