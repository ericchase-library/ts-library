import { Factorial } from "src/lib/ericchase/Algorithm/Math/Factorial.js";
export function nCr(n, r, repetitions = false) {
  if (repetitions === true) {
    return Factorial(n + r - 1) / (Factorial(r) * Factorial(n - 1));
  }
  return Factorial(n) / (Factorial(r) * Factorial(n - r));
}
export function nPr(n, r, repetitions = false) {
  if (repetitions === true) {
    return BigInt(n) ** BigInt(r);
  }
  return Factorial(n) / Factorial(n - r);
}
export function* nChooseRCombinations(choices, r, repetitions = false) {
  const count = nCr(choices.length, r, repetitions);
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
export function* nChooseRPermutations(choices, r, repetitions = false) {
  const count = nPr(choices.length, r, repetitions);
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
        indices[i] = 0;
        out[i] = choices[0];
      }
    }
  } else {
    const out = choices.slice(0, r);
    const indices = [...out.keys()];
    const imap = new Array(choices.length).fill(0);
    for (let i = 0;i < r; i++) {
      imap[i] = 1;
    }
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
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
      for (;i < r; i++) {
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
