import { fn_inner_lib_ab, var_inner_lib_a } from './inner-lib-a/inner-lib-a.js';
import { var_inner_lib_b } from './inner-lib-b/inner-lib-b.js';

export const var_lib_a = 'lib-a';
export function fn_lib_a() {
  return 'fn-lib-a';
}
export function fn_lib_a_inner_lib_a() {
  return var_inner_lib_a;
}
export function fn_lib_a_inner_lib_b() {
  return var_inner_lib_b;
}
export function fn_lib_a_inner_lib_ab() {
  return fn_inner_lib_ab();
}
