export function Core_Array_Shuffle(items, in_place = true) {
  const last = items.length - 1;
  for (let i = 0;i < items.length; i++) {
    let random = Math.floor(Math.random() * last);
    [items[last], items[random]] = [items[random], items[last]];
  }
  return items;
}
