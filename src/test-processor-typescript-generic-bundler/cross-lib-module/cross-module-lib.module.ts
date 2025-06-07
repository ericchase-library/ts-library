import { var_inner_lib_a } from '../lib-a/inner-lib-a/inner-lib-a.js';
import { var_lib_a } from '../lib-a/lib-a.js';
import { var_inner_module_a } from '../module-a/inner-module-a/inner-module-a.module.js';
import { var_module_a } from '../module-a/module-a.module.js';

export function fn_cross_module_lib() {
  console.log('fn-cross-module-lib');
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}
