// src/test-processor-typescript-generic-bundler/lib-a/inner-lib-a/inner-lib-a.ts
var var_inner_lib_a = "inner-lib-a";

// src/test-processor-typescript-generic-bundler/lib-a/lib-a.ts
var var_lib_a = "lib-a";

// src/test-processor-typescript-generic-bundler/cross-lib-module/cross-module-lib.module.ts
import { var_inner_module_a } from "../module-a/inner-module-a/inner-module-a.module.js";
import { var_module_a } from "../module-a/module-a.module.js";
function fn_cross_module_lib() {
  console.log("fn-cross-module-lib");
  console.log(var_lib_a);
  console.log(var_inner_lib_a);
  console.log(var_module_a);
  console.log(var_inner_module_a);
}
export {
  fn_cross_module_lib
};
