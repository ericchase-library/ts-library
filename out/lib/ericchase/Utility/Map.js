export function MapGuard(map, key, value) {
  return map.has(key);
}
export function Map_GetOrDefault(map, key, newValue) {
  let value = map.get(key);
  if (!MapGuard(map, key, value)) {
    value = newValue();
    map.set(key, value);
  }
  return value;
}
