// src/test-processor-typescript-generic-bundler/module-a/module-a.module.ts
import { fn_inner_module_ab, var_inner_module_a } from './inner-module-a/inner-module-a.module.js';
import { var_inner_module_b } from './inner-module-b/inner-module-b.module.js';
var var_module_a = 'var-module-a';
function fn_module_a() {
  return 'fn-module-a';
}
function fn_module_a_inner_module_a() {
  return var_inner_module_a;
}
function fn_module_a_inner_module_b() {
  return var_inner_module_b;
}
function fn_module_a_inner_module_ab() {
  return fn_inner_module_ab();
}
export { var_module_a, fn_module_a_inner_module_b, fn_module_a_inner_module_ab, fn_module_a_inner_module_a, fn_module_a };
