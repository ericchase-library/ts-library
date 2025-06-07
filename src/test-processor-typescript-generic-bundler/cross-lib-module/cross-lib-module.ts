import { var_inner_lib_a } from '../lib-a/inner-lib-a/inner-lib-a.js';
import { var_lib_a } from '../lib-a/lib-a.js';
import { var_inner_module_a } from '../module-a/inner-module-a/inner-module-a.module.js';
import { var_module_a } from '../module-a/module-a.module.js';

// "var_inner_module_a" and "var_module_a" require import remapping in "index.module.js" bundle
console.log(`"var_inner_module_a" and "var_module_a" require import remapping in "index.module.js" bundle`);

export function fn_cross_lib_module() {
  console.log('fn-cross-lib-module');
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}
