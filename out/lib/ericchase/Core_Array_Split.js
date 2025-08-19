import { Core_Array_Chunks_Generator } from './Core_Array_Chunks_Generator.js';
export function Core_Array_Split(array, count) {
  return [...Core_Array_Chunks_Generator(array, count)].map((chunk) => chunk.slice);
}
