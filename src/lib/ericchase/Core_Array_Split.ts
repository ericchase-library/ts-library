import { Core_Array_Gen_Chunks } from './Core_Array_Gen_Chunks.js';

export function Core_Array_Split<T>(array: T[], count: number): T[][] {
  return [...Core_Array_Gen_Chunks(array, count)].map((chunk) => chunk.slice);
}
