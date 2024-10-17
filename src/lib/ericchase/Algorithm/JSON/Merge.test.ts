import { describe, expect, test } from 'bun:test';

import { JSONMerge } from './Merge.js';

describe(JSONMerge.name, () => {
  describe('Primitives', () => {
    test('Returns final primitive argument.', () => {
      expect(JSONMerge(1, 2, 3, 'a', 'b', 'c')).toBe('c');
    });
  });
  describe('Arrays', () => {
    test('Returns concatenation of arrays.', () => {
      expect(JSONMerge([1, 2, 3], ['a', 'b', 'c'])).toEqual([1, 2, 3, 'a', 'b', 'c']);
    });
  });
  describe('Objects', () => {
    test('Returns a shallow merge of each object.', () => {
      expect(JSONMerge({ a: 1, b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    });
    test('Newer primitive values overwrite the older primitive.', () => {
      expect(JSONMerge({ a: 1, b: 2 }, { a: 3, c: 3 })).toEqual({ a: 3, b: 2, c: 3 });
    });
    test('Array values are concatenated.', () => {
      expect(JSONMerge({ a: [1, 2, 3] }, { a: ['a', 'b', 'c'] })).toEqual({ a: [1, 2, 3, 'a', 'b', 'c'] });
    });
    test('Object values are recursively merged.', () => {
      expect(
        JSONMerge(
          {
            val: 1,
            arr: [1, 2, 3],
            obj: {
              val: 1,
              arr: [1, 2, 3],
            },
          },
          {
            val: 'a',
            arr: ['a', 'b', 'c'],
            obj: {
              val: 'a',
              arr: ['a', 'b', 'c'],
            },
          },
        ),
      ).toEqual({
        val: 'a',
        arr: [1, 2, 3, 'a', 'b', 'c'],
        obj: {
          val: 'a',
          arr: [1, 2, 3, 'a', 'b', 'c'],
        },
      });
    });
  });
  test("Empty objects don't affect merging.", () => {
    expect(JSONMerge({}, { a: 1, b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    expect(JSONMerge({ a: 1, b: 2 }, {}, { a: 3, c: 3 })).toEqual({ a: 3, b: 2, c: 3 });
    expect(JSONMerge({ a: [1, 2, 3] }, { a: ['a', 'b', 'c'] }, {})).toEqual({ a: [1, 2, 3, 'a', 'b', 'c'] });
    expect(JSONMerge({}, {}, {}, {}, { val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } }, {}, {}, {}, {}, { val: 'a', arr: ['a', 'b', 'c'], obj: { val: 'a', arr: ['a', 'b', 'c'] } }, {}, {}, {}, {})).toEqual({ val: 'a', arr: [1, 2, 3, 'a', 'b', 'c'], obj: { val: 'a', arr: [1, 2, 3, 'a', 'b', 'c'] } });
  });
});
