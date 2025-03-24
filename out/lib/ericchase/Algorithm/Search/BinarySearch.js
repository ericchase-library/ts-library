import { ArrayEndpoints } from "../Array.js";
import { Midpoint } from "../Math.js";
export function BinarySearch(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = ArrayEndpoints(array);
  let middle = Midpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Midpoint(begin, end);
  }
  if (isOrdered(array[middle - 1], target) === false) {
    return middle - 1;
  }
  return -1;
}
function Insertion(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = ArrayEndpoints(array);
  let middle = Midpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Midpoint(begin, end);
  }
  if (isOrdered(array[middle - 1], target) === false) {
    return middle - 1;
  }
  return middle;
}
BinarySearch.Insertion = Insertion;
