import { describe, expect, test } from 'bun:test';

import { SlidingWindow } from './SlidingWindow.js';

describe(SlidingWindow.name, () => {
  test('[] returns []', () => {
    expect([...SlidingWindow([], [].length)]).toEqual([]);
  });
  test('count < 1 returns []', () => {
    for (const arr of [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...SlidingWindow(arr, 0)]).toEqual([]);
    }
  });
  test('count >= length returns copy of array', () => {
    for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...SlidingWindow(arr, arr.length)]).toEqual([
        { begin: 0, end: arr.length, slice: arr }, //
      ]);
    }
    for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...SlidingWindow(arr, arr.length + 1)]).toEqual([
        { begin: 0, end: arr.length, slice: arr }, //
      ]);
    }
  });
  test('count = 1 returns single item arrays', () => {
    expect([...SlidingWindow([1], 1)]).toEqual([
      { begin: 0, end: 1, slice: [1] }, //
    ]);
    expect([...SlidingWindow([1, 2, 3], 1)]).toEqual([
      { begin: 0, end: 1, slice: [1] },
      { begin: 1, end: 2, slice: [2] },
      { begin: 2, end: 3, slice: [3] },
    ]);
    expect([...SlidingWindow([1, 2, 3, 4, 5], 1)]).toEqual([
      { begin: 0, end: 1, slice: [1] },
      { begin: 1, end: 2, slice: [2] },
      { begin: 2, end: 3, slice: [3] },
      { begin: 3, end: 4, slice: [4] },
      { begin: 4, end: 5, slice: [5] },
    ]);
  });
  test('count = 2 returns arrays of 2', () => {
    expect([...SlidingWindow([1, 2, 3, 4], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 1, end: 3, slice: [2, 3] },
      { begin: 2, end: 4, slice: [3, 4] },
    ]);
    expect([...SlidingWindow([1, 2, 3, 4, 5], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 1, end: 3, slice: [2, 3] },
      { begin: 2, end: 4, slice: [3, 4] },
      { begin: 3, end: 5, slice: [4, 5] },
    ]);
  });
  test('count = 3 returns arrays of 3', () => {
    expect([...SlidingWindow([1, 2, 3, 4], 3)]).toEqual([
      { begin: 0, end: 3, slice: [1, 2, 3] },
      { begin: 1, end: 4, slice: [2, 3, 4] },
    ]);
    expect([...SlidingWindow([1, 2, 3, 4, 5], 3)]).toEqual([
      { begin: 0, end: 3, slice: [1, 2, 3] },
      { begin: 1, end: 4, slice: [2, 3, 4] },
      { begin: 2, end: 5, slice: [3, 4, 5] },
    ]);
  });
});
