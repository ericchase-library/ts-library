import { describe, expect, test } from 'bun:test';

import { nChooseRCombinations, nChooseRPermutations, nCr, nPr } from './Combinatorics.js';

describe('Permutations', () => {
  describe('without repetitions', () => {
    test('nPr(5, 1)', () => {
      expect(nPr(5, 1)).toBe(5n);
    });
    test('5 choose 1 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 1)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
    });
    test('nPr(5, 2)', () => {
      expect(nPr(5, 2)).toBe(20n);
    });
    test('5 choose 2 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 2)]).toStrictEqual([
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e'],
        ['b', 'a'],
        ['b', 'c'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'a'],
        ['c', 'b'],
        ['c', 'd'],
        ['c', 'e'],
        ['d', 'a'],
        ['d', 'b'],
        ['d', 'c'],
        ['d', 'e'],
        ['e', 'a'],
        ['e', 'b'],
        ['e', 'c'],
        ['e', 'd'],
      ]);
    });
    test('nPr(5, 3)', () => {
      expect(nPr(5, 3)).toBe(60n);
    });
    test('5 choose 3 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 3)]).toStrictEqual([
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'b', 'e'],
        ['a', 'c', 'b'],
        ['a', 'c', 'd'],
        ['a', 'c', 'e'],
        ['a', 'd', 'b'],
        ['a', 'd', 'c'],
        ['a', 'd', 'e'],
        ['a', 'e', 'b'],
        ['a', 'e', 'c'],
        ['a', 'e', 'd'],
        ['b', 'a', 'c'],
        ['b', 'a', 'd'],
        ['b', 'a', 'e'],
        ['b', 'c', 'a'],
        ['b', 'c', 'd'],
        ['b', 'c', 'e'],
        ['b', 'd', 'a'],
        ['b', 'd', 'c'],
        ['b', 'd', 'e'],
        ['b', 'e', 'a'],
        ['b', 'e', 'c'],
        ['b', 'e', 'd'],
        ['c', 'a', 'b'],
        ['c', 'a', 'd'],
        ['c', 'a', 'e'],
        ['c', 'b', 'a'],
        ['c', 'b', 'd'],
        ['c', 'b', 'e'],
        ['c', 'd', 'a'],
        ['c', 'd', 'b'],
        ['c', 'd', 'e'],
        ['c', 'e', 'a'],
        ['c', 'e', 'b'],
        ['c', 'e', 'd'],
        ['d', 'a', 'b'],
        ['d', 'a', 'c'],
        ['d', 'a', 'e'],
        ['d', 'b', 'a'],
        ['d', 'b', 'c'],
        ['d', 'b', 'e'],
        ['d', 'c', 'a'],
        ['d', 'c', 'b'],
        ['d', 'c', 'e'],
        ['d', 'e', 'a'],
        ['d', 'e', 'b'],
        ['d', 'e', 'c'],
        ['e', 'a', 'b'],
        ['e', 'a', 'c'],
        ['e', 'a', 'd'],
        ['e', 'b', 'a'],
        ['e', 'b', 'c'],
        ['e', 'b', 'd'],
        ['e', 'c', 'a'],
        ['e', 'c', 'b'],
        ['e', 'c', 'd'],
        ['e', 'd', 'a'],
        ['e', 'd', 'b'],
        ['e', 'd', 'c'],
      ]);
    });
  });
  describe('with repetitions', () => {
    test('nPr(5, 1, true)', () => {
      expect(nPr(5, 1, true)).toBe(5n);
    });
    test('5 choose 1 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 1, true)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
    });
    test('nPr(5, 2, true)', () => {
      expect(nPr(5, 2, true)).toBe(25n);
    });
    test('5 choose 2 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 2, true)]).toStrictEqual([
        ['a', 'a'],
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e'],
        ['b', 'a'],
        ['b', 'b'],
        ['b', 'c'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'a'],
        ['c', 'b'],
        ['c', 'c'],
        ['c', 'd'],
        ['c', 'e'],
        ['d', 'a'],
        ['d', 'b'],
        ['d', 'c'],
        ['d', 'd'],
        ['d', 'e'],
        ['e', 'a'],
        ['e', 'b'],
        ['e', 'c'],
        ['e', 'd'],
        ['e', 'e'],
      ]);
    });
    test('nPr(5, 3, true)', () => {
      expect(nPr(5, 3, true)).toBe(125n);
    });
    test('5 choose 3 permutations', () => {
      expect([...nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 3, true)]).toStrictEqual([
        ['a', 'a', 'a'],
        ['a', 'a', 'b'],
        ['a', 'a', 'c'],
        ['a', 'a', 'd'],
        ['a', 'a', 'e'],
        ['a', 'b', 'a'],
        ['a', 'b', 'b'],
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'b', 'e'],
        ['a', 'c', 'a'],
        ['a', 'c', 'b'],
        ['a', 'c', 'c'],
        ['a', 'c', 'd'],
        ['a', 'c', 'e'],
        ['a', 'd', 'a'],
        ['a', 'd', 'b'],
        ['a', 'd', 'c'],
        ['a', 'd', 'd'],
        ['a', 'd', 'e'],
        ['a', 'e', 'a'],
        ['a', 'e', 'b'],
        ['a', 'e', 'c'],
        ['a', 'e', 'd'],
        ['a', 'e', 'e'],
        ['b', 'a', 'a'],
        ['b', 'a', 'b'],
        ['b', 'a', 'c'],
        ['b', 'a', 'd'],
        ['b', 'a', 'e'],
        ['b', 'b', 'a'],
        ['b', 'b', 'b'],
        ['b', 'b', 'c'],
        ['b', 'b', 'd'],
        ['b', 'b', 'e'],
        ['b', 'c', 'a'],
        ['b', 'c', 'b'],
        ['b', 'c', 'c'],
        ['b', 'c', 'd'],
        ['b', 'c', 'e'],
        ['b', 'd', 'a'],
        ['b', 'd', 'b'],
        ['b', 'd', 'c'],
        ['b', 'd', 'd'],
        ['b', 'd', 'e'],
        ['b', 'e', 'a'],
        ['b', 'e', 'b'],
        ['b', 'e', 'c'],
        ['b', 'e', 'd'],
        ['b', 'e', 'e'],
        ['c', 'a', 'a'],
        ['c', 'a', 'b'],
        ['c', 'a', 'c'],
        ['c', 'a', 'd'],
        ['c', 'a', 'e'],
        ['c', 'b', 'a'],
        ['c', 'b', 'b'],
        ['c', 'b', 'c'],
        ['c', 'b', 'd'],
        ['c', 'b', 'e'],
        ['c', 'c', 'a'],
        ['c', 'c', 'b'],
        ['c', 'c', 'c'],
        ['c', 'c', 'd'],
        ['c', 'c', 'e'],
        ['c', 'd', 'a'],
        ['c', 'd', 'b'],
        ['c', 'd', 'c'],
        ['c', 'd', 'd'],
        ['c', 'd', 'e'],
        ['c', 'e', 'a'],
        ['c', 'e', 'b'],
        ['c', 'e', 'c'],
        ['c', 'e', 'd'],
        ['c', 'e', 'e'],
        ['d', 'a', 'a'],
        ['d', 'a', 'b'],
        ['d', 'a', 'c'],
        ['d', 'a', 'd'],
        ['d', 'a', 'e'],
        ['d', 'b', 'a'],
        ['d', 'b', 'b'],
        ['d', 'b', 'c'],
        ['d', 'b', 'd'],
        ['d', 'b', 'e'],
        ['d', 'c', 'a'],
        ['d', 'c', 'b'],
        ['d', 'c', 'c'],
        ['d', 'c', 'd'],
        ['d', 'c', 'e'],
        ['d', 'd', 'a'],
        ['d', 'd', 'b'],
        ['d', 'd', 'c'],
        ['d', 'd', 'd'],
        ['d', 'd', 'e'],
        ['d', 'e', 'a'],
        ['d', 'e', 'b'],
        ['d', 'e', 'c'],
        ['d', 'e', 'd'],
        ['d', 'e', 'e'],
        ['e', 'a', 'a'],
        ['e', 'a', 'b'],
        ['e', 'a', 'c'],
        ['e', 'a', 'd'],
        ['e', 'a', 'e'],
        ['e', 'b', 'a'],
        ['e', 'b', 'b'],
        ['e', 'b', 'c'],
        ['e', 'b', 'd'],
        ['e', 'b', 'e'],
        ['e', 'c', 'a'],
        ['e', 'c', 'b'],
        ['e', 'c', 'c'],
        ['e', 'c', 'd'],
        ['e', 'c', 'e'],
        ['e', 'd', 'a'],
        ['e', 'd', 'b'],
        ['e', 'd', 'c'],
        ['e', 'd', 'd'],
        ['e', 'd', 'e'],
        ['e', 'e', 'a'],
        ['e', 'e', 'b'],
        ['e', 'e', 'c'],
        ['e', 'e', 'd'],
        ['e', 'e', 'e'],
      ]);
    });
  });
});

describe('Combinations', () => {
  describe('without repetitions', () => {
    test('nCr(5, 1)', () => {
      expect(nCr(5, 1)).toBe(5n);
    });
    test('5 choose 1 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 1)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
    });
    test('nCr(5, 2)', () => {
      expect(nCr(5, 2)).toBe(10n);
    });
    test('5 choose 2 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 2)]).toStrictEqual([
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e'],
        ['b', 'c'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'd'],
        ['c', 'e'],
        ['d', 'e'],
      ]);
    });
    test('nCr(5, 3)', () => {
      expect(nCr(5, 3)).toBe(10n);
    });
    test('5 choose 3 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 3)]).toStrictEqual([
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'b', 'e'],
        ['a', 'c', 'd'],
        ['a', 'c', 'e'],
        ['a', 'd', 'e'],
        ['b', 'c', 'd'],
        ['b', 'c', 'e'],
        ['b', 'd', 'e'],
        ['c', 'd', 'e'],
      ]);
    });
  });
  describe('with repetitions', () => {
    test('nCr(5, 1, true)', () => {
      expect(nCr(5, 1, true)).toBe(5n);
    });
    test('5 choose 1 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 1, true)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
    });
    test('nCr(5, 2, true)', () => {
      expect(nCr(5, 2, true)).toBe(15n);
    });
    test('5 choose 2 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 2, true)]).toStrictEqual([
        ['a', 'a'],
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e'],
        ['b', 'b'],
        ['b', 'c'],
        ['b', 'd'],
        ['b', 'e'],
        ['c', 'c'],
        ['c', 'd'],
        ['c', 'e'],
        ['d', 'd'],
        ['d', 'e'],
        ['e', 'e'],
      ]);
    });
    test('nCr(5, 3, true)', () => {
      expect(nCr(5, 3, true)).toBe(35n);
    });
    test('5 choose 3 combinations', () => {
      expect([...nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 3, true)]).toStrictEqual([
        ['a', 'a', 'a'],
        ['a', 'a', 'b'],
        ['a', 'a', 'c'],
        ['a', 'a', 'd'],
        ['a', 'a', 'e'],
        ['a', 'b', 'b'],
        ['a', 'b', 'c'],
        ['a', 'b', 'd'],
        ['a', 'b', 'e'],
        ['a', 'c', 'c'],
        ['a', 'c', 'd'],
        ['a', 'c', 'e'],
        ['a', 'd', 'd'],
        ['a', 'd', 'e'],
        ['a', 'e', 'e'],
        ['b', 'b', 'b'],
        ['b', 'b', 'c'],
        ['b', 'b', 'd'],
        ['b', 'b', 'e'],
        ['b', 'c', 'c'],
        ['b', 'c', 'd'],
        ['b', 'c', 'e'],
        ['b', 'd', 'd'],
        ['b', 'd', 'e'],
        ['b', 'e', 'e'],
        ['c', 'c', 'c'],
        ['c', 'c', 'd'],
        ['c', 'c', 'e'],
        ['c', 'd', 'd'],
        ['c', 'd', 'e'],
        ['c', 'e', 'e'],
        ['d', 'd', 'd'],
        ['d', 'd', 'e'],
        ['d', 'e', 'e'],
        ['e', 'e', 'e'],
      ]);
    });
  });
});

describe('2-Combinations', () => {
  // The 2-Combination is what I formerly referred as the SelfCartesianProduct:
  // export function* SelfCartesianProduct<T extends readonly unknown[]>(array: T): Generator<[T[number], T[number]], void, unknown> {
  //   for (let i = 0; i < array.length; i++) {
  //     for (let j = i + 1; j < array.length; j++) {
  //       yield [array[i], array[j]];
  //     }
  //   }
  // }
  describe('homogeneous', () => {
    test('[1, 2]', () => {
      expect([...nChooseRCombinations([1, 2], 2)]).toEqual([[1, 2]]);
    });
    test('[1, 2, 3]', () => {
      expect([...nChooseRCombinations([1, 2, 3], 2)]).toEqual([
        [1, 2],
        [1, 3],
        [2, 3],
      ]);
    });
    test('[1, 2, 3, 4]', () => {
      expect([...nChooseRCombinations([1, 2, 3, 4], 2)]).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ]);
    });
    test('[1, 2, 3, 4, 5]', () => {
      expect([...nChooseRCombinations([1, 2, 3, 4, 5], 2)]).toEqual([
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [2, 3],
        [2, 4],
        [2, 5],
        [3, 4],
        [3, 5],
        [4, 5],
      ]);
    });
  });
  describe('heterogeneous', () => {
    test("[1, 'b']", () => {
      expect([...nChooseRCombinations([1, 'b'], 2)]).toEqual([[1, 'b']]);
    });
    test("[1, 'b', 3]", () => {
      expect([...nChooseRCombinations([1, 'b', 3], 2)]).toEqual([
        [1, 'b'],
        [1, 3],
        ['b', 3],
      ]);
    });
    test("[1, 'b', 3, 'd']", () => {
      expect([...nChooseRCombinations([1, 'b', 3, 'd'], 2)]).toEqual([
        [1, 'b'],
        [1, 3],
        [1, 'd'],
        ['b', 3],
        ['b', 'd'],
        [3, 'd'],
      ]);
    });
    test("[1, 'b', 3, 'd', 5]", () => {
      expect([...nChooseRCombinations([1, 'b', 3, 'd', 5], 2)]).toEqual([
        [1, 'b'],
        [1, 3],
        [1, 'd'],
        [1, 5],
        ['b', 3],
        ['b', 'd'],
        ['b', 5],
        [3, 'd'],
        [3, 5],
        ['d', 5],
      ]);
    });
  });
});
