import { Endpoints } from '../Array/Endpoints.js';
import { midpoint } from '../Math/Midpoint.js';
export function BinarySearch(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Endpoints(array);
  let middle = midpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      if (!isOrdered(array[middle], target)) {
        break;
      }
      begin = middle + 1;
    }
    middle = midpoint(begin, end);
  }
  return middle;
}
BinarySearch.Lower = function (array, target, isOrdered = (a, b) => a < b) {
  return BinarySearch.Upper(array, target, (a, b) => isOrdered(a, b) || !isOrdered(b, a)) + 1;
};
BinarySearch.Upper = function (array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Endpoints(array);
  let middle = midpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = midpoint(begin, end);
  }
  return middle - 1;
};
