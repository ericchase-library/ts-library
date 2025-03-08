export function MapGuard<K, V>(map: Map<K, V>, key: K, value: V | undefined): value is V {
  return map.has(key);
}

export function Map_GetOrDefault<K, V>(map: Map<K, V>, key: K, newValue: () => V): V {
  let v = map.get(key);
  if (!MapGuard<K, V>(map, key, v)) {
    v = newValue();
    map.set(key, v);
  }
  return v;
}
