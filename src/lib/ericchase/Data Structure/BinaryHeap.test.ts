import { describe, expect, test } from 'bun:test';
import { nChooseRPermutations } from 'src/lib/ericchase/Algorithm/Math/Combinatorics.js';
import { BinaryHeap, MaxBinaryHeap, MinBinaryHeap } from 'src/lib/ericchase/Data Structure/BinaryHeap.js';

function TestPermutations(
  Heap: new () => BinaryHeap<number>, //
  count: number,
  expectedMapper: (expected: number[]) => number[] = (expected) => expected,
) {
  const heap = new Heap();
  const numbers: number[] = [...new Array(count).keys()];
  const expected = expectedMapper([...numbers]);
  for (const [key, permutation] of [...nChooseRPermutations(numbers, count)].entries()) {
    test(`${key + 1}: ${permutation.join(',')}`, () => {
      heap.clear();
      for (const p of permutation) {
        heap.insert(p);
      }
      expect(BinaryHeap.ToArray(heap)).toEqual(expected);
    });
  }
}

describe('BinaryHeap', () => {
  describe('0 Items', () => {
    const heap = new BinaryHeap();
    test('ToArray', () => {
      expect(BinaryHeap.ToArray(heap)).toEqual([]);
    });
    test('length', () => {
      expect(heap.size).toBe(0);
    });
    test('top', () => {
      expect(heap.top).toBeUndefined();
    });
    test('remove', () => {
      expect(heap.pop()).toBeUndefined();
      expect(heap.size).toBe(0);
    });
  });
  describe('1 Item', () => {
    const heap = new BinaryHeap();
    heap.insert(0);
    test('ToArray', () => {
      expect(BinaryHeap.ToArray(heap)).toEqual([0]);
    });
    test('length', () => {
      expect(heap.size).toBe(1);
    });
    test('top', () => {
      expect(heap.top).toBe(0);
    });
    test('remove', () => {
      expect(heap.pop()).toBe(0);
      expect(heap.size).toBe(0);
    });
  });
  function Test2Items(heap: BinaryHeap<number>) {
    test('ToArray', () => {
      expect(BinaryHeap.ToArray(heap)).toEqual([0, 1]);
    });
    test('length', () => {
      expect(heap.size).toBe(2);
    });
    test('top', () => {
      expect(heap.top).toBe(0);
    });
    test('remove', () => {
      expect(heap.pop()).toBe(0);
      expect(heap.size).toBe(1);
      expect(heap.pop()).toBe(1);
      expect(heap.size).toBe(0);
    });
  }
  describe('2 Items [0,1]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(0);
    heap.insert(1);
    Test2Items(heap);
  });
  describe('2 Items [1,0]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(1);
    heap.insert(0);
    Test2Items(heap);
  });
  function Test3Items(heap: BinaryHeap<number>) {
    test('ToArray', () => {
      expect(BinaryHeap.ToArray(heap)).toEqual([0, 1, 2]);
    });
    test('length', () => {
      expect(heap.size).toBe(3);
    });
    test('top', () => {
      expect(heap.top).toBe(0);
    });
    test('remove', () => {
      expect(heap.pop()).toBe(0);
      expect(heap.size).toBe(2);
      expect(heap.pop()).toBe(1);
      expect(heap.size).toBe(1);
      expect(heap.pop()).toBe(2);
      expect(heap.size).toBe(0);
    });
  }
  describe('3 Items [0,1,2]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(0);
    heap.insert(1);
    heap.insert(2);
    Test3Items(heap);
  });
  describe('3 Items [0,2,1]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(0);
    heap.insert(2);
    heap.insert(1);
    Test3Items(heap);
  });
  describe('3 Items [1,0,2]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(1);
    heap.insert(0);
    heap.insert(2);
    Test3Items(heap);
  });
  describe('3 Items [1,2,0]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(1);
    heap.insert(2);
    heap.insert(0);
    Test3Items(heap);
  });
  describe('3 Items [2,0,1]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(2);
    heap.insert(0);
    heap.insert(1);
    Test3Items(heap);
  });
  describe('3 Items [2,1,0]', () => {
    const heap = new BinaryHeap<number>();
    heap.insert(2);
    heap.insert(1);
    heap.insert(0);
    Test3Items(heap);
  });
});

describe('MinBinaryHeap', () => {
  let heap: BinaryHeap<number>;
  test('0 Items', () => {
    heap = new MinBinaryHeap();
    expect(heap.top).toBeUndefined();
    expect(BinaryHeap.ToArray(heap)).toEqual([]);
    expect(heap.pop()).toBeUndefined();
  });
  test('1 Item', () => {
    heap = new MinBinaryHeap();
    heap.insert(1);
    expect(heap.top).toBe(1);
    expect(BinaryHeap.ToArray(heap)).toEqual([1]);
    expect(heap.pop()).toBe(1);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      heap = new MinBinaryHeap();
      heap.insert(1);
      heap.insert(2);
      expect(BinaryHeap.ToArray(heap)).toEqual([1, 2]);
      expect(heap.pop()).toBe(1);
      expect(heap.pop()).toBe(2);
    });
    test('2,1', () => {
      heap = new MinBinaryHeap();
      heap.insert(2);
      heap.insert(1);
      expect(BinaryHeap.ToArray(heap)).toEqual([1, 2]);
      expect(heap.pop()).toBe(1);
      expect(heap.pop()).toBe(2);
    });
  });
  describe('3 Items', () => {
    TestPermutations(MinBinaryHeap, 3);
  });
  describe('4 Items', () => {
    TestPermutations(MinBinaryHeap, 4);
  });
});

describe('MaxBinaryHeap', () => {
  let heap: BinaryHeap<number>;
  test('0 Items', () => {
    heap = new MaxBinaryHeap();
    expect(heap.top).toBeUndefined();
    expect(BinaryHeap.ToArray(heap)).toEqual([]);
    expect(heap.pop()).toBeUndefined();
  });
  test('1 Item', () => {
    heap = new MaxBinaryHeap();
    heap.insert(1);
    expect(BinaryHeap.ToArray(heap)).toEqual([1]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      heap = new MaxBinaryHeap();
      heap.insert(1);
      heap.insert(2);
      expect(BinaryHeap.ToArray(heap)).toEqual([2, 1]);
    });
    test('2,1', () => {
      heap = new MaxBinaryHeap();
      heap.insert(2);
      heap.insert(1);
      expect(BinaryHeap.ToArray(heap)).toEqual([2, 1]);
    });
  });
  describe('3 Items', () => {
    TestPermutations(MaxBinaryHeap, 3, (_) => _.reverse());
  });
  describe('4 Items', () => {
    TestPermutations(MaxBinaryHeap, 4, (_) => _.reverse());
  });
});
