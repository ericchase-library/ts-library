import { nChooseRPermutations } from '../Algorithm/Math/Combinatorics.js';
import { MaxBinaryHeap, MinBinaryHeap, type IBinaryHeap } from './BinaryHeap.js';

import { describe, expect, test } from 'bun:test';

function heapToArray<T>(heap: IBinaryHeap<T>) {
  const items: T[] = [];
  while (heap.length) {
    items.push(heap.remove()!);
  }
  return items;
}

function buildTests(Heap: new () => IBinaryHeap<number>, count: number, expectedMapper: (expected: number[]) => number[] = (expected) => expected) {
  const heap = new Heap();
  const numbers: number[] = [...new Array(count).keys()];
  const expected = expectedMapper([...numbers]);
  for (const [key, permutation] of nChooseRPermutations(numbers, count).entries()) {
    test(`${key + 1}: ${permutation.join(',')}`, () => {
      for (const p of permutation) {
        heap.insert(p);
      }
      expect(heapToArray(heap)).toStrictEqual(expected);
    });
  }
}

describe('MinBinaryHeap', () => {
  let heap: IBinaryHeap<number>;

  test('0 Items', () => {
    heap = new MinBinaryHeap();
    expect(heap.top).toBeUndefined();
    expect(heapToArray(heap)).toStrictEqual([]);
    expect(heap.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    heap = new MinBinaryHeap();
    heap.insert(1);
    expect(heapToArray(heap)).toStrictEqual([1]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      heap = new MinBinaryHeap();
      heap.insert(1);
      heap.insert(2);
      expect(heapToArray(heap)).toStrictEqual([1, 2]);
    });
    test('2,1', () => {
      heap = new MinBinaryHeap();
      heap.insert(2);
      heap.insert(1);
      expect(heapToArray(heap)).toStrictEqual([1, 2]);
    });
  });
  describe('3 Items', () => {
    buildTests(MinBinaryHeap, 3);
  });
  describe('4 Items', () => {
    buildTests(MinBinaryHeap, 4);
  });
});

describe('MaxBinaryHeap', () => {
  let heap: IBinaryHeap<number>;

  test('0 Items', () => {
    heap = new MaxBinaryHeap();
    expect(heap.top).toBeUndefined();
    expect(heapToArray(heap)).toStrictEqual([]);
    expect(heap.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    heap = new MaxBinaryHeap();
    heap.insert(1);
    expect(heapToArray(heap)).toStrictEqual([1]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      heap = new MaxBinaryHeap();
      heap.insert(1);
      heap.insert(2);
      expect(heapToArray(heap)).toStrictEqual([2, 1]);
    });
    test('2,1', () => {
      heap = new MaxBinaryHeap();
      heap.insert(2);
      heap.insert(1);
      expect(heapToArray(heap)).toStrictEqual([2, 1]);
    });
  });
  describe('3 Items', () => {
    buildTests(MaxBinaryHeap, 3, (_) => _.reverse());
  });
  describe('4 Items', () => {
    buildTests(MaxBinaryHeap, 4, (_) => _.reverse());
  });
});
