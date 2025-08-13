import { fn_cross_lib_module } from 'src/test-processor-typescript-generic-bundler/cross-lib-module/cross-lib-module.js';
import { fn_cross_module_lib } from 'src/test-processor-typescript-generic-bundler/cross-lib-module/cross-module-lib.module.js';
import { fn_inner_lib_a, fn_inner_lib_ab, var_inner_lib_a } from 'src/test-processor-typescript-generic-bundler/lib-a/inner-lib-a/inner-lib-a.js';
import { fn_inner_lib_b, var_inner_lib_b } from 'src/test-processor-typescript-generic-bundler/lib-a/inner-lib-b/inner-lib-b.js';
import { fn_lib_a, fn_lib_a_inner_lib_a, fn_lib_a_inner_lib_ab, fn_lib_a_inner_lib_b, var_lib_a } from 'src/test-processor-typescript-generic-bundler/lib-a/lib-a.js';
import { fn_inner_module_a, fn_inner_module_ab, var_inner_module_a } from 'src/test-processor-typescript-generic-bundler/module-a/inner-module-a/inner-module-a.module.js';
import { fn_inner_module_b, var_inner_module_b } from 'src/test-processor-typescript-generic-bundler/module-a/inner-module-b/inner-module-b.module.js';
import { fn_module_a, fn_module_a_inner_module_a, fn_module_a_inner_module_ab, fn_module_a_inner_module_b, var_module_a } from 'src/test-processor-typescript-generic-bundler/module-a/module-a.module.js';

console.log(var_lib_a);
console.log(var_inner_lib_a);
console.log(var_inner_lib_b);
console.log(fn_lib_a());
console.log(fn_lib_a_inner_lib_a());
console.log(fn_lib_a_inner_lib_b());
console.log(fn_lib_a_inner_lib_ab());
console.log(fn_inner_lib_a());
console.log(fn_inner_lib_ab());
console.log(fn_inner_lib_b());

console.log(var_module_a);
console.log(var_inner_module_a);
console.log(var_inner_module_b);
console.log(fn_module_a());
console.log(fn_module_a_inner_module_a());
console.log(fn_module_a_inner_module_b());
console.log(fn_module_a_inner_module_ab());
console.log(fn_inner_module_a());
console.log(fn_inner_module_ab());
console.log(fn_inner_module_b());

fn_cross_lib_module();
fn_cross_module_lib();
