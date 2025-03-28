import { describe, expect, test } from 'bun:test';
import { CartesianProduct, nCartesianProduct } from './CartesianProduct.js';

describe(CartesianProduct.name, () => {
  describe('homogeneous & same type', () => {
    test('[1], [2]', () => {
      expect(Array.from(CartesianProduct([1], [2]))).toEqual([[1, 2]]);
    });
    test('[1, 2], [3]', () => {
      expect(Array.from(CartesianProduct([1, 2], [3]))).toEqual([
        [1, 3],
        [2, 3],
      ]);
    });
    test('[1], [2, 3]', () => {
      expect(Array.from(CartesianProduct([1], [2, 3]))).toEqual([
        [1, 2],
        [1, 3],
      ]);
    });
    test('[1, 2], [3, 4]', () => {
      expect(Array.from(CartesianProduct([1, 2], [3, 4]))).toEqual([
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
      ]);
    });
    test('[1, 2, 3], [4, 5]', () => {
      expect(Array.from(CartesianProduct([1, 2, 3], [4, 5]))).toEqual([
        [1, 4],
        [1, 5],
        [2, 4],
        [2, 5],
        [3, 4],
        [3, 5],
      ]);
    });
    test('[1, 2], [3, 4, 5]', () => {
      expect(Array.from(CartesianProduct([1, 2], [3, 4, 5]))).toEqual([
        [1, 3],
        [1, 4],
        [1, 5],
        [2, 3],
        [2, 4],
        [2, 5],
      ]);
    });
    test('[1, 2, 3], [4, 5, 6]', () => {
      expect(Array.from(CartesianProduct([1, 2, 3], [4, 5, 6]))).toEqual([
        [1, 4],
        [1, 5],
        [1, 6],
        [2, 4],
        [2, 5],
        [2, 6],
        [3, 4],
        [3, 5],
        [3, 6],
      ]);
    });
  });
  describe('homogeneous & different types', () => {
    test("[1], ['a']", () => {
      expect(Array.from(CartesianProduct([1], ['a']))).toEqual([[1, 'a']]);
    });
    test("[1, 2], ['a']", () => {
      expect(Array.from(CartesianProduct([1, 2], ['a']))).toEqual([
        [1, 'a'],
        [2, 'a'],
      ]);
    });
    test("[1], ['a', 'b']", () => {
      expect(Array.from(CartesianProduct([1], ['a', 'b']))).toEqual([
        [1, 'a'],
        [1, 'b'],
      ]);
    });
    test("[1, 2], ['a', 'b']", () => {
      expect(Array.from(CartesianProduct([1, 2], ['a', 'b']))).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
      ]);
    });
    test("[1, 2, 3], ['a', 'b']", () => {
      expect(Array.from(CartesianProduct([1, 2, 3], ['a', 'b']))).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
        [3, 'a'],
        [3, 'b'],
      ]);
    });
    test("[1, 2], ['a', 'b', 'c']", () => {
      expect(Array.from(CartesianProduct([1, 2], ['a', 'b', 'c']))).toEqual([
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'a'],
        [2, 'b'],
        [2, 'c'],
      ]);
    });
    test("[1, 2, 3], ['a', 'b', 'c']", () => {
      expect(Array.from(CartesianProduct([1, 2, 3], ['a', 'b', 'c']))).toEqual([
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'a'],
        [2, 'b'],
        [2, 'c'],
        [3, 'a'],
        [3, 'b'],
        [3, 'c'],
      ]);
    });
  });
  describe('heterogeneous', () => {
    test("[1, 'a'], [2]", () => {
      expect(Array.from(CartesianProduct([1, 'a'], [2]))).toEqual([
        [1, 2],
        ['a', 2],
      ]);
    });
    test("[1], ['a', 2]", () => {
      expect(Array.from(CartesianProduct([1], ['a', 2]))).toEqual([
        [1, 'a'],
        [1, 2],
      ]);
    });
    test("[1, 'a'], [2, 'b']", () => {
      expect(Array.from(CartesianProduct([1, 'a'], [2, 'b']))).toEqual([
        [1, 2],
        [1, 'b'],
        ['a', 2],
        ['a', 'b'],
      ]);
    });
    test("[1, 'a', 3], ['b', 2]", () => {
      expect(Array.from(CartesianProduct([1, 'a', 3], ['b', 2]))).toEqual([
        [1, 'b'],
        [1, 2],
        ['a', 'b'],
        ['a', 2],
        [3, 'b'],
        [3, 2],
      ]);
    });
    test("[1, 'b'], ['a', 2, 'c']", () => {
      expect(Array.from(CartesianProduct([1, 'b'], ['a', 2, 'c']))).toEqual([
        [1, 'a'],
        [1, 2],
        [1, 'c'],
        ['b', 'a'],
        ['b', 2],
        ['b', 'c'],
      ]);
    });
    test("[1, 'b', 3], ['a', 2, 'c']", () => {
      expect(Array.from(CartesianProduct([1, 'b', 3], ['a', 2, 'c']))).toEqual([
        [1, 'a'],
        [1, 2],
        [1, 'c'],
        ['b', 'a'],
        ['b', 2],
        ['b', 'c'],
        [3, 'a'],
        [3, 2],
        [3, 'c'],
      ]);
    });
  });
});

describe(nCartesianProduct.name, () => {
  describe('homogeneous & same type', () => {
    test('[1], [2], [3]', () => {
      expect(Array.from(nCartesianProduct([1], [2], [3]))).toEqual([[1, 2, 3]]);
    });
    test('[1, 2], [3], [4]', () => {
      expect(Array.from(nCartesianProduct([1, 2], [3], [4]))).toEqual([
        [1, 3, 4],
        [2, 3, 4],
      ]);
    });
    test('[1], [2, 3], [4]', () => {
      expect(Array.from(nCartesianProduct([1], [2, 3], [4]))).toEqual([
        [1, 2, 4],
        [1, 3, 4],
      ]);
    });
    test('[1], [2], [3, 4]', () => {
      expect(Array.from(nCartesianProduct([1], [2], [3, 4]))).toEqual([
        [1, 2, 3],
        [1, 2, 4],
      ]);
    });
    test('[1, 2], [3, 4], [5]', () => {
      expect(Array.from(nCartesianProduct([1, 2], [3, 4], [5]))).toEqual([
        [1, 3, 5],
        [1, 4, 5],
        [2, 3, 5],
        [2, 4, 5],
      ]);
    });
    test('[1, 2], [3, 4], [5, 6]', () => {
      expect(Array.from(nCartesianProduct([1, 2], [3, 4], [5, 6]))).toEqual([
        [1, 3, 5],
        [1, 3, 6],
        [1, 4, 5],
        [1, 4, 6],
        [2, 3, 5],
        [2, 3, 6],
        [2, 4, 5],
        [2, 4, 6],
      ]);
    });
    test('[1, 2, 3], [4, 5], [6]', () => {
      expect(Array.from(nCartesianProduct([1, 2, 3], [4, 5], [6]))).toEqual([
        [1, 4, 6],
        [1, 5, 6],
        [2, 4, 6],
        [2, 5, 6],
        [3, 4, 6],
        [3, 5, 6],
      ]);
    });
    test('[1, 2, 3], [4, 5], [6, 7]', () => {
      expect(Array.from(nCartesianProduct([1, 2, 3], [4, 5], [6, 7]))).toEqual([
        [1, 4, 6],
        [1, 4, 7],
        [1, 5, 6],
        [1, 5, 7],
        [2, 4, 6],
        [2, 4, 7],
        [2, 5, 6],
        [2, 5, 7],
        [3, 4, 6],
        [3, 4, 7],
        [3, 5, 6],
        [3, 5, 7],
      ]);
    });
    test('[1, 2, 3], [4, 5], [6, 7, 8]', () => {
      expect(Array.from(nCartesianProduct([1, 2, 3], [4, 5], [6, 7, 8]))).toEqual([
        [1, 4, 6],
        [1, 4, 7],
        [1, 4, 8],
        [1, 5, 6],
        [1, 5, 7],
        [1, 5, 8],
        [2, 4, 6],
        [2, 4, 7],
        [2, 4, 8],
        [2, 5, 6],
        [2, 5, 7],
        [2, 5, 8],
        [3, 4, 6],
        [3, 4, 7],
        [3, 4, 8],
        [3, 5, 6],
        [3, 5, 7],
        [3, 5, 8],
      ]);
    });
    test('[1, 2, 3, 4], [5, 6, 7], [8, 9], [10]', () => {
      expect(Array.from(nCartesianProduct([1, 2, 3, 4], [5, 6, 7], [8, 9], [10]))).toEqual([
        [1, 5, 8, 10],
        [1, 5, 9, 10],
        [1, 6, 8, 10],
        [1, 6, 9, 10],
        [1, 7, 8, 10],
        [1, 7, 9, 10],
        [2, 5, 8, 10],
        [2, 5, 9, 10],
        [2, 6, 8, 10],
        [2, 6, 9, 10],
        [2, 7, 8, 10],
        [2, 7, 9, 10],
        [3, 5, 8, 10],
        [3, 5, 9, 10],
        [3, 6, 8, 10],
        [3, 6, 9, 10],
        [3, 7, 8, 10],
        [3, 7, 9, 10],
        [4, 5, 8, 10],
        [4, 5, 9, 10],
        [4, 6, 8, 10],
        [4, 6, 9, 10],
        [4, 7, 8, 10],
        [4, 7, 9, 10],
      ]);
    });
  });
  describe('homogeneous & different types', () => {
    test("[1], ['a'], [3n]", () => {
      expect(Array.from(nCartesianProduct([1], ['a'], [3n]))).toEqual([[1, 'a', 3n]]);
    });
    test("[1, 2], ['a'], [4n]", () => {
      expect(Array.from(nCartesianProduct([1, 2], ['a'], [4n]))).toEqual([
        [1, 'a', 4n],
        [2, 'a', 4n],
      ]);
    });
    test("[1n], ['a', 'b'], [4]", () => {
      expect(Array.from(nCartesianProduct([1n], ['a', 'b'], [4]))).toEqual([
        [1n, 'a', 4],
        [1n, 'b', 4],
      ]);
    });
    test("['a', 'b', 'c'], [4, 5], [6n, 7n, 8n]", () => {
      expect(Array.from(nCartesianProduct(['a', 'b', 'c'], [4, 5], [6n, 7n, 8n]))).toEqual([
        ['a', 4, 6n],
        ['a', 4, 7n],
        ['a', 4, 8n],
        ['a', 5, 6n],
        ['a', 5, 7n],
        ['a', 5, 8n],
        ['b', 4, 6n],
        ['b', 4, 7n],
        ['b', 4, 8n],
        ['b', 5, 6n],
        ['b', 5, 7n],
        ['b', 5, 8n],
        ['c', 4, 6n],
        ['c', 4, 7n],
        ['c', 4, 8n],
        ['c', 5, 6n],
        ['c', 5, 7n],
        ['c', 5, 8n],
      ]);
    });
  });
  describe('heterogeneous', () => {
    test("[1, 'a'], [2], [3n, 4n]", () => {
      expect(Array.from(nCartesianProduct([1, 'a'], [2], [3n, 4n]))).toEqual([
        [1, 2, 3n],
        [1, 2, 4n],
        ['a', 2, 3n],
        ['a', 2, 4n],
      ]);
    });
    test("[1, 'b', 3n], ['a', 2n, 3], [1n, 2, 'c']", () => {
      expect(Array.from(nCartesianProduct([1, 'b', 3n], ['a', 2n, 3], [1n, 2, 'c']))).toEqual([
        [1, 'a', 1n],
        [1, 'a', 2],
        [1, 'a', 'c'],
        [1, 2n, 1n],
        [1, 2n, 2],
        [1, 2n, 'c'],
        [1, 3, 1n],
        [1, 3, 2],
        [1, 3, 'c'],
        ['b', 'a', 1n],
        ['b', 'a', 2],
        ['b', 'a', 'c'],
        ['b', 2n, 1n],
        ['b', 2n, 2],
        ['b', 2n, 'c'],
        ['b', 3, 1n],
        ['b', 3, 2],
        ['b', 3, 'c'],
        [3n, 'a', 1n],
        [3n, 'a', 2],
        [3n, 'a', 'c'],
        [3n, 2n, 1n],
        [3n, 2n, 2],
        [3n, 2n, 'c'],
        [3n, 3, 1n],
        [3n, 3, 2],
        [3n, 3, 'c'],
      ]);
    });
  });
});
