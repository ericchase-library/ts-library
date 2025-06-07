import { fn_inner_module_ab, var_inner_module_a } from './inner-module-a/inner-module-a.module.js';
import { var_inner_module_b } from './inner-module-b/inner-module-b.module.js';

export const var_module_a = 'var-module-a';
export function fn_module_a() {
  return 'fn-module-a';
}
export function fn_module_a_inner_module_a() {
  return var_inner_module_a;
}
export function fn_module_a_inner_module_b() {
  return var_inner_module_b;
}
export function fn_module_a_inner_module_ab() {
  return fn_inner_module_ab();
}
