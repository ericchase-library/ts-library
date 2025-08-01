export function Core_Map_Get_Or_Default<K, V>(map: Map<K, V>, key: K, newValue: () => V): V {
  if (map.has(key)) {
    return map.get(key) as V;
  }
  const value = newValue();
  map.set(key, value);
  return value;
}
