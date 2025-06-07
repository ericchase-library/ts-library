import { var_inner_module_b } from '../inner-module-b/inner-module-b.module.js';

export const var_inner_module_a = 'var-inner-module-a';
export function fn_inner_module_a() {
  return 'fn-inner-module-a';
}
export function fn_inner_module_ab() {
  return var_inner_module_b;
}
