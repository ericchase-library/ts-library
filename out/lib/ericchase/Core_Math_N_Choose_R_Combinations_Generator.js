import { Core_Math_nCr } from "./Core_Math_nCr.js";
export function* Core_Math_N_Choose_R_Combinations_Generator(choices, r, repetitions = false) {
  const count = Core_Math_nCr(choices.length, r, repetitions);
  if (repetitions === true) {
    const out = new Array(r).fill(choices[0]);
    const indices = new Array(r).fill(0);
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length) {
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (i++;i < r; i++) {
        indices[i] = indices[i - 1];
        out[i] = choices[indices[i]];
      }
    }
  } else {
    const out = choices.slice(0, r);
    const indices = [...out.keys()];
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length - j) {
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (i++;i < r; i++) {
        indices[i] = indices[i - 1] + 1;
        out[i] = choices[indices[i]];
      }
    }
  }
}
