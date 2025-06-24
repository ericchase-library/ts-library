import { Core_Array_GetEndpoints } from './Core_Array_GetEndpoints.js';
import { Core_Math_GetMidpoint } from './Core_Math_GetMidpoint.js';

export function Core_Array_BinarySearch_InsertionIndex<T>(array: T[], target: T, isOrdered: (a: T, b: T) => boolean = (a: T, b: T) => a < b): number {
  /** Returns index of item that "equals" target; otherwise, index of item "less" than target. */
  let [begin, end] = Core_Array_GetEndpoints(array);
  let middle = Core_Math_GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core_Math_GetMidpoint(begin, end);
  }
  return middle - 1;
}
