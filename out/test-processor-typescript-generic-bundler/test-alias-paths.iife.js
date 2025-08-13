(() => {

// src/test-processor-typescript-generic-bundler/lib-a/inner-lib-b/inner-lib-b.ts
var var_inner_lib_b = "inner-lib-b";
function fn_inner_lib_b() {
  return "fn-inner-lib-b";
}

// src/test-processor-typescript-generic-bundler/lib-a/inner-lib-a/inner-lib-a.ts
var var_inner_lib_a = "inner-lib-a";
function fn_inner_lib_a() {
  return "fn-inner-lib-a";
}
function fn_inner_lib_ab() {
  return var_inner_lib_b;
}

// src/test-processor-typescript-generic-bundler/lib-a/lib-a.ts
var var_lib_a = "lib-a";
function fn_lib_a() {
  return "fn-lib-a";
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

// src/test-processor-typescript-generic-bundler/module-a/inner-module-b/inner-module-b.module.ts
var var_inner_module_b = "var-inner-module-b";
function fn_inner_module_b() {
  return "fn-inner-module-b";
}

// src/test-processor-typescript-generic-bundler/module-a/inner-module-a/inner-module-a.module.ts
var var_inner_module_a = "var-inner-module-a";
function fn_inner_module_a() {
  return "fn-inner-module-a";
}
function fn_inner_module_ab() {
  return var_inner_module_b;
}

// src/test-processor-typescript-generic-bundler/module-a/module-a.module.ts
var var_module_a = "var-module-a";
function fn_module_a() {
  return "fn-module-a";
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

// src/test-processor-typescript-generic-bundler/cross-lib-module/cross-lib-module.ts
console.log(`"var_inner_module_a" and "var_module_a" require import remapping in "index.module.js" bundle`);
function fn_cross_lib_module() {
  console.log("fn-cross-lib-module");
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}

// src/test-processor-typescript-generic-bundler/cross-lib-module/cross-module-lib.module.ts
function fn_cross_module_lib() {
  console.log("fn-cross-module-lib");
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}

// src/test-processor-typescript-generic-bundler/test-alias-paths.iife.ts
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

})();
