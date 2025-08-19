import { Core_Math_nPr } from './Core_Math_nPr.js';
export function* Core_Math_N_Choose_R_Permutations_Generator(choices, r, repetitions = false) {
  const count = Core_Math_nPr(choices.length, r, repetitions);
  if (repetitions === true) {
    const out = new Array(r).fill(choices[0]);
    const indices = new Array(r).fill(0);
    for (let c = typeof count === 'bigint' ? 0n : 0; c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0; j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length) {
          out[i] = choices[indices[i]];
          break;
        }
        indices[i] = 0;
        out[i] = choices[0];
      }
    }
  } else {
    const out = choices.slice(0, r);
    const indices = [...out.keys()];
    const imap = new Array(choices.length).fill(0);
    for (let i = 0; i < r; i++) {
      imap[i] = 1;
    }
    for (let c = typeof count === 'bigint' ? 0n : 0; c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0; j < r; j++, i--) {
        imap[indices[i]] = 0;
        indices[i]++;
        while (imap[indices[i]] === 1) {
          indices[i]++;
        }
        if (indices[i] < choices.length) {
          imap[indices[i]] = 1;
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (; i < r; i++) {
        if (indices[i] < choices.length) {
          continue;
        }
        indices[i] = 0;
        while (imap[indices[i]] === 1) {
          indices[i]++;
        }
        imap[indices[i]] = 1;
        out[i] = choices[indices[i]];
      }
    }
  }
}
