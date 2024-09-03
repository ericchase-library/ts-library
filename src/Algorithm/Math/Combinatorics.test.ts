import { nChooseRCombinations, nChooseRPermutations, nCr, nPr } from './Combinatorics.js';

import { describe, expect, test } from 'bun:test';

describe('Permutations', () => {
  test('nPr(5, 1)', () => {
    expect(nPr(5, 1)).toBe(5);
  });
  test('5 choose 1 permutations', () => {
    expect(nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 1)).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
  });
  test('nPr(5, 2)', () => {
    expect(nPr(5, 2)).toBe(20);
  });
  test('5 choose 2 permutations', () => {
    expect(nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 2)).toStrictEqual([
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
    expect(nPr(5, 3)).toBe(60);
  });
  test('5 choose 3 permutations', () => {
    expect(nChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 3)).toStrictEqual([
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

describe('Combinations', () => {
  test('nCr(5, 1)', () => {
    expect(nCr(5, 1)).toBe(5);
  });
  test('5 choose 1 combinations', () => {
    expect(nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 1)).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
  });
  test('nCr(5, 2)', () => {
    expect(nCr(5, 2)).toBe(10);
  });
  test('5 choose 2 combinations', () => {
    expect(nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 2)).toStrictEqual([
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
    expect(nCr(5, 3)).toBe(10);
  });
  test('5 choose 3 combinations', () => {
    expect(nChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 3)).toStrictEqual([
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
