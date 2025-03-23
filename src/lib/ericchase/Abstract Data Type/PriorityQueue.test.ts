import { describe, expect, test } from 'bun:test';
import { MaxPriorityQueue, MinPriorityQueue, PriorityQueue } from './PriorityQueue.js';
import { nChooseRPermutations } from '../Algorithm/Math/Combinatorics.js';

describe('MinPriorityQueue', () => {
  const Queue = MinPriorityQueue;
  type DataType = { priority: number; data: string };
  const Comparator = (a: DataType, b: DataType) => a.priority < b.priority;
  test('0 Items', () => {
    const queue = new Queue<number>();
    expect(queue.top).toBeUndefined();
    expect(queue.toArray()).toEqual([]);
    expect(queue.pop()).toBeUndefined();
  });
  test('1 Item', () => {
    const queue = new Queue<DataType>();
    queue.insert({ priority: 0, data: '0' });
    expect(queue.toArray()).toEqual([{ priority: 0, data: '0' }]);
  });
  describe('2 Items', () => {
    test('different priorities', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '0' });
      queue.insert({ priority: 1, data: '1' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '0' },
        { priority: 1, data: '1' },
      ]);
    });
    test('different priorities, reverse', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 1, data: '1' });
      queue.insert({ priority: 0, data: '0' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '0' },
        { priority: 1, data: '1' },
      ]);
    });
    test('same priority', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '0' });
      queue.insert({ priority: 0, data: '1' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '0' },
        { priority: 0, data: '1' },
      ]);
    });
    test('same priority, reverse', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '1' });
      queue.insert({ priority: 0, data: '0' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '1' },
        { priority: 0, data: '0' },
      ]);
    });
  });
  describe('3 Items', () => {
    describe('different priorities', () => {
      const permutations = nChooseRPermutations([0, 1, 2], 3);
      for (const permutation of permutations) {
        test(`${permutation}`, () => {
          const queue = new Queue<DataType>(Comparator);
          const objects = [
            { priority: 0, data: '0' }, //
            { priority: 1, data: '1' },
            { priority: 2, data: '2' },
          ];
          queue.insert(objects[permutation[0]]);
          queue.insert(objects[permutation[1]]);
          queue.insert(objects[permutation[2]]);
          expect(queue.toArray()).toEqual([
            { priority: 0, data: '0' },
            { priority: 1, data: '1' },
            { priority: 2, data: '2' },
          ]);
        });
      }
    });
    describe('same priority', () => {
      const permutations = nChooseRPermutations([0, 1, 2], 3);
      for (const permutation of permutations) {
        test(`${permutation}`, () => {
          const queue = new Queue<DataType>(Comparator);
          const objects = [
            { priority: 0, data: '0' }, //
            { priority: 0, data: '1' },
            { priority: 0, data: '2' },
          ];
          queue.insert(objects[permutation[0]]);
          queue.insert(objects[permutation[1]]);
          queue.insert(objects[permutation[2]]);
          expect(queue.toArray()).toEqual([
            objects[permutation[0]], //
            objects[permutation[1]],
            objects[permutation[2]],
          ]);
        });
      }
    });
  });
});

describe('MaxPriorityQueue', () => {
  const Queue = MaxPriorityQueue;
  type DataType = { priority: number; data: string };
  const Comparator = (a: DataType, b: DataType) => a.priority > b.priority;
  test('0 Items', () => {
    const queue = new Queue<number>();
    expect(queue.top).toBeUndefined();
    expect(queue.toArray()).toEqual([]);
    expect(queue.pop()).toBeUndefined();
  });
  test('1 Item', () => {
    const queue = new Queue<DataType>();
    queue.insert({ priority: 0, data: '0' });
    expect(queue.toArray()).toEqual([{ priority: 0, data: '0' }]);
  });
  describe('2 Items', () => {
    test('different priorities', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '0' });
      queue.insert({ priority: 1, data: '1' });
      expect(queue.toArray()).toEqual([
        { priority: 1, data: '1' },
        { priority: 0, data: '0' },
      ]);
    });
    test('different priorities, reverse', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 1, data: '1' });
      queue.insert({ priority: 0, data: '0' });
      expect(queue.toArray()).toEqual([
        { priority: 1, data: '1' },
        { priority: 0, data: '0' },
      ]);
    });
    test('same priority', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '0' });
      queue.insert({ priority: 0, data: '1' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '0' },
        { priority: 0, data: '1' },
      ]);
    });
    test('same priority, reverse', () => {
      const queue = new Queue<DataType>(Comparator);
      queue.insert({ priority: 0, data: '1' });
      queue.insert({ priority: 0, data: '0' });
      expect(queue.toArray()).toEqual([
        { priority: 0, data: '1' },
        { priority: 0, data: '0' },
      ]);
    });
  });
  describe('3 Items', () => {
    describe('different priorities', () => {
      const permutations = nChooseRPermutations([0, 1, 2], 3);
      for (const permutation of permutations) {
        test(`${permutation}`, () => {
          const queue = new Queue<DataType>(Comparator);
          const objects = [
            { priority: 0, data: '0' }, //
            { priority: 1, data: '1' },
            { priority: 2, data: '2' },
          ];
          queue.insert(objects[permutation[0]]);
          queue.insert(objects[permutation[1]]);
          queue.insert(objects[permutation[2]]);
          expect(queue.toArray()).toEqual([
            { priority: 2, data: '2' },
            { priority: 1, data: '1' },
            { priority: 0, data: '0' },
          ]);
        });
      }
    });
    describe('same priority', () => {
      const permutations = nChooseRPermutations([0, 1, 2], 3);
      for (const permutation of permutations) {
        test(`${permutation}`, () => {
          const queue = new Queue<DataType>(Comparator);
          const objects = [
            { priority: 0, data: '0' }, //
            { priority: 0, data: '1' },
            { priority: 0, data: '2' },
          ];
          queue.insert(objects[permutation[0]]);
          queue.insert(objects[permutation[1]]);
          queue.insert(objects[permutation[2]]);
          expect(queue.toArray()).toEqual([
            objects[permutation[0]], //
            objects[permutation[1]],
            objects[permutation[2]],
          ]);
        });
      }
    });
  });
});

// https://github.com/datastructures-js/priority-queue
//
// The MIT License (MIT)
//
// Copyright (c) 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
describe('PriorityQueue', () => {
  const numComparator = (a: { id: number }, b: { id: number }) => a.id < b.id;
  const numValues = [
    { id: 50 }, //
    { id: 80 },
    { id: 30 },
    { id: 90 },
    { id: 60 },
    { id: 40 },
    { id: 20 },
  ];
  const charComparator = (a: { id: string }, b: { id: string }) => a.id > b.id;
  const charValues = [
    { id: 'm' }, //
    { id: 'x' },
    { id: 'f' },
    { id: 'b' },
    { id: 'z' },
    { id: 'k' },
    { id: 'c' },
  ];

  describe('PriorityQueue with min logic', () => {
    const minQ = new MinPriorityQueue(numComparator);
    test('insert', () => {
      for (const value of numValues) {
        minQ.insert(value);
      }
    });
    test('toArray', () => {
      expect(minQ.toArray()).toEqual(numValues.slice().sort((a, b) => a.id - b.id));
    });
    test('top', () => {
      expect(minQ.top).toEqual({ id: 20 });
    });
    test('size', () => {
      expect(minQ.size).toBe(7);
    });
    test('isEmpty', () => {
      expect(minQ.size === 0).toBe(false);
    });
    test('pop', () => {
      expect(minQ.pop()).toEqual({ id: 20 });
      expect(minQ.pop()).toEqual({ id: 30 });
      expect(minQ.pop()).toEqual({ id: 40 });
      expect(minQ.pop()).toEqual({ id: 50 });
      expect(minQ.pop()).toEqual({ id: 60 });
      expect(minQ.pop()).toEqual({ id: 80 });
      expect(minQ.pop()).toEqual({ id: 90 });
      expect(minQ.size === 0).toBe(true);
    });
  });

  describe('PriorityQueue with max logic', () => {
    const maxQ = new PriorityQueue(charComparator);
    test('insert', () => {
      for (const value of charValues) {
        maxQ.insert(value);
      }
    });
    test('toArray', () => {
      expect(maxQ.toArray()).toEqual(charValues.slice().sort((a, b) => (a.id > b.id ? -1 : 1)));
    });
    test('top', () => {
      expect(maxQ.top).toEqual({ id: 'z' });
    });
    test('size', () => {
      expect(maxQ.size).toBe(7);
    });
    test('isEmpty', () => {
      expect(maxQ.size === 0).toEqual(false);
    });
    test('pop', () => {
      expect(maxQ.pop()).toEqual({ id: 'z' });
      expect(maxQ.pop()).toEqual({ id: 'x' });
      expect(maxQ.pop()).toEqual({ id: 'm' });
      expect(maxQ.pop()).toEqual({ id: 'k' });
      expect(maxQ.pop()).toEqual({ id: 'f' });
      expect(maxQ.pop()).toEqual({ id: 'c' });
      expect(maxQ.pop()).toEqual({ id: 'b' });
      expect(maxQ.size === 0).toEqual(true);
    });
  });
});
