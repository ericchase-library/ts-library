import { Factorial } from './Factorial.js';
export function nPr(n, r) {
  return Factorial(n) / Factorial(n - r);
}
export function nCr(n, r) {
  return Factorial(n) / (Factorial(r) * Factorial(n - r));
}
export function nChooseRPermutations(choices, r) {
  function incrementIndices(indices, n) {
    const last = indices.length - 1;
    ++indices[last];
    let i = last;
    while (i >= 0) {
      while (indices.slice(0, i).includes(indices[i])) {
        ++indices[i];
      }
      const end = n;
      if (indices[i] < end) {
        if (++i < indices.length) {
          indices[i] = 0;
        } else {
          break;
        }
      } else {
        ++indices[--i];
      }
    }
  }
  const n = choices.length;
  const permutationCount = nPr(n, r);
  const indexList = Array.from(new Array(r).keys());
  const permutations = new Array(permutationCount);
  for (let c = 0; c < permutationCount; ++c) {
    permutations[c] = indexList.map((i) => choices[i]);
    incrementIndices(indexList, n);
  }
  return permutations;
}
export function nChooseRCombinations(choices, r) {
  function incrementIndices(indices, n) {
    const last = indices.length - 1;
    ++indices[last];
    let i = last;
    while (i >= 0) {
      const end = i < last ? indices[i + 1] : n;
      if (indices[i] < end) {
        if (++i < indices.length) {
          indices[i] = indices[i - 1] + 1;
        } else {
          break;
        }
      } else {
        ++indices[--i];
      }
    }
  }
  const n = choices.length;
  const combinationCount = nCr(n, r);
  const indexList = Array.from(new Array(r).keys());
  const combinations = new Array(combinationCount);
  for (let c = 0; c < combinationCount; ++c) {
    combinations[c] = indexList.map((i) => choices[i]);
    incrementIndices(indexList, n);
  }
  return combinations;
}
