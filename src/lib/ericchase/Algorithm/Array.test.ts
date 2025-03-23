import { describe, expect, test } from 'bun:test';
import { ArrayAreEqual, ArrayBufferToBytes, ArrayChunks, ArrayShuffle, ArraySplit } from './Array.js';
import { U8, U8Clamped } from './Uint8Array.js';

describe(ArrayAreEqual.name, () => {
  const cases = [
    U8([]), //
    U8([1, 2]),
    U8([1, 2, 3, 4]),
    U8Clamped([]), //
    U8Clamped([1, 2]),
    U8Clamped([1, 2, 3, 4]),
    [],
    [1, 2],
    [1, 2, 3, 4],
    ['a'],
    ['a', 'b'],
    ['a', 'b', 'c'],
  ] as const;
  for (const input of cases) {
    test(input.toString(), () => {
      expect(ArrayAreEqual(input, input)).toBe(true);
    });
  }
  test('Unequal Arrays Fail', () => {
    expect(ArrayAreEqual([1], [1, 2])).toBe(false);
  });
});

describe(ArrayChunks.name, () => {
  test('[] returns []', () => {
    expect([...ArrayChunks([], [].length)]).toEqual([{ begin: 0, end: 0, slice: [] }]);
  });
  test('count < 1 returns []', () => {
    for (const arr of [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...ArrayChunks(arr, 0)]).toEqual([{ begin: 0, end: 0, slice: [] }]);
    }
  });
  test('count >= length returns copy of array', () => {
    for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...ArrayChunks(arr, arr.length)]).toEqual([
        { begin: 0, end: arr.length, slice: arr }, //
      ]);
    }
    for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
      expect([...ArrayChunks(arr, arr.length + 1)]).toEqual([
        { begin: 0, end: arr.length, slice: arr }, //
      ]);
    }
  });
  test('count evenly divides length, returns full chunks', () => {
    expect([...ArrayChunks([1, 2, 3, 4], 1)]).toEqual([
      { begin: 0, end: 1, slice: [1] },
      { begin: 1, end: 2, slice: [2] },
      { begin: 2, end: 3, slice: [3] },
      { begin: 3, end: 4, slice: [4] },
    ]);
    expect([...ArrayChunks([1, 2, 3, 4], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 2, end: 4, slice: [3, 4] },
    ]);
    expect([...ArrayChunks([1, 2, 3, 4, 5, 6], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 2, end: 4, slice: [3, 4] },
      { begin: 4, end: 6, slice: [5, 6] },
    ]);
    expect([...ArrayChunks([1, 2, 3, 4, 5, 6], 3)]).toEqual([
      { begin: 0, end: 3, slice: [1, 2, 3] },
      { begin: 3, end: 6, slice: [4, 5, 6] },
    ]);
  });
  test('count does not evenly divide length, returns partial chunk', () => {
    expect([...ArrayChunks([1], 2)]).toEqual([
      { begin: 0, end: 1, slice: [1] }, //
    ]);
    expect([...ArrayChunks([1, 2, 3], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 2, end: 3, slice: [3] },
    ]);
    expect([...ArrayChunks([1, 2, 3, 4, 5], 2)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] },
      { begin: 2, end: 4, slice: [3, 4] },
      { begin: 4, end: 5, slice: [5] },
    ]);
    expect([...ArrayChunks([1], 3)]).toEqual([
      { begin: 0, end: 1, slice: [1] }, //
    ]);
    expect([...ArrayChunks([1, 2], 3)]).toEqual([
      { begin: 0, end: 2, slice: [1, 2] }, //
    ]);
    expect([...ArrayChunks([1, 2, 3, 4], 3)]).toEqual([
      { begin: 0, end: 3, slice: [1, 2, 3] },
      { begin: 3, end: 4, slice: [4] },
    ]);
  });
});

describe(ArrayShuffle.name, () => {
  test('[]', () => {
    expect(ArrayShuffle([])).toEqual([]);
  });
  test('[1]', () => {
    expect(ArrayShuffle([1])).toEqual([1]);
  });
  test('[1, 2]', () => {
    const possible = [
      [1, 2],
      [2, 1],
    ];
    expect(possible).toContainEqual(ArrayShuffle([1, 2]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2]));
  });
  test('[1, 2, 3]', () => {
    const possible = [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ];
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
    expect(possible).toContainEqual(ArrayShuffle([1, 2, 3]));
  });
});

describe(ArraySplit.name, () => {
  test('[]', () => {
    expect(ArraySplit([], -1)).toEqual([[]]);
    expect(ArraySplit([], 0)).toEqual([[]]);
    expect(ArraySplit([], 1)).toEqual([[]]);
  });
  test('[1]', () => {
    expect(ArraySplit([1], -1)).toEqual([[]]);
    expect(ArraySplit([1], 0)).toEqual([[]]);
    expect(ArraySplit([1], 1)).toEqual([[1]]);
  });
  test('[1, 2]', () => {
    expect(ArraySplit([1, 2], -1)).toEqual([[]]);
    expect(ArraySplit([1, 2], 0)).toEqual([[]]);
    expect(ArraySplit([1, 2], 1)).toEqual([[1], [2]]);
  });
  test('[1, 2, 3] split 1', () => {
    expect(ArraySplit([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });
  test('[1, 2] split 2', () => {
    expect(ArraySplit([1, 2], 2)).toEqual([[1, 2]]);
  });
  test('[1, 2, 3, 4] split 2', () => {
    expect(ArraySplit([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
  test('[1, 2, 3, 4, 5, 6] split 2', () => {
    expect(ArraySplit([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });
  test('[1, 2, 3, 4] split 6', () => {
    expect(ArraySplit([1, 2, 3, 4], 6)).toEqual([[1, 2, 3, 4]]);
  });
  test('[] split 1', () => {
    expect(ArraySplit([], 1)).toEqual([[]]);
  });
});

describe(ArrayBufferToBytes.name, () => {
  test('[1, 2, 3, 4]', () => {
    expect([...ArrayBufferToBytes(U8([1, 2, 3, 4]).buffer)]).toEqual([1, 2, 3, 4]);
  });
  test('[0x12345678]', () => {
    // Does not adjust for endianness
    expect([...ArrayBufferToBytes(Uint32Array.from([0x12345678]).buffer)]).toEqual([0x78, 0x56, 0x34, 0x12]);
  });
  test('[0x78563412]', () => {
    expect([...ArrayBufferToBytes(Uint32Array.from([0x78563412]).buffer)]).toEqual([0x12, 0x34, 0x56, 0x78]);
  });
});
