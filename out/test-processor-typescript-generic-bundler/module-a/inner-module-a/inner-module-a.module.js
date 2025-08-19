// src/test-processor-typescript-generic-bundler/module-a/inner-module-a/inner-module-a.module.ts
import { var_inner_module_b } from '../inner-module-b/inner-module-b.module.js';
var var_inner_module_a = 'var-inner-module-a';
function fn_inner_module_a() {
  return 'fn-inner-module-a';
}
function fn_inner_module_ab() {
  return var_inner_module_b;
}
export { var_inner_module_a, fn_inner_module_ab, fn_inner_module_a };
