export function MapGuard<K, V>(map: Map<K, V>, k: K, _v: V | undefined): _v is V {
  return map.has(k);
}

export function Map_GetOrDefault<K, V>(map: Map<K, V>, k: K, newValue: () => V): V {
  let v = map.get(k);
  if (!MapGuard<K, V>(map, k, v)) {
    v = newValue();
    map.set(k, v);
  }
  return v;
}
