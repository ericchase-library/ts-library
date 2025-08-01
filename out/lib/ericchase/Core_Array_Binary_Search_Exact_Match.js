import { Core_Array_Get_Endpoints } from "./Core_Array_Get_Endpoints.js";
import { Core_Math_GetMidpoint } from "./Core_Math_GetMidpoint.js";
export function Core_Array_Binary_Search_Exact_Match(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Core_Array_Get_Endpoints(array);
  let middle = Core_Math_GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core_Math_GetMidpoint(begin, end);
  }
  if (isOrdered(array[middle - 1], target) === false) {
    return middle - 1;
  }
  return -1;
}
