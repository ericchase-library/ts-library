import { nChooseRPermutations } from '../Algorithm/Math/Combinatorics.js';
import { MaxPriorityQueue, MinPriorityQueue, type IPriorityQueue } from './PriorityQueue.js';

import { describe, expect, test } from 'bun:test';

function queueToArray<T>(queue: IPriorityQueue<T>) {
  const items: T[] = [];
  while (queue.length) {
    items.push(queue.remove()!);
  }
  return items;
}

function buildBasicTests(
  Queue: new () => IPriorityQueue<number>, //
  count: number,
  expectedMapper: (expected: number[]) => number[] = (expected) => expected,
) {
  const queue = new Queue();
  const numbers: number[] = [...new Array(count).keys()];
  const expected = expectedMapper([...numbers]);
  for (const [key, permutation] of nChooseRPermutations(numbers, count).entries()) {
    test(`${key + 1}: ${permutation.join(',')}`, () => {
      for (const p of permutation) {
        queue.insert(p);
      }
      expect(queueToArray(queue)).toStrictEqual(expected);
    });
  }
}

describe('MinPriorityQueue', () => {
  const Queue = MinPriorityQueue;
  let queue: IPriorityQueue<number>;

  test('0 Items', () => {
    queue = new Queue();
    expect(queue.top).toBeUndefined();
    expect(queueToArray(queue)).toStrictEqual([]);
    expect(queue.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    queue = new Queue();
    queue.insert(1);
    expect(queueToArray(queue)).toStrictEqual([1]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      queue = new Queue();
      queue.insert(1);
      queue.insert(2);
      expect(queueToArray(queue)).toStrictEqual([1, 2]);
    });
    test('2,1', () => {
      queue = new Queue();
      queue.insert(2);
      queue.insert(1);
      expect(queueToArray(queue)).toStrictEqual([1, 2]);
    });
  });
  describe('3 Items', () => {
    buildBasicTests(Queue, 3);
  });
  describe('4 Items', () => {
    buildBasicTests(Queue, 4);
  });
  describe('Duplicate Items', () => {
    test('1,2,2,3', () => {
      queue = new Queue();
      queue.insert(1);
      queue.insert(2);
      queue.insert(2);
      queue.insert(3);
      expect(queueToArray(queue)).toStrictEqual([1, 2, 2, 3]);
    });
    test('2,1,3,2', () => {
      queue = new Queue();
      queue.insert(2);
      queue.insert(1);
      queue.insert(3);
      queue.insert(2);
      expect(queueToArray(queue)).toStrictEqual([1, 2, 2, 3]);
    });
  });
});

describe('MaxPriorityQueue', () => {
  const Queue = MaxPriorityQueue;
  let queue: IPriorityQueue<number>;

  test('0 Items', () => {
    queue = new Queue();
    expect(queue.top).toBeUndefined();
    expect(queueToArray(queue)).toStrictEqual([]);
    expect(queue.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    queue = new Queue();
    queue.insert(1);
    expect(queueToArray(queue)).toStrictEqual([1]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      queue = new Queue();
      queue.insert(1);
      queue.insert(2);
      expect(queueToArray(queue)).toStrictEqual([2, 1]);
    });
    test('2,1', () => {
      queue = new Queue();
      queue.insert(2);
      queue.insert(1);
      expect(queueToArray(queue)).toStrictEqual([2, 1]);
    });
  });
  describe('3 Items', () => {
    buildBasicTests(Queue, 3, (_) => _.reverse());
  });
  describe('4 Items', () => {
    buildBasicTests(Queue, 4, (_) => _.reverse());
  });
  describe('Duplicate Items', () => {
    test('1,2,2,3', () => {
      queue = new MinPriorityQueue();
      queue.insert(1);
      queue.insert(2);
      queue.insert(2);
      queue.insert(3);
      expect(queueToArray(queue)).toStrictEqual([1, 2, 2, 3]);
    });
    test('2,1,3,2', () => {
      queue = new MinPriorityQueue();
      queue.insert(2);
      queue.insert(1);
      queue.insert(3);
      queue.insert(2);
      expect(queueToArray(queue)).toStrictEqual([1, 2, 2, 3]);
    });
  });
});

function buildComplexTests(
  Queue: new (isOrdered: (a: { v: number }, b: { v: number }) => boolean) => IPriorityQueue<{ v: number }>, //
  isOrdered: (a: { v: number }, b: { v: number }) => boolean,
  count: number,
  expectedMapper: (expected: { v: number }[]) => { v: number }[] = (expected) => expected,
) {
  const queue = new Queue(isOrdered);
  const objects: { v: number }[] = [...new Array(count).keys()].map((_) => ({
    v: _,
  }));
  const expected = expectedMapper([...objects]);
  for (const [key, permutation] of nChooseRPermutations(objects, count).entries()) {
    test(`${key + 1}: ${permutation.join(',')}`, () => {
      for (const p of permutation) {
        queue.insert(p);
      }
      expect(queueToArray(queue)).toStrictEqual(expected);
    });
  }
}

describe('MinPriorityQueue | Complex Object', () => {
  const Queue = MinPriorityQueue;
  let queue: IPriorityQueue<{ v: number }>;
  function isOrdered(a: { v: number }, b: { v: number }): boolean {
    return a.v < b.v;
  }

  test('0 Items', () => {
    queue = new Queue(isOrdered);
    expect(queue.top).toBeUndefined();
    expect(queueToArray(queue)).toStrictEqual([]);
    expect(queue.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    queue = new Queue(isOrdered);
    queue.insert({ v: 1 });
    expect(queue.top).toStrictEqual({ v: 1 });
    expect(queueToArray(queue)).toStrictEqual([{ v: 1 }]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      queue = new Queue(isOrdered);
      queue.insert({ v: 1 });
      queue.insert({ v: 2 });
      expect(queueToArray(queue)).toStrictEqual([{ v: 1 }, { v: 2 }]);
    });
    test('2,1', () => {
      queue = new Queue(isOrdered);
      queue.insert({ v: 2 });
      queue.insert({ v: 1 });
      expect(queueToArray(queue)).toStrictEqual([{ v: 1 }, { v: 2 }]);
    });
  });
  describe('3 Items', () => {
    buildComplexTests(Queue, isOrdered, 3);
  });
  describe('4 Items', () => {
    buildComplexTests(Queue, isOrdered, 4);
  });
  describe('Duplicate Items', () => {
    interface Complex {
      k: number;
      v: number;
    }
    function isOrdered(a: { v: number }, b: { v: number }): boolean {
      return a.v < b.v;
    }
    test('1,2,2,3', () => {
      let queue = new MinPriorityQueue<Complex>(isOrdered);
      queue.insert({ k: 0, v: 1 });
      queue.insert({ k: 1, v: 2 });
      queue.insert({ k: 2, v: 2 });
      queue.insert({ k: 3, v: 3 });
      expect(queueToArray(queue)).toStrictEqual([
        { k: 0, v: 1 },
        { k: 1, v: 2 },
        { k: 2, v: 2 },
        { k: 3, v: 3 },
      ]);
    });
    test('2,1,3,2', () => {
      let queue = new MinPriorityQueue<Complex>(isOrdered);
      queue.insert({ k: 0, v: 2 });
      queue.insert({ k: 1, v: 1 });
      queue.insert({ k: 2, v: 3 });
      queue.insert({ k: 3, v: 2 });
      expect(queueToArray(queue)).toStrictEqual([
        { k: 1, v: 1 },
        { k: 0, v: 2 },
        { k: 3, v: 2 },
        { k: 2, v: 3 },
      ]);
    });
  });
});

describe('MaxPriorityQueue | Complex Object', () => {
  const Queue = MaxPriorityQueue;
  let queue: IPriorityQueue<{ v: number }>;
  function isOrdered(a: { v: number }, b: { v: number }): boolean {
    return a.v < b.v;
  }

  test('0 Items', () => {
    queue = new Queue(isOrdered);
    expect(queue.top).toBeUndefined();
    expect(queueToArray(queue)).toStrictEqual([]);
    expect(queue.remove()).toBeUndefined();
  });
  test('1 Item', () => {
    queue = new Queue(isOrdered);
    queue.insert({ v: 1 });
    expect(queue.top).toStrictEqual({ v: 1 });
    expect(queueToArray(queue)).toStrictEqual([{ v: 1 }]);
  });
  describe('2 Items', () => {
    test('1,2', () => {
      queue = new Queue(isOrdered);
      queue.insert({ v: 1 });
      queue.insert({ v: 2 });
      expect(queueToArray(queue)).toStrictEqual([{ v: 2 }, { v: 1 }]);
    });
    test('2,1', () => {
      queue = new Queue(isOrdered);
      queue.insert({ v: 2 });
      queue.insert({ v: 1 });
      expect(queueToArray(queue)).toStrictEqual([{ v: 2 }, { v: 1 }]);
    });
  });
  describe('3 Items', () => {
    buildComplexTests(Queue, isOrdered, 3, (_) => _.reverse());
  });
  describe('4 Items', () => {
    buildComplexTests(Queue, isOrdered, 4, (_) => _.reverse());
  });
  describe('Duplicate Items', () => {
    interface Complex {
      k: number;
      v: number;
    }
    function isOrdered(a: { v: number }, b: { v: number }): boolean {
      return a.v < b.v;
    }
    test('1,2,2,3', () => {
      let queue = new MaxPriorityQueue<Complex>(isOrdered);
      queue.insert({ k: 0, v: 1 });
      queue.insert({ k: 1, v: 2 });
      queue.insert({ k: 2, v: 2 });
      queue.insert({ k: 3, v: 3 });
      expect(queueToArray(queue)).toStrictEqual([
        { k: 3, v: 3 },
        { k: 1, v: 2 },
        { k: 2, v: 2 },
        { k: 0, v: 1 },
      ]);
    });
    test('2,1,3,2', () => {
      let queue = new MaxPriorityQueue<Complex>(isOrdered);
      queue.insert({ k: 0, v: 2 });
      queue.insert({ k: 1, v: 1 });
      queue.insert({ k: 2, v: 3 });
      queue.insert({ k: 3, v: 2 });
      expect(queueToArray(queue)).toStrictEqual([
        { k: 2, v: 3 },
        { k: 0, v: 2 },
        { k: 3, v: 2 },
        { k: 1, v: 1 },
      ]);
    });
  });
});
