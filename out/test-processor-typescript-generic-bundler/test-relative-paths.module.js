// src/test-processor-typescript-generic-bundler/lib-a/inner-lib-b/inner-lib-b.ts
var var_inner_lib_b = 'inner-lib-b';
function fn_inner_lib_b() {
  return 'fn-inner-lib-b';
}

// src/test-processor-typescript-generic-bundler/lib-a/inner-lib-a/inner-lib-a.ts
var var_inner_lib_a = 'inner-lib-a';
function fn_inner_lib_a() {
  return 'fn-inner-lib-a';
}
function fn_inner_lib_ab() {
  return var_inner_lib_b;
}

// src/test-processor-typescript-generic-bundler/lib-a/lib-a.ts
var var_lib_a = 'lib-a';
function fn_lib_a() {
  return 'fn-lib-a';
}
function fn_lib_a_inner_lib_a() {
  return var_inner_lib_a;
}
function fn_lib_a_inner_lib_b() {
  return var_inner_lib_b;
}
function fn_lib_a_inner_lib_ab() {
  return fn_inner_lib_ab();
}

// src/test-processor-typescript-generic-bundler/cross-lib-module/cross-lib-module.ts
import { var_inner_module_a } from './module-a/inner-module-a/inner-module-a.module.js';
import { var_module_a } from './module-a/module-a.module.js';
console.log(`"var_inner_module_a" and "var_module_a" require import remapping in "index.module.js" bundle`);
function fn_cross_lib_module() {
  console.log('fn-cross-lib-module');
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}

// src/test-processor-typescript-generic-bundler/test-relative-paths.module.ts
import { fn_cross_module_lib } from './cross-lib-module/cross-module-lib.module.js';
import { fn_inner_module_a, fn_inner_module_ab, var_inner_module_a as var_inner_module_a2 } from './module-a/inner-module-a/inner-module-a.module.js';
import { fn_inner_module_b, var_inner_module_b } from './module-a/inner-module-b/inner-module-b.module.js';
import { fn_module_a, fn_module_a_inner_module_a, fn_module_a_inner_module_ab, fn_module_a_inner_module_b, var_module_a as var_module_a2 } from './module-a/module-a.module.js';
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
console.log(var_module_a2);
console.log(var_inner_module_a2);
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
