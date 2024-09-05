import { describe, expect, test } from 'bun:test';
import { ArrayEquals, ArrayGetBytes, ArraySplit } from './Array.js';
import { U8, U8Clamped } from './Uint8Array.js';

describe(ArrayEquals.name, () => {
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
      expect(ArrayEquals(input, input)).toBe(true);
    });
  }
  test('Unequal Arrays Fail', () => {
    expect(ArrayEquals([1], [1, 2])).toBe(false);
  });
});

describe(ArrayGetBytes.name, () => {
  test('[1, 2, 3, 4]', () => {
    expect([...ArrayGetBytes(U8([1, 2, 3, 4]).buffer)]).toEqual([1, 2, 3, 4]);
  });
  test('[0x12345678]', () => {
    // Does not adjust for endianness
    expect([...ArrayGetBytes(Uint32Array.from([0x12345678]).buffer)]).toEqual([0x78, 0x56, 0x34, 0x12]);
  });
  test('[0x78563412]', () => {
    expect([...ArrayGetBytes(Uint32Array.from([0x78563412]).buffer)]).toEqual([0x12, 0x34, 0x56, 0x78]);
  });
});

describe(ArraySplit.name, () => {
  test('[]', () => {
    expect(ArraySplit([], -1)).toEqual([[]]);
    expect(ArraySplit([], 0)).toEqual([[]]);
    expect(ArraySplit([], 1)).toEqual([[]]);
  });
  test('[1]', () => {
    expect(ArraySplit([1], -1)).toEqual([[1]]);
    expect(ArraySplit([1], 0)).toEqual([[1]]);
    expect(ArraySplit([1], 1)).toEqual([[1]]);
  });
  test('[1, 2]', () => {
    expect(ArraySplit([1, 2], -1)).toEqual([[1, 2]]);
    expect(ArraySplit([1, 2], 0)).toEqual([[1, 2]]);
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
