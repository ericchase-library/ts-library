import { ArrayEndpoints } from "src/lib/ericchase/Algorithm/Array.js";
import { Midpoint } from "src/lib/ericchase/Algorithm/Math.js";
export function BinarySearch(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = ArrayEndpoints(array);
  let middle = Midpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      if (!isOrdered(array[middle], target)) {
        break;
      }
      begin = middle + 1;
    }
    middle = Midpoint(begin, end);
  }
  return middle;
}
function Lower(array, target, isOrdered = (a, b) => a < b) {
  return BinarySearch.Upper(array, target, (a, b) => isOrdered(a, b) || !isOrdered(b, a)) + 1;
}
function Upper(array, target, isOrdered = (a, b) => a < b) {
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
  return middle - 1;
}
BinarySearch.Lower = Lower;
BinarySearch.Upper = Upper;
