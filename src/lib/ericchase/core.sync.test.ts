import { describe, expect, test } from 'bun:test';
import { Core } from './core.js';

describe('Array', () => {
  describe(Core.Array.Gen_BufferToBytes.name, () => {
    test('[1, 2, 3, 4]', () => {
      expect([...Core.Array.Gen_BufferToBytes(Uint8Array.from([1, 2, 3, 4]).buffer)]).toEqual([1, 2, 3, 4]);
    });
    test('[0x12345678]', () => {
      // Does not adjust for endianness
      expect([...Core.Array.Gen_BufferToBytes(Uint32Array.from([0x12345678]).buffer)]).toEqual([0x78, 0x56, 0x34, 0x12]);
    });
    test('[0x78563412]', () => {
      expect([...Core.Array.Gen_BufferToBytes(Uint32Array.from([0x78563412]).buffer)]).toEqual([0x12, 0x34, 0x56, 0x78]);
    });
  });
  describe(Core.Array.Gen_Chunks.name, () => {
    test('[] returns []', () => {
      expect([...Core.Array.Gen_Chunks([], [].length)]).toEqual([{ begin: 0, end: 0, slice: [] }]);
    });
    test('count < 1 returns []', () => {
      for (const arr of [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_Chunks(arr, 0)]).toEqual([{ begin: 0, end: 0, slice: [] }]);
      }
    });
    test('count >= length returns copy of array', () => {
      for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_Chunks(arr, arr.length)]).toEqual([
          { begin: 0, end: arr.length, slice: arr }, //
        ]);
      }
      for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_Chunks(arr, arr.length + 1)]).toEqual([
          { begin: 0, end: arr.length, slice: arr }, //
        ]);
      }
    });
    test('count evenly divides length, returns full chunks', () => {
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4], 1)]).toEqual([
        { begin: 0, end: 1, slice: [1] },
        { begin: 1, end: 2, slice: [2] },
        { begin: 2, end: 3, slice: [3] },
        { begin: 3, end: 4, slice: [4] },
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 2, end: 4, slice: [3, 4] },
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4, 5, 6], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 2, end: 4, slice: [3, 4] },
        { begin: 4, end: 6, slice: [5, 6] },
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4, 5, 6], 3)]).toEqual([
        { begin: 0, end: 3, slice: [1, 2, 3] },
        { begin: 3, end: 6, slice: [4, 5, 6] },
      ]);
    });
    test('count does not evenly divide length, returns partial chunk', () => {
      expect([...Core.Array.Gen_Chunks([1], 2)]).toEqual([
        { begin: 0, end: 1, slice: [1] }, //
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 2, end: 3, slice: [3] },
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4, 5], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 2, end: 4, slice: [3, 4] },
        { begin: 4, end: 5, slice: [5] },
      ]);
      expect([...Core.Array.Gen_Chunks([1], 3)]).toEqual([
        { begin: 0, end: 1, slice: [1] }, //
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2], 3)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] }, //
      ]);
      expect([...Core.Array.Gen_Chunks([1, 2, 3, 4], 3)]).toEqual([
        { begin: 0, end: 3, slice: [1, 2, 3] },
        { begin: 3, end: 4, slice: [4] },
      ]);
    });
  });
  describe(Core.Array.Gen_SlidingWindow.name, () => {
    test('[] returns []', () => {
      expect([...Core.Array.Gen_SlidingWindow([], [].length)]).toEqual([]);
    });
    test('count < 1 returns []', () => {
      for (const arr of [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_SlidingWindow(arr, 0)]).toEqual([]);
      }
    });
    test('count >= length returns copy of array', () => {
      for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_SlidingWindow(arr, arr.length)]).toEqual([
          { begin: 0, end: arr.length, slice: arr }, //
        ]);
      }
      for (const arr of [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]]) {
        expect([...Core.Array.Gen_SlidingWindow(arr, arr.length + 1)]).toEqual([
          { begin: 0, end: arr.length, slice: arr }, //
        ]);
      }
    });
    test('count = 1 returns single item arrays', () => {
      expect([...Core.Array.Gen_SlidingWindow([1], 1)]).toEqual([
        { begin: 0, end: 1, slice: [1] }, //
      ]);
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3], 1)]).toEqual([
        { begin: 0, end: 1, slice: [1] },
        { begin: 1, end: 2, slice: [2] },
        { begin: 2, end: 3, slice: [3] },
      ]);
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3, 4, 5], 1)]).toEqual([
        { begin: 0, end: 1, slice: [1] },
        { begin: 1, end: 2, slice: [2] },
        { begin: 2, end: 3, slice: [3] },
        { begin: 3, end: 4, slice: [4] },
        { begin: 4, end: 5, slice: [5] },
      ]);
    });
    test('count = 2 returns arrays of 2', () => {
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3, 4], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 1, end: 3, slice: [2, 3] },
        { begin: 2, end: 4, slice: [3, 4] },
      ]);
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3, 4, 5], 2)]).toEqual([
        { begin: 0, end: 2, slice: [1, 2] },
        { begin: 1, end: 3, slice: [2, 3] },
        { begin: 2, end: 4, slice: [3, 4] },
        { begin: 3, end: 5, slice: [4, 5] },
      ]);
    });
    test('count = 3 returns arrays of 3', () => {
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3, 4], 3)]).toEqual([
        { begin: 0, end: 3, slice: [1, 2, 3] },
        { begin: 1, end: 4, slice: [2, 3, 4] },
      ]);
      expect([...Core.Array.Gen_SlidingWindow([1, 2, 3, 4, 5], 3)]).toEqual([
        { begin: 0, end: 3, slice: [1, 2, 3] },
        { begin: 1, end: 4, slice: [2, 3, 4] },
        { begin: 2, end: 5, slice: [3, 4, 5] },
      ]);
    });
  });
  describe(Core.Array.Gen_Zip.name, () => {
    test('[1,2,3] [a,b,c]', () => {
      expect(Array.from(Core.Array.Gen_Zip([1, 2, 3], ['a', 'b', 'c']))).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);
    });
    test('[1,2,3] [a]', () => {
      expect(Array.from(Core.Array.Gen_Zip([1, 2, 3], ['a']))).toEqual([
        [1, 'a'],
        [2, undefined],
        [3, undefined],
      ]);
    });
    test('[1] [a,b,c]', () => {
      expect(Array.from(Core.Array.Gen_Zip([1], ['a', 'b', 'c']))).toEqual([
        [1, 'a'],
        [undefined, 'b'],
        [undefined, 'c'],
      ]);
    });
    test('[1,2,3] 0', () => {
      expect(Array.from(Core.Array.Gen_Zip([1, 2, 3], 0 as unknown as Array<string>))).toEqual([
        [1, undefined],
        [2, undefined],
        [3, undefined],
      ]);
    });
    test('[1,2,3], 0, [a,b,c]', () => {
      expect(Array.from(Core.Array.Gen_Zip([1, 2, 3], 0 as unknown as Array<undefined>, ['a', 'b', 'c']))).toEqual([
        [1, undefined, 'a'],
        [2, undefined, 'b'],
        [3, undefined, 'c'],
      ]);
    });
  });
  describe(Core.Array.AreEqual.name, () => {
    const cases = [
      Uint8Array.from([]), //
      Uint8Array.from([1, 2]),
      Uint8Array.from([1, 2, 3, 4]),
      Uint8ClampedArray.from([]), //
      Uint8ClampedArray.from([1, 2]),
      Uint8ClampedArray.from([1, 2, 3, 4]),
      [],
      [1, 2],
      [1, 2, 3, 4],
      ['a'],
      ['a', 'b'],
      ['a', 'b', 'c'],
    ] as const;
    for (const input of cases) {
      test(input.toString(), () => {
        expect(Core.Array.AreEqual(input, input)).toBe(true);
      });
    }
    test('Unequal Arrays Fail', () => {
      expect(Core.Array.AreEqual([1], [1, 2])).toBe(false);
    });
  });
  describe(Core.Array.Shuffle.name, () => {
    test('[]', () => {
      expect(Core.Array.Shuffle([])).toEqual([]);
    });
    test('[1]', () => {
      expect(Core.Array.Shuffle([1])).toEqual([1]);
    });
    test('[1, 2]', () => {
      const possible = [
        [1, 2],
        [2, 1],
      ];
      for (let i = 0; i < 10; i++) {
        expect(possible).toContainEqual(Core.Array.Shuffle([1, 2]));
      }
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
      for (let i = 0; i < 20; i++) {
        expect(possible).toContainEqual(Core.Array.Shuffle([1, 2, 3]));
      }
    });
  });
  describe(Core.Array.Split.name, () => {
    test('[]', () => {
      expect(Core.Array.Split([], -1)).toEqual([[]]);
      expect(Core.Array.Split([], 0)).toEqual([[]]);
      expect(Core.Array.Split([], 1)).toEqual([[]]);
    });
    test('[1]', () => {
      expect(Core.Array.Split([1], -1)).toEqual([[]]);
      expect(Core.Array.Split([1], 0)).toEqual([[]]);
      expect(Core.Array.Split([1], 1)).toEqual([[1]]);
    });
    test('[1, 2]', () => {
      expect(Core.Array.Split([1, 2], -1)).toEqual([[]]);
      expect(Core.Array.Split([1, 2], 0)).toEqual([[]]);
      expect(Core.Array.Split([1, 2], 1)).toEqual([[1], [2]]);
    });
    test('[1, 2, 3] split 1', () => {
      expect(Core.Array.Split([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
    test('[1, 2] split 2', () => {
      expect(Core.Array.Split([1, 2], 2)).toEqual([[1, 2]]);
    });
    test('[1, 2, 3, 4] split 2', () => {
      expect(Core.Array.Split([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
    test('[1, 2, 3, 4, 5, 6] split 2', () => {
      expect(Core.Array.Split([1, 2, 3, 4, 5, 6], 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });
    test('[1, 2, 3, 4] split 6', () => {
      expect(Core.Array.Split([1, 2, 3, 4], 6)).toEqual([[1, 2, 3, 4]]);
    });
    test('[] split 1', () => {
      expect(Core.Array.Split([], 1)).toEqual([[]]);
    });
  });
});
describe('Array BinarySearch', () => {
  describe('[0, 2, 4, 6, 8]', () => {
    const nums = [0, 2, 4, 6, 8];
    describe(Core.Array.BinarySearch.ExactMatch.name, () => {
      test(' 0', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 0)).toBe(0));
      test(' 2', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 2)).toBe(1));
      test(' 4', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 4)).toBe(2));
      test(' 6', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 6)).toBe(3));
      test(' 8', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 8)).toBe(4));
      //
      test('-1', () => expect(Core.Array.BinarySearch.ExactMatch(nums, -1)).toBe(-1));
      test(' 1', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 1)).toBe(-1));
      test(' 3', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 3)).toBe(-1));
      test(' 5', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 5)).toBe(-1));
      test(' 7', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 7)).toBe(-1));
      test(' 9', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 9)).toBe(-1));
    });
    describe(Core.Array.BinarySearch.InsertionIndex.name, () => {
      test(' 0', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 0)).toBe(0));
      test(' 2', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 2)).toBe(1));
      test(' 4', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 4)).toBe(2));
      test(' 6', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 6)).toBe(3));
      test(' 8', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 8)).toBe(4));
      //
      test('-1', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, -1)).toBe(-1));
      test(' 1', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 1)).toBe(0));
      test(' 3', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 3)).toBe(1));
      test(' 5', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 5)).toBe(2));
      test(' 7', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 7)).toBe(3));
      test(' 9', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 9)).toBe(4));
    });
  });
  describe('[3, 6, 9]', () => {
    const nums = [3, 6, 9];
    describe(Core.Array.BinarySearch.ExactMatch.name, () => {
      test('-3', () => expect(Core.Array.BinarySearch.ExactMatch(nums, -3)).toBe(-1));
      test('-2', () => expect(Core.Array.BinarySearch.ExactMatch(nums, -2)).toBe(-1));
      test('-1', () => expect(Core.Array.BinarySearch.ExactMatch(nums, -1)).toBe(-1));
      test(' 0', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 0)).toBe(-1));
      test(' 1', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 1)).toBe(-1));
      test(' 2', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 2)).toBe(-1));
      // 3
      test(' 4', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 4)).toBe(-1));
      test(' 5', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 5)).toBe(-1));
      // 6
      test(' 7', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 7)).toBe(-1));
      test(' 8', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 8)).toBe(-1));
      // 9
      test('10', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 10)).toBe(-1));
      test('11', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 11)).toBe(-1));
      test('12', () => expect(Core.Array.BinarySearch.ExactMatch(nums, 12)).toBe(-1));
    });
    describe(Core.Array.BinarySearch.InsertionIndex.name, () => {
      test('-3', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, -3)).toBe(-1));
      test('-2', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, -2)).toBe(-1));
      test('-1', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, -1)).toBe(-1));
      //
      test(' 0', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 0)).toBe(-1));
      test(' 1', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 1)).toBe(-1));
      test(' 2', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 2)).toBe(-1));
      // 3
      test(' 4', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 4)).toBe(0));
      test(' 5', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 5)).toBe(0));
      // 6
      test(' 7', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 7)).toBe(1));
      test(' 8', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 8)).toBe(1));
      // 9
      test('10', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 10)).toBe(2));
      test('11', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 11)).toBe(2));
      test('12', () => expect(Core.Array.BinarySearch.InsertionIndex(nums, 12)).toBe(2));
    });
  });
});
describe('Array Uint8', () => {
  describe(Core.Array.Uint8.Class_Group.name, () => {
    test('[]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([]));
      expect(group.byteLength).toBe(0);
    });
    test('[0]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([0]));
      expect(group.byteLength).toBe(1);
      expect(group.get(1)).toEqual(new Uint8Array([0]));
    });
    test('[0, 0]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([0, 0]));
      expect(group.byteLength).toBe(2);
      expect(group.get(2)).toEqual(new Uint8Array([0, 0]));
    });
    test('[0], [0]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([0]));
      group.add(Uint8Array.from([0]));
      expect(group.byteLength).toBe(2);
      expect(group.get(2)).toEqual(new Uint8Array([0, 0]));
    });
    test('[1, 2, 3]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([1, 2, 3]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([1, 2, 3]));
    });
    test('[1], [2], [3]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([1]));
      group.add(Uint8Array.from([2]));
      group.add(Uint8Array.from([3]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([1, 2, 3]));
    });
    test('[200, 250, 300]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([200, 250, 300]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([200, 250, 44]));
    });
    test('[200], [250], [300]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([200]));
      group.add(Uint8Array.from([250]));
      group.add(Uint8Array.from([300]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([200, 250, 44]));
    });
    test('[0x0f, 0xff0f, 0xffff0f, 0xffffff0f]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([0x0f, 0xff0f, 0xffff0f, 0xffffff0f]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([0x0f, 0x0f, 0x0f, 0x0f]));
    });
    test('[0xff, 0xffff, 0xffffff, 0xffffffff]', () => {
      const group = Core.Array.Uint8.Class_Group();
      group.add(Uint8Array.from([0xff, 0xffff, 0xffffff, 0xffffffff]));
      expect(group.get(group.byteLength)).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
    });
  });
  //
  describe(Core.Array.Uint8.Concat.name, () => {
    const cases = [
      [[Uint8Array.from([])], Uint8Array.from([])],
      [[Uint8Array.from([1, 2])], Uint8Array.from([1, 2])],
      [[Uint8Array.from([1, 2]), Uint8Array.from([3, 4])], Uint8Array.from([1, 2, 3, 4])],
    ] as const;
    for (const [input, expected] of cases) {
      test(Core.Array.Uint8.ToHex(expected).join(' '), () => {
        expect(Core.Array.Uint8.Concat(input)).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.Copy.name, () => {
    function fn(bytes: Uint8Array, size: number, offset: number, expected: Uint8Array) {
      test(`[${Core.Array.Uint8.ToHex(bytes).toString()}] ${size}:${offset}`, () => {
        expect(Core.Array.Uint8.Copy(bytes, size, offset)).toEqual(expected);
      });
    }
    fn(Uint8Array.from([]), 4, 0, Uint8Array.from([]));
    fn(Uint8Array.from([]), 4, 4, Uint8Array.from([]));
    fn(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 4, 0, Uint8Array.from([1, 2, 3, 4]));
    fn(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 4, 4, Uint8Array.from([5, 6, 7, 8]));
    fn(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 4, 8, Uint8Array.from([]));
  });
  describe(Core.Array.Uint8.FromBase64.name, () => {
    const cases = [
      ['', ''],
      ['Zg==', 'f'],
      ['Zm8=', 'fo'],
      ['Zm9v', 'foo'],
      ['Zm9vYg==', 'foob'],
      ['Zm9vYmE=', 'fooba'],
      ['Zm9vYmFy', 'foobar'],
    ] as const;
    for (const [input, expected] of cases) {
      test(input, () => {
        expect(Core.Array.Uint8.FromBase64(input)).toEqual(Core.Array.Uint8.FromString(expected));
      });
    }
  });
  describe(Core.Array.Uint8.FromString.name, () => {
    const cases = [
      ['123', Uint8Array.from([49, 50, 51])],
      ['abc', Uint8Array.from([97, 98, 99])],
      ['ABC', Uint8Array.from([65, 66, 67])],
      ['IDAT', Uint8Array.from([0x49, 0x44, 0x41, 0x54])],
    ] as const;
    for (const [input, expected] of cases) {
      test(input, () => {
        expect(Core.Array.Uint8.FromString(input)).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.FromUint32.name, () => {
    const cases = [
      [0x00000000, Uint8Array.from([0x00, 0x00, 0x00, 0x00])],
      [0x414fa339, Uint8Array.from([0x41, 0x4f, 0xa3, 0x39])],
      [0x9bd366ae, Uint8Array.from([0x9b, 0xd3, 0x66, 0xae])],
      [0x0c877f61, Uint8Array.from([0x0c, 0x87, 0x7f, 0x61])],
    ] as const;
    for (const [input, expected] of cases) {
      test(`0x${input.toString(16).padStart(8, '0')}`, () => {
        expect(Core.Array.Uint8.FromUint32(input)).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.Split.name, () => {
    test('[]', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([]), -1)).toEqual([Uint8Array.from([])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([]), 0)).toEqual([Uint8Array.from([])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([]), 1)).toEqual([Uint8Array.from([])]);
    });
    test('[1]', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1]), -1)).toEqual([Uint8Array.from([1])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([1]), 0)).toEqual([Uint8Array.from([1])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([1]), 1)).toEqual([Uint8Array.from([1])]);
    });
    test('[1, 2]', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2]), -1)).toEqual([Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2]), 0)).toEqual([Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2]), 1)).toEqual([Uint8Array.from([1]), Uint8Array.from([2])]);
    });
    test('[1, 2, 3] split 1', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2, 3]), 1)).toEqual([Uint8Array.from([1]), Uint8Array.from([2]), Uint8Array.from([3])]);
    });
    test('[1, 2] split 2', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2]), 2)).toEqual([Uint8Array.from([1, 2])]);
    });
    test('[1, 2, 3, 4] split 2', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2, 3, 4]), 2)).toEqual([Uint8Array.from([1, 2]), Uint8Array.from([3, 4])]);
    });
    test('[1, 2, 3, 4, 5, 6] split 2', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2, 3, 4, 5, 6]), 2)).toEqual([Uint8Array.from([1, 2]), Uint8Array.from([3, 4]), Uint8Array.from([5, 6])]);
    });
    test('[1, 2, 3, 4] split 6', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([1, 2, 3, 4]), 6)).toEqual([Uint8Array.from([1, 2, 3, 4])]);
    });
    test('[] split 1', () => {
      expect(Core.Array.Uint8.Split(Uint8Array.from([]), 1)).toEqual([Uint8Array.from([])]);
    });
    test('Underlying Buffers are Different', () => {
      const original = Uint8Array.from([1, 2, 3, 4, 5, 6]);
      const u8s = Core.Array.Uint8.Split(original, 2);
      for (const u8 of u8s) {
        expect(u8.buffer).not.toBe(original.buffer);
      }
    });
  });
  describe(Core.Array.Uint8.Take.name, () => {
    test('[]', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([]), 1)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
    });
    test('[1]', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([1]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([1])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([1]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([1])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([1]), 1)).toEqual([Uint8Array.from([1]), Uint8Array.from([])]);
    });
    test('[1, 2]', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2]), 1)).toEqual([Uint8Array.from([1]), Uint8Array.from([2])]);
    });
    test('[1, 2] take 2', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2]), 2)).toEqual([Uint8Array.from([1, 2]), Uint8Array.from([])]);
    });
    test('[1, 2, 3, 4] take 2', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2, 3, 4]), 2)).toEqual([Uint8Array.from([1, 2]), Uint8Array.from([3, 4])]);
    });
    test('[1, 2, 3, 4] take 6', () => {
      expect(Core.Array.Uint8.Take(Uint8Array.from([1, 2, 3, 4]), 6)).toEqual([Uint8Array.from([1, 2, 3, 4]), Uint8Array.from([])]);
    });
  });
  describe(Core.Array.Uint8.TakeEnd.name, () => {
    test('[]', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([]), 1)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
    });
    test('[1]', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([1])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([1])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1]), 1)).toEqual([Uint8Array.from([1]), Uint8Array.from([])]);
    });
    test('[1, 2]', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2]), -1)).toEqual([Uint8Array.from([]), Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2]), 0)).toEqual([Uint8Array.from([]), Uint8Array.from([1, 2])]);
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2]), 1)).toEqual([Uint8Array.from([2]), Uint8Array.from([1])]);
    });
    test('[1, 2] take 2', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2]), 2)).toEqual([Uint8Array.from([1, 2]), Uint8Array.from([])]);
    });
    test('[1, 2, 3, 4] take 2', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2, 3, 4]), 2)).toEqual([Uint8Array.from([3, 4]), Uint8Array.from([1, 2])]);
    });
    test('[1, 2, 3, 4] take 6', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([1, 2, 3, 4]), 6)).toEqual([Uint8Array.from([1, 2, 3, 4]), Uint8Array.from([])]);
    });
    test('[] take 1', () => {
      expect(Core.Array.Uint8.TakeEnd(Uint8Array.from([]), 1)).toEqual([Uint8Array.from([]), Uint8Array.from([])]);
    });
  });
  describe(Core.Array.Uint8.ToASCII.name, () => {
    const cases = [
      [Uint8Array.from([49, 50, 51]), '123'],
      [Uint8Array.from([97, 98, 99]), 'abc'],
      [Uint8Array.from([65, 66, 67]), 'ABC'],
      [Uint8Array.from([0x49, 0x44, 0x41, 0x54]), 'IDAT'],
    ] as const;
    for (const [input, expected] of cases) {
      test(expected, () => {
        expect(Core.Array.Uint8.ToASCII(input)).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.ToBase64.name, () => {
    const cases = [
      ['', ''],
      ['f', 'Zg=='],
      ['fo', 'Zm8='],
      ['foo', 'Zm9v'],
      ['foob', 'Zm9vYg=='],
      ['fooba', 'Zm9vYmE='],
      ['foobar', 'Zm9vYmFy'],
    ] as const;
    for (const [input, expected] of cases) {
      test(input, () => {
        expect(Core.Array.Uint8.ToBase64(Core.Array.Uint8.FromString(input))).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.ToDecimal.name, () => {
    const cases = [
      [0x00000000, '0 0 0 0'],
      [0x414fa339, '65 79 163 57'],
      [0x9bd366ae, '155 211 102 174'],
      [0x0c877f61, '12 135 127 97'],
    ] as const;
    for (const [input, expected] of cases) {
      test(expected, () => {
        expect(Core.Array.Uint8.ToDecimal(Core.Array.Uint8.FromUint32(input)).join(' ')).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.ToHex.name, () => {
    const cases = [
      [0x00000000, '00 00 00 00'],
      [0x414fa339, '41 4f a3 39'],
      [0x9bd366ae, '9b d3 66 ae'],
      [0x0c877f61, '0c 87 7f 61'],
    ] as const;
    for (const [input, expected] of cases) {
      test(expected, () => {
        expect(Core.Array.Uint8.ToHex(Core.Array.Uint8.FromUint32(input)).join(' ')).toEqual(expected);
      });
    }
  });
  describe(Core.Array.Uint8.ToLines.name, () => {
    test('123\\n456\\n789', () => {
      expect(Core.Array.Uint8.ToLines(Core.Array.Uint8.FromString('123\n456\n789'))).toEqual(['123', '456', '789']);
    });
  });
  describe(Core.Array.Uint8.ToString.name, () => {
    const cases = [
      [Uint8Array.from([49, 50, 51]), '123'],
      [Uint8Array.from([97, 98, 99]), 'abc'],
      [Uint8Array.from([65, 66, 67]), 'ABC'],
      [Uint8Array.from([0x49, 0x44, 0x41, 0x54]), 'IDAT'],
    ] as const;
    for (const [input, expected] of cases) {
      test(expected, () => {
        expect(Core.Array.Uint8.ToString(input)).toEqual(expected);
      });
    }
  });
});
describe('Array Uint32', () => {
  describe(Core.Array.Uint8.ToHex.name, () => {
    const cases = [
      [0x00000000, '00 00 00 00'],
      [0x414fa339, '41 4f a3 39'],
      [0x9bd366ae, '9b d3 66 ae'],
      [0x0c877f61, '0c 87 7f 61'],
    ] as const;
    for (const [input, expected] of cases) {
      test(expected, () => {
        expect(Core.Array.Uint32.ToHex(input).join(' ')).toEqual(expected);
      });
    }
  });
});
describe('Assert', () => {
  test(Core.Assert.Equal.name, () => {
    expect(Core.Assert.Equal(true, true)).toBeTrue();
    expect(() => Core.Assert.Equal(true, false)).toThrow();
  });
  test(Core.Assert.NotEqual.name, () => {
    expect(Core.Assert.NotEqual(true, false)).toBeTrue();
    expect(() => Core.Assert.NotEqual(true, true)).toThrow();
  });
  //
  test(Core.Assert.BigInt.name, () => {
    expect(Core.Assert.BigInt(BigInt(64))).toBeTrue();
    expect(() => Core.Assert.BigInt('64')).toThrow();
    expect(() => Core.Assert.BigInt({})).toThrow();
    expect(() => Core.Assert.BigInt(64)).toThrow();
    // expect(() => Core.Assert.BigInt(BigInt(64))).toThrow();
    expect(() => Core.Assert.BigInt(null)).toThrow();
    expect(() => Core.Assert.BigInt(Symbol('64'))).toThrow();
    expect(() => Core.Assert.BigInt(true)).toThrow();
    expect(() => Core.Assert.BigInt(undefined)).toThrow();
  });
  test(Core.Assert.Boolean.name, () => {
    expect(Core.Assert.Boolean(true)).toBeTrue();
    expect(Core.Assert.Boolean(false)).toBeTrue();
    expect(() => Core.Assert.Boolean('64')).toThrow();
    expect(() => Core.Assert.Boolean({})).toThrow();
    expect(() => Core.Assert.Boolean(64)).toThrow();
    expect(() => Core.Assert.Boolean(BigInt(64))).toThrow();
    expect(() => Core.Assert.Boolean(null)).toThrow();
    expect(() => Core.Assert.Boolean(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Boolean(undefined)).toThrow();
  });
  test(Core.Assert.Function.name, () => {
    expect(Core.Assert.Function(() => {})).toBeTrue();
    expect(() => Core.Assert.Function('64')).toThrow();
    expect(() => Core.Assert.Function({})).toThrow();
    expect(() => Core.Assert.Function(64)).toThrow();
    expect(() => Core.Assert.Function(BigInt(64))).toThrow();
    expect(() => Core.Assert.Function(null)).toThrow();
    expect(() => Core.Assert.Function(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Function(true)).toThrow();
    expect(() => Core.Assert.Function(undefined)).toThrow();
  });
  test(Core.Assert.Number.name, () => {
    expect(Core.Assert.Number(64)).toBeTrue();
    expect(() => Core.Assert.Number('64')).toThrow();
    expect(() => Core.Assert.Number({})).toThrow();
    // expect(() => Core.Assert.Number(64)).toThrow();
    expect(() => Core.Assert.Number(BigInt(64))).toThrow();
    expect(() => Core.Assert.Number(null)).toThrow();
    expect(() => Core.Assert.Number(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Number(true)).toThrow();
    expect(() => Core.Assert.Number(undefined)).toThrow();
  });
  test(Core.Assert.Object.name, () => {
    expect(Core.Assert.Object({})).toBeTrue();
    expect(() => Core.Assert.Object('64')).toThrow();
    // expect(() => Core.Assert.Object({})).toThrow();
    expect(() => Core.Assert.Object(64)).toThrow();
    expect(() => Core.Assert.Object(BigInt(64))).toThrow();
    // expect(() => Core.Assert.Object(null)).toThrow(); // null is actually considered an object
    expect(() => Core.Assert.Object(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Object(true)).toThrow();
    expect(() => Core.Assert.Object(undefined)).toThrow();
  });
  test(Core.Assert.String.name, () => {
    expect(Core.Assert.String('64')).toBeTrue();
    // expect(() => Core.Assert.String('64')).toThrow();
    expect(() => Core.Assert.String({})).toThrow();
    expect(() => Core.Assert.String(64)).toThrow();
    expect(() => Core.Assert.String(BigInt(64))).toThrow();
    expect(() => Core.Assert.String(null)).toThrow();
    expect(() => Core.Assert.String(Symbol('64'))).toThrow();
    expect(() => Core.Assert.String(true)).toThrow();
    expect(() => Core.Assert.String(undefined)).toThrow();
  });
  test(Core.Assert.Symbol.name, () => {
    expect(Core.Assert.Symbol(Symbol('64'))).toBeTrue();
    expect(() => Core.Assert.Symbol('64')).toThrow();
    expect(() => Core.Assert.Symbol({})).toThrow();
    expect(() => Core.Assert.Symbol(64)).toThrow();
    expect(() => Core.Assert.Symbol(BigInt(64))).toThrow();
    expect(() => Core.Assert.Symbol(null)).toThrow();
    // expect(() => Core.Assert.Symbol(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Symbol(true)).toThrow();
    expect(() => Core.Assert.Symbol(undefined)).toThrow();
  });
  test(Core.Assert.Undefined.name, () => {
    expect(Core.Assert.Undefined(undefined)).toBeTrue();
    expect(() => Core.Assert.Undefined('64')).toThrow();
    expect(() => Core.Assert.Undefined({})).toThrow();
    expect(() => Core.Assert.Undefined(64)).toThrow();
    expect(() => Core.Assert.Undefined(BigInt(64))).toThrow();
    expect(() => Core.Assert.Undefined(null)).toThrow();
    expect(() => Core.Assert.Undefined(Symbol('64'))).toThrow();
    expect(() => Core.Assert.Undefined(true)).toThrow();
    // expect(() => Core.Assert.Undefined(undefined)).toThrow();
  });
});
describe('Console', () => {
  test(Core.Console.Error.name, () => {
    expect(Core.Console.Error('Test Error')).toBeEmpty();
  });
  test(Core.Console.ErrorWithDate.name, () => {
    expect(Core.Console.ErrorWithDate('Test ErrorWithDate')).toBeEmpty();
  });
  test(Core.Console.Log.name, () => {
    expect(Core.Console.Log('Test Log')).toBeEmpty();
  });
  test(Core.Console.LogWithDate.name, () => {
    expect(Core.Console.LogWithDate('Test LogWithDate')).toBeEmpty();
  });
});
describe('JSON', () => {
  describe(Core.JSON.Analyze.name, () => {
    test('Primitives', () => {
      expect(Core.JSON.Analyze(null)).toEqual({ source: null, type: 'primitive' });
      expect(Core.JSON.Analyze(true)).toEqual({ source: true, type: 'primitive' });
      expect(Core.JSON.Analyze(false)).toEqual({ source: false, type: 'primitive' });
      expect(Core.JSON.Analyze(1)).toEqual({ source: 1, type: 'primitive' });
      expect(Core.JSON.Analyze('a')).toEqual({ source: 'a', type: 'primitive' });
    });
    test('Invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze(() => {})).toThrow();
      expect(() => Core.JSON.Analyze(BigInt(0))).toThrow();
      expect(() => Core.JSON.Analyze(Symbol('foo'))).toThrow();
      expect(() => Core.JSON.Analyze(undefined)).toThrow();
    });
    test('Arrays', () => {
      expect(Core.JSON.Analyze([])).toEqual({ source: [], type: 'array' });
      expect(Core.JSON.Analyze([null])).toEqual({ source: [null], type: 'array' });
      expect(Core.JSON.Analyze([1, 2, 3])).toEqual({ source: [1, 2, 3], type: 'array' });
      expect(Core.JSON.Analyze(['a', 'b', 'c'])).toEqual({ source: ['a', 'b', 'c'], type: 'array' });
    });
    test('Arrays containing invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze([() => {}])).toThrow();
      expect(() => Core.JSON.Analyze([BigInt(0)])).toThrow();
      expect(() => Core.JSON.Analyze([Symbol('foo')])).toThrow();
      expect(() => Core.JSON.Analyze([undefined])).toThrow();
    });
    test('Arrays containing nested arrays containing invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze([[() => {}]])).toThrow();
      expect(() => Core.JSON.Analyze([[BigInt(0)]])).toThrow();
      expect(() => Core.JSON.Analyze([[Symbol('foo')]])).toThrow();
      expect(() => Core.JSON.Analyze([[undefined]])).toThrow();
    });
    test('Arrays containing objects containing invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze([{ a: () => {} }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: BigInt(0) }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: Symbol('foo') }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: undefined }])).toThrow();
    });
    describe('Objects', () => {
      expect(Core.JSON.Analyze({ a: 1, b: 2 })).toEqual({ source: { a: 1, b: 2 }, type: 'object' });
      expect(Core.JSON.Analyze({ val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } })).toEqual({ source: { val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } }, type: 'object' });
    });
    test('Objects containing invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze({ a: () => {} })).toThrow();
      expect(() => Core.JSON.Analyze({ a: BigInt(0) })).toThrow();
      expect(() => Core.JSON.Analyze({ a: Symbol('foo') })).toThrow();
      expect(() => Core.JSON.Analyze({ a: undefined })).toThrow();
    });
    test('Objects containing objects containing invalid primitives throw.', () => {
      expect(() => Core.JSON.Analyze({ a: { a: () => {} } })).toThrow();
      expect(() => Core.JSON.Analyze({ a: { a: BigInt(0) } })).toThrow();
      expect(() => Core.JSON.Analyze({ a: { a: Symbol('foo') } })).toThrow();
      expect(() => Core.JSON.Analyze({ a: { a: undefined } })).toThrow();
    });
    test('Recursive invalid primitive test.', () => {
      expect(() => Core.JSON.Analyze({ a: [{ a: () => {} }] })).toThrow();
      expect(() => Core.JSON.Analyze({ a: [{ a: [BigInt(0)] }] })).toThrow();
      expect(() => Core.JSON.Analyze({ a: [{ a: { a: Symbol('foo') } }] })).toThrow();
      expect(() => Core.JSON.Analyze({ a: [{ a: undefined }] })).toThrow();
      expect(() => Core.JSON.Analyze([{ a: () => {} }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: [BigInt(0)] }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: { a: Symbol('foo') } }])).toThrow();
      expect(() => Core.JSON.Analyze([{ a: undefined }])).toThrow();
    });
  });
  describe(Core.JSON.Merge.name, () => {
    describe('Primitives', () => {
      test('Returns final primitive argument.', () => {
        expect(Core.JSON.Merge(1, 2, 3, 'a', 'b', 'c')).toBe('c');
      });
    });
    describe('Arrays', () => {
      test('Returns concatenation of arrays.', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        expect(Core.JSON.Merge(a, b)).toEqual([1, 2, 3, 'a', 'b', 'c']);
        expect(Core.JSON.Merge(a)).toEqual([1, 2, 3]);
        expect(Core.JSON.Merge(b)).toEqual(['a', 'b', 'c']);
      });
    });
    describe('Objects', () => {
      test('Returns a deep merge of each object.', () => {
        const a = { a: 1, b: 2 };
        const b = { c: 3 };
        expect(Core.JSON.Merge(a, b)).toEqual({ a: 1, b: 2, c: 3 });
        expect(Core.JSON.Merge(a)).toEqual({ a: 1, b: 2 });
        expect(Core.JSON.Merge(b)).toEqual({ c: 3 });
      });
      test('Newer primitive values overwrite the older primitive.', () => {
        const a = { a: 1, b: 2 };
        const b = { a: 3, c: 3 };
        expect(Core.JSON.Merge(a, b)).toEqual({ a: 3, b: 2, c: 3 });
        expect(Core.JSON.Merge(a)).toEqual({ a: 1, b: 2 });
        expect(Core.JSON.Merge(b)).toEqual({ a: 3, c: 3 });
      });
      test('Array values are concatenated.', () => {
        const a = { a: [1, 2, 3] };
        const b = { a: ['a', 'b', 'c'] };
        expect(Core.JSON.Merge(a, b)).toEqual({ a: [1, 2, 3, 'a', 'b', 'c'] });
        expect(Core.JSON.Merge(a)).toEqual({ a: [1, 2, 3] });
        expect(Core.JSON.Merge(b)).toEqual({ a: ['a', 'b', 'c'] });
      });
      test('Object values are recursively merged.', () => {
        const a = {
          val: 1,
          arr: [1, 2, 3],
          obj: {
            val: 1,
            arr: [1, 2, 3],
          },
        };
        const b = {
          val: 'a',
          arr: ['a', 'b', 'c'],
          obj: {
            val: 'a',
            arr: ['a', 'b', 'c'],
          },
        };
        expect(Core.JSON.Merge(a, b)).toEqual({
          val: 'a',
          arr: [1, 2, 3, 'a', 'b', 'c'],
          obj: {
            val: 'a',
            arr: [1, 2, 3, 'a', 'b', 'c'],
          },
        });
        expect(a).toEqual({
          val: 1,
          arr: [1, 2, 3],
          obj: {
            val: 1,
            arr: [1, 2, 3],
          },
        });
        expect(b).toEqual({
          val: 'a',
          arr: ['a', 'b', 'c'],
          obj: {
            val: 'a',
            arr: ['a', 'b', 'c'],
          },
        });
      });
    });
    test("Empty objects don't affect merging.", () => {
      expect(Core.JSON.Merge({}, { a: 1, b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
      expect(Core.JSON.Merge({ a: 1, b: 2 }, {}, { a: 3, c: 3 })).toEqual({ a: 3, b: 2, c: 3 });
      expect(Core.JSON.Merge({ a: [1, 2, 3] }, { a: ['a', 'b', 'c'] }, {})).toEqual({ a: [1, 2, 3, 'a', 'b', 'c'] });
      expect(Core.JSON.Merge({}, {}, {}, {}, { val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } }, {}, {}, {}, {}, { val: 'a', arr: ['a', 'b', 'c'], obj: { val: 'a', arr: ['a', 'b', 'c'] } }, {}, {}, {}, {})).toEqual({ val: 'a', arr: [1, 2, 3, 'a', 'b', 'c'], obj: { val: 'a', arr: [1, 2, 3, 'a', 'b', 'c'] } });
    });
  });
  describe(Core.JSON.ParseRawString.name, () => {
    test('returns exact same string', () => {
      expect(Core.JSON.ParseRawString(String.raw`abc`)).toBe('abc');
    });
  });
});
describe('Map', () => {
  test(Core.Map.GetOrDefault.name, () => {
    expect(Core.Map.GetOrDefault(new Map<number, string>(), 0, () => 'a')).toBe('a');
  });
});
describe('Math', () => {
  describe(Core.Math.Gen_CartesianProduct.name, () => {
    describe('homogeneous & same type', () => {
      test('[1], [2]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1], [2]))).toEqual([[1, 2]]);
      });
      test('[1, 2], [3]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], [3]))).toEqual([
          [1, 3],
          [2, 3],
        ]);
      });
      test('[1], [2, 3]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1], [2, 3]))).toEqual([
          [1, 2],
          [1, 3],
        ]);
      });
      test('[1, 2], [3, 4]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], [3, 4]))).toEqual([
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
        ]);
      });
      test('[1, 2, 3], [4, 5]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2, 3], [4, 5]))).toEqual([
          [1, 4],
          [1, 5],
          [2, 4],
          [2, 5],
          [3, 4],
          [3, 5],
        ]);
      });
      test('[1, 2], [3, 4, 5]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], [3, 4, 5]))).toEqual([
          [1, 3],
          [1, 4],
          [1, 5],
          [2, 3],
          [2, 4],
          [2, 5],
        ]);
      });
      test('[1, 2, 3], [4, 5, 6]', () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2, 3], [4, 5, 6]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_CartesianProduct([1], ['a']))).toEqual([[1, 'a']]);
      });
      test("[1, 2], ['a']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], ['a']))).toEqual([
          [1, 'a'],
          [2, 'a'],
        ]);
      });
      test("[1], ['a', 'b']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1], ['a', 'b']))).toEqual([
          [1, 'a'],
          [1, 'b'],
        ]);
      });
      test("[1, 2], ['a', 'b']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], ['a', 'b']))).toEqual([
          [1, 'a'],
          [1, 'b'],
          [2, 'a'],
          [2, 'b'],
        ]);
      });
      test("[1, 2, 3], ['a', 'b']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2, 3], ['a', 'b']))).toEqual([
          [1, 'a'],
          [1, 'b'],
          [2, 'a'],
          [2, 'b'],
          [3, 'a'],
          [3, 'b'],
        ]);
      });
      test("[1, 2], ['a', 'b', 'c']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2], ['a', 'b', 'c']))).toEqual([
          [1, 'a'],
          [1, 'b'],
          [1, 'c'],
          [2, 'a'],
          [2, 'b'],
          [2, 'c'],
        ]);
      });
      test("[1, 2, 3], ['a', 'b', 'c']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 2, 3], ['a', 'b', 'c']))).toEqual([
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
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 'a'], [2]))).toEqual([
          [1, 2],
          ['a', 2],
        ]);
      });
      test("[1], ['a', 2]", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1], ['a', 2]))).toEqual([
          [1, 'a'],
          [1, 2],
        ]);
      });
      test("[1, 'a'], [2, 'b']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 'a'], [2, 'b']))).toEqual([
          [1, 2],
          [1, 'b'],
          ['a', 2],
          ['a', 'b'],
        ]);
      });
      test("[1, 'a', 3], ['b', 2]", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 'a', 3], ['b', 2]))).toEqual([
          [1, 'b'],
          [1, 2],
          ['a', 'b'],
          ['a', 2],
          [3, 'b'],
          [3, 2],
        ]);
      });
      test("[1, 'b'], ['a', 2, 'c']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 'b'], ['a', 2, 'c']))).toEqual([
          [1, 'a'],
          [1, 2],
          [1, 'c'],
          ['b', 'a'],
          ['b', 2],
          ['b', 'c'],
        ]);
      });
      test("[1, 'b', 3], ['a', 2, 'c']", () => {
        expect(Array.from(Core.Math.Gen_CartesianProduct([1, 'b', 3], ['a', 2, 'c']))).toEqual([
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
  describe(Core.Math.Gen_NCartesianProducts.name, () => {
    describe('homogeneous & same type', () => {
      test('[1], [2], [3]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1], [2], [3]))).toEqual([[1, 2, 3]]);
      });
      test('[1, 2], [3], [4]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2], [3], [4]))).toEqual([
          [1, 3, 4],
          [2, 3, 4],
        ]);
      });
      test('[1], [2, 3], [4]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1], [2, 3], [4]))).toEqual([
          [1, 2, 4],
          [1, 3, 4],
        ]);
      });
      test('[1], [2], [3, 4]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1], [2], [3, 4]))).toEqual([
          [1, 2, 3],
          [1, 2, 4],
        ]);
      });
      test('[1, 2], [3, 4], [5]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2], [3, 4], [5]))).toEqual([
          [1, 3, 5],
          [1, 4, 5],
          [2, 3, 5],
          [2, 4, 5],
        ]);
      });
      test('[1, 2], [3, 4], [5, 6]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2], [3, 4], [5, 6]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2, 3], [4, 5], [6]))).toEqual([
          [1, 4, 6],
          [1, 5, 6],
          [2, 4, 6],
          [2, 5, 6],
          [3, 4, 6],
          [3, 5, 6],
        ]);
      });
      test('[1, 2, 3], [4, 5], [6, 7]', () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2, 3], [4, 5], [6, 7]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2, 3], [4, 5], [6, 7, 8]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2, 3, 4], [5, 6, 7], [8, 9], [10]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1], ['a'], [3n]))).toEqual([[1, 'a', 3n]]);
      });
      test("[1, 2], ['a'], [4n]", () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 2], ['a'], [4n]))).toEqual([
          [1, 'a', 4n],
          [2, 'a', 4n],
        ]);
      });
      test("[1n], ['a', 'b'], [4]", () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1n], ['a', 'b'], [4]))).toEqual([
          [1n, 'a', 4],
          [1n, 'b', 4],
        ]);
      });
      test("['a', 'b', 'c'], [4, 5], [6n, 7n, 8n]", () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts(['a', 'b', 'c'], [4, 5], [6n, 7n, 8n]))).toEqual([
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
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 'a'], [2], [3n, 4n]))).toEqual([
          [1, 2, 3n],
          [1, 2, 4n],
          ['a', 2, 3n],
          ['a', 2, 4n],
        ]);
      });
      test("[1, 'b', 3n], ['a', 2n, 3], [1n, 2, 'c']", () => {
        expect(Array.from(Core.Math.Gen_NCartesianProducts([1, 'b', 3n], ['a', 2n, 3], [1n, 2, 'c']))).toEqual([
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
  describe(Core.Math.Gen_NChooseRCombinations.name, () => {
    describe('without repetitions', () => {
      test('nCr(5, 1)', () => {
        expect(Core.Math.nCr(5, 1)).toBe(5n);
      });
      test('5 choose 1 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 1)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
      });
      test('nCr(5, 2)', () => {
        expect(Core.Math.nCr(5, 2)).toBe(10n);
      });
      test('5 choose 2 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 2)]).toStrictEqual([
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
        expect(Core.Math.nCr(5, 3)).toBe(10n);
      });
      test('5 choose 3 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 3)]).toStrictEqual([
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
    describe('with repetitions', () => {
      test('nCr(5, 1, true)', () => {
        expect(Core.Math.nCr(5, 1, true)).toBe(5n);
      });
      test('5 choose 1 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 1, true)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
      });
      test('nCr(5, 2, true)', () => {
        expect(Core.Math.nCr(5, 2, true)).toBe(15n);
      });
      test('5 choose 2 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 2, true)]).toStrictEqual([
          ['a', 'a'],
          ['a', 'b'],
          ['a', 'c'],
          ['a', 'd'],
          ['a', 'e'],
          ['b', 'b'],
          ['b', 'c'],
          ['b', 'd'],
          ['b', 'e'],
          ['c', 'c'],
          ['c', 'd'],
          ['c', 'e'],
          ['d', 'd'],
          ['d', 'e'],
          ['e', 'e'],
        ]);
      });
      test('nCr(5, 3, true)', () => {
        expect(Core.Math.nCr(5, 3, true)).toBe(35n);
      });
      test('5 choose 3 combinations', () => {
        expect([...Core.Math.Gen_NChooseRCombinations(['a', 'b', 'c', 'd', 'e'], 3, true)]).toStrictEqual([
          ['a', 'a', 'a'],
          ['a', 'a', 'b'],
          ['a', 'a', 'c'],
          ['a', 'a', 'd'],
          ['a', 'a', 'e'],
          ['a', 'b', 'b'],
          ['a', 'b', 'c'],
          ['a', 'b', 'd'],
          ['a', 'b', 'e'],
          ['a', 'c', 'c'],
          ['a', 'c', 'd'],
          ['a', 'c', 'e'],
          ['a', 'd', 'd'],
          ['a', 'd', 'e'],
          ['a', 'e', 'e'],
          ['b', 'b', 'b'],
          ['b', 'b', 'c'],
          ['b', 'b', 'd'],
          ['b', 'b', 'e'],
          ['b', 'c', 'c'],
          ['b', 'c', 'd'],
          ['b', 'c', 'e'],
          ['b', 'd', 'd'],
          ['b', 'd', 'e'],
          ['b', 'e', 'e'],
          ['c', 'c', 'c'],
          ['c', 'c', 'd'],
          ['c', 'c', 'e'],
          ['c', 'd', 'd'],
          ['c', 'd', 'e'],
          ['c', 'e', 'e'],
          ['d', 'd', 'd'],
          ['d', 'd', 'e'],
          ['d', 'e', 'e'],
          ['e', 'e', 'e'],
        ]);
      });
    });
    // The 2-Combination is what I formerly referred as the SelfCartesianProduct:
    // export function* SelfCartesianProduct<T extends readonly unknown[]>(array: T): Generator<[T[number], T[number]], void, unknown> {
    //   for (let i = 0; i < array.length; i++) {
    //     for (let j = i + 1; j < array.length; j++) {
    //       yield [array[i], array[j]];
    //     }
    //   }
    // }
    describe('homogeneous', () => {
      test('[1, 2]', () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 2], 2)]).toEqual([[1, 2]]);
      });
      test('[1, 2, 3]', () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 2, 3], 2)]).toEqual([
          [1, 2],
          [1, 3],
          [2, 3],
        ]);
      });
      test('[1, 2, 3, 4]', () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 2, 3, 4], 2)]).toEqual([
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
          [3, 4],
        ]);
      });
      test('[1, 2, 3, 4, 5]', () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 2, 3, 4, 5], 2)]).toEqual([
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [2, 3],
          [2, 4],
          [2, 5],
          [3, 4],
          [3, 5],
          [4, 5],
        ]);
      });
    });
    describe('heterogeneous', () => {
      test("[1, 'b']", () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 'b'], 2)]).toEqual([[1, 'b']]);
      });
      test("[1, 'b', 3]", () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 'b', 3], 2)]).toEqual([
          [1, 'b'],
          [1, 3],
          ['b', 3],
        ]);
      });
      test("[1, 'b', 3, 'd']", () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 'b', 3, 'd'], 2)]).toEqual([
          [1, 'b'],
          [1, 3],
          [1, 'd'],
          ['b', 3],
          ['b', 'd'],
          [3, 'd'],
        ]);
      });
      test("[1, 'b', 3, 'd', 5]", () => {
        expect([...Core.Math.Gen_NChooseRCombinations([1, 'b', 3, 'd', 5], 2)]).toEqual([
          [1, 'b'],
          [1, 3],
          [1, 'd'],
          [1, 5],
          ['b', 3],
          ['b', 'd'],
          ['b', 5],
          [3, 'd'],
          [3, 5],
          ['d', 5],
        ]);
      });
    });
  });
  describe(Core.Math.Gen_NChooseRPermutations.name, () => {
    describe('without repetitions', () => {
      test('nPr(5, 1)', () => {
        expect(Core.Math.nPr(5, 1)).toBe(5n);
      });
      test('5 choose 1 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 1)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
      });
      test('nPr(5, 2)', () => {
        expect(Core.Math.nPr(5, 2)).toBe(20n);
      });
      test('5 choose 2 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 2)]).toStrictEqual([
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
        expect(Core.Math.nPr(5, 3)).toBe(60n);
      });
      test('5 choose 3 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 3)]).toStrictEqual([
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
    describe('with repetitions', () => {
      test('nPr(5, 1, true)', () => {
        expect(Core.Math.nPr(5, 1, true)).toBe(5n);
      });
      test('5 choose 1 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 1, true)]).toStrictEqual([['a'], ['b'], ['c'], ['d'], ['e']]);
      });
      test('nPr(5, 2, true)', () => {
        expect(Core.Math.nPr(5, 2, true)).toBe(25n);
      });
      test('5 choose 2 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 2, true)]).toStrictEqual([
          ['a', 'a'],
          ['a', 'b'],
          ['a', 'c'],
          ['a', 'd'],
          ['a', 'e'],
          ['b', 'a'],
          ['b', 'b'],
          ['b', 'c'],
          ['b', 'd'],
          ['b', 'e'],
          ['c', 'a'],
          ['c', 'b'],
          ['c', 'c'],
          ['c', 'd'],
          ['c', 'e'],
          ['d', 'a'],
          ['d', 'b'],
          ['d', 'c'],
          ['d', 'd'],
          ['d', 'e'],
          ['e', 'a'],
          ['e', 'b'],
          ['e', 'c'],
          ['e', 'd'],
          ['e', 'e'],
        ]);
      });
      test('nPr(5, 3, true)', () => {
        expect(Core.Math.nPr(5, 3, true)).toBe(125n);
      });
      test('5 choose 3 permutations', () => {
        expect([...Core.Math.Gen_NChooseRPermutations(['a', 'b', 'c', 'd', 'e'], 3, true)]).toStrictEqual([
          ['a', 'a', 'a'],
          ['a', 'a', 'b'],
          ['a', 'a', 'c'],
          ['a', 'a', 'd'],
          ['a', 'a', 'e'],
          ['a', 'b', 'a'],
          ['a', 'b', 'b'],
          ['a', 'b', 'c'],
          ['a', 'b', 'd'],
          ['a', 'b', 'e'],
          ['a', 'c', 'a'],
          ['a', 'c', 'b'],
          ['a', 'c', 'c'],
          ['a', 'c', 'd'],
          ['a', 'c', 'e'],
          ['a', 'd', 'a'],
          ['a', 'd', 'b'],
          ['a', 'd', 'c'],
          ['a', 'd', 'd'],
          ['a', 'd', 'e'],
          ['a', 'e', 'a'],
          ['a', 'e', 'b'],
          ['a', 'e', 'c'],
          ['a', 'e', 'd'],
          ['a', 'e', 'e'],
          ['b', 'a', 'a'],
          ['b', 'a', 'b'],
          ['b', 'a', 'c'],
          ['b', 'a', 'd'],
          ['b', 'a', 'e'],
          ['b', 'b', 'a'],
          ['b', 'b', 'b'],
          ['b', 'b', 'c'],
          ['b', 'b', 'd'],
          ['b', 'b', 'e'],
          ['b', 'c', 'a'],
          ['b', 'c', 'b'],
          ['b', 'c', 'c'],
          ['b', 'c', 'd'],
          ['b', 'c', 'e'],
          ['b', 'd', 'a'],
          ['b', 'd', 'b'],
          ['b', 'd', 'c'],
          ['b', 'd', 'd'],
          ['b', 'd', 'e'],
          ['b', 'e', 'a'],
          ['b', 'e', 'b'],
          ['b', 'e', 'c'],
          ['b', 'e', 'd'],
          ['b', 'e', 'e'],
          ['c', 'a', 'a'],
          ['c', 'a', 'b'],
          ['c', 'a', 'c'],
          ['c', 'a', 'd'],
          ['c', 'a', 'e'],
          ['c', 'b', 'a'],
          ['c', 'b', 'b'],
          ['c', 'b', 'c'],
          ['c', 'b', 'd'],
          ['c', 'b', 'e'],
          ['c', 'c', 'a'],
          ['c', 'c', 'b'],
          ['c', 'c', 'c'],
          ['c', 'c', 'd'],
          ['c', 'c', 'e'],
          ['c', 'd', 'a'],
          ['c', 'd', 'b'],
          ['c', 'd', 'c'],
          ['c', 'd', 'd'],
          ['c', 'd', 'e'],
          ['c', 'e', 'a'],
          ['c', 'e', 'b'],
          ['c', 'e', 'c'],
          ['c', 'e', 'd'],
          ['c', 'e', 'e'],
          ['d', 'a', 'a'],
          ['d', 'a', 'b'],
          ['d', 'a', 'c'],
          ['d', 'a', 'd'],
          ['d', 'a', 'e'],
          ['d', 'b', 'a'],
          ['d', 'b', 'b'],
          ['d', 'b', 'c'],
          ['d', 'b', 'd'],
          ['d', 'b', 'e'],
          ['d', 'c', 'a'],
          ['d', 'c', 'b'],
          ['d', 'c', 'c'],
          ['d', 'c', 'd'],
          ['d', 'c', 'e'],
          ['d', 'd', 'a'],
          ['d', 'd', 'b'],
          ['d', 'd', 'c'],
          ['d', 'd', 'd'],
          ['d', 'd', 'e'],
          ['d', 'e', 'a'],
          ['d', 'e', 'b'],
          ['d', 'e', 'c'],
          ['d', 'e', 'd'],
          ['d', 'e', 'e'],
          ['e', 'a', 'a'],
          ['e', 'a', 'b'],
          ['e', 'a', 'c'],
          ['e', 'a', 'd'],
          ['e', 'a', 'e'],
          ['e', 'b', 'a'],
          ['e', 'b', 'b'],
          ['e', 'b', 'c'],
          ['e', 'b', 'd'],
          ['e', 'b', 'e'],
          ['e', 'c', 'a'],
          ['e', 'c', 'b'],
          ['e', 'c', 'c'],
          ['e', 'c', 'd'],
          ['e', 'c', 'e'],
          ['e', 'd', 'a'],
          ['e', 'd', 'b'],
          ['e', 'd', 'c'],
          ['e', 'd', 'd'],
          ['e', 'd', 'e'],
          ['e', 'e', 'a'],
          ['e', 'e', 'b'],
          ['e', 'e', 'c'],
          ['e', 'e', 'd'],
          ['e', 'e', 'e'],
        ]);
      });
    });
  });
  describe(Core.Math.Factorial.name, () => {
    const tests: [string, () => void][] = [
      ['0', () => expect(Core.Math.Factorial(0)).toBe(1n)],
      ['1', () => expect(Core.Math.Factorial(1)).toBe(1n)],
      ['2', () => expect(Core.Math.Factorial(2)).toBe(2n)],
      ['3', () => expect(Core.Math.Factorial(3)).toBe(6n)],
      ['4', () => expect(Core.Math.Factorial(4)).toBe(24n)],
      ['5', () => expect(Core.Math.Factorial(5)).toBe(120n)],
      ['6', () => expect(Core.Math.Factorial(6)).toBe(720n)],
      ['7', () => expect(Core.Math.Factorial(7)).toBe(5040n)],
      ['8', () => expect(Core.Math.Factorial(8)).toBe(40320n)],
      ['9', () => expect(Core.Math.Factorial(9)).toBe(362880n)],
      ['10', () => expect(Core.Math.Factorial(10)).toBe(3628800n)],
      ['11', () => expect(Core.Math.Factorial(11)).toBe(39916800n)],
      ['12', () => expect(Core.Math.Factorial(12)).toBe(479001600n)],
      ['13', () => expect(Core.Math.Factorial(13)).toBe(6227020800n)],
      ['14', () => expect(Core.Math.Factorial(14)).toBe(87178291200n)],
      ['15', () => expect(Core.Math.Factorial(15)).toBe(1307674368000n)],
      ['16', () => expect(Core.Math.Factorial(16)).toBe(20922789888000n)],
      ['17', () => expect(Core.Math.Factorial(17)).toBe(355687428096000n)],
      ['18', () => expect(Core.Math.Factorial(18)).toBe(6402373705728000n)],
      ['19', () => expect(Core.Math.Factorial(19)).toBe(121645100408832000n)],
      ['20', () => expect(Core.Math.Factorial(20)).toBe(2432902008176640000n)],
      ['21', () => expect(Core.Math.Factorial(21)).toBe(51090942171709440000n)],
      ['22', () => expect(Core.Math.Factorial(22)).toBe(1124000727777607680000n)],
      ['23', () => expect(Core.Math.Factorial(23)).toBe(25852016738884976640000n)],
      ['24', () => expect(Core.Math.Factorial(24)).toBe(620448401733239439360000n)],
      ['25', () => expect(Core.Math.Factorial(25)).toBe(15511210043330985984000000n)],
      ['26', () => expect(Core.Math.Factorial(26)).toBe(403291461126605635584000000n)],
      ['27', () => expect(Core.Math.Factorial(27)).toBe(10888869450418352160768000000n)],
      ['28', () => expect(Core.Math.Factorial(28)).toBe(304888344611713860501504000000n)],
      ['29', () => expect(Core.Math.Factorial(29)).toBe(8841761993739701954543616000000n)],
      ['30', () => expect(Core.Math.Factorial(30)).toBe(265252859812191058636308480000000n)],
      ['31', () => expect(Core.Math.Factorial(31)).toBe(8222838654177922817725562880000000n)],
      ['32', () => expect(Core.Math.Factorial(32)).toBe(263130836933693530167218012160000000n)],
      ['33', () => expect(Core.Math.Factorial(33)).toBe(8683317618811886495518194401280000000n)],
      ['34', () => expect(Core.Math.Factorial(34)).toBe(295232799039604140847618609643520000000n)],
      ['35', () => expect(Core.Math.Factorial(35)).toBe(10333147966386144929666651337523200000000n)],
      ['36', () => expect(Core.Math.Factorial(36)).toBe(371993326789901217467999448150835200000000n)],
      ['37', () => expect(Core.Math.Factorial(37)).toBe(13763753091226345046315979581580902400000000n)],
      ['38', () => expect(Core.Math.Factorial(38)).toBe(523022617466601111760007224100074291200000000n)],
      ['39', () => expect(Core.Math.Factorial(39)).toBe(20397882081197443358640281739902897356800000000n)],
      ['40', () => expect(Core.Math.Factorial(40)).toBe(815915283247897734345611269596115894272000000000n)],
      ['41', () => expect(Core.Math.Factorial(41)).toBe(33452526613163807108170062053440751665152000000000n)],
      ['42', () => expect(Core.Math.Factorial(42)).toBe(1405006117752879898543142606244511569936384000000000n)],
      ['43', () => expect(Core.Math.Factorial(43)).toBe(60415263063373835637355132068513997507264512000000000n)],
      ['44', () => expect(Core.Math.Factorial(44)).toBe(2658271574788448768043625811014615890319638528000000000n)],
      ['45', () => expect(Core.Math.Factorial(45)).toBe(119622220865480194561963161495657715064383733760000000000n)],
      ['46', () => expect(Core.Math.Factorial(46)).toBe(5502622159812088949850305428800254892961651752960000000000n)],
      ['47', () => expect(Core.Math.Factorial(47)).toBe(258623241511168180642964355153611979969197632389120000000000n)],
      ['48', () => expect(Core.Math.Factorial(48)).toBe(12413915592536072670862289047373375038521486354677760000000000n)],
      ['49', () => expect(Core.Math.Factorial(49)).toBe(608281864034267560872252163321295376887552831379210240000000000n)],
      ['50', () => expect(Core.Math.Factorial(50)).toBe(30414093201713378043612608166064768844377641568960512000000000000n)],
      ['51', () => expect(Core.Math.Factorial(51)).toBe(1551118753287382280224243016469303211063259720016986112000000000000n)],
      ['52', () => expect(Core.Math.Factorial(52)).toBe(80658175170943878571660636856403766975289505440883277824000000000000n)],
      ['53', () => expect(Core.Math.Factorial(53)).toBe(4274883284060025564298013753389399649690343788366813724672000000000000n)],
      ['54', () => expect(Core.Math.Factorial(54)).toBe(230843697339241380472092742683027581083278564571807941132288000000000000n)],
      ['55', () => expect(Core.Math.Factorial(55)).toBe(12696403353658275925965100847566516959580321051449436762275840000000000000n)],
      ['56', () => expect(Core.Math.Factorial(56)).toBe(710998587804863451854045647463724949736497978881168458687447040000000000000n)],
      ['57', () => expect(Core.Math.Factorial(57)).toBe(40526919504877216755680601905432322134980384796226602145184481280000000000000n)],
      ['58', () => expect(Core.Math.Factorial(58)).toBe(2350561331282878571829474910515074683828862318181142924420699914240000000000000n)],
      ['59', () => expect(Core.Math.Factorial(59)).toBe(138683118545689835737939019720389406345902876772687432540821294940160000000000000n)],
      ['60', () => expect(Core.Math.Factorial(60)).toBe(8320987112741390144276341183223364380754172606361245952449277696409600000000000000n)],
      ['61', () => expect(Core.Math.Factorial(61)).toBe(507580213877224798800856812176625227226004528988036003099405939480985600000000000000n)],
      ['62', () => expect(Core.Math.Factorial(62)).toBe(31469973260387937525653122354950764088012280797258232192163168247821107200000000000000n)],
      ['63', () => expect(Core.Math.Factorial(63)).toBe(1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000n)],
      ['64', () => expect(Core.Math.Factorial(64)).toBe(126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000n)],
      ['65', () => expect(Core.Math.Factorial(65)).toBe(8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000n)],
      ['66', () => expect(Core.Math.Factorial(66)).toBe(544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000n)],
      ['67', () => expect(Core.Math.Factorial(67)).toBe(36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000n)],
      ['68', () => expect(Core.Math.Factorial(68)).toBe(2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000n)],
      ['69', () => expect(Core.Math.Factorial(69)).toBe(171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000n)],
      ['70', () => expect(Core.Math.Factorial(70)).toBe(11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000n)],
      ['71', () => expect(Core.Math.Factorial(71)).toBe(850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000n)],
      ['72', () => expect(Core.Math.Factorial(72)).toBe(61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000n)],
      ['73', () => expect(Core.Math.Factorial(73)).toBe(4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000n)],
      ['74', () => expect(Core.Math.Factorial(74)).toBe(330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000n)],
      ['75', () => expect(Core.Math.Factorial(75)).toBe(24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000n)],
      ['76', () => expect(Core.Math.Factorial(76)).toBe(1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000n)],
      ['77', () => expect(Core.Math.Factorial(77)).toBe(145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000n)],
      ['78', () => expect(Core.Math.Factorial(78)).toBe(11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000n)],
      ['79', () => expect(Core.Math.Factorial(79)).toBe(894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000n)],
      ['80', () => expect(Core.Math.Factorial(80)).toBe(71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000n)],
      ['81', () => expect(Core.Math.Factorial(81)).toBe(5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000n)],
      ['82', () => expect(Core.Math.Factorial(82)).toBe(475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000n)],
      ['83', () => expect(Core.Math.Factorial(83)).toBe(39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000n)],
      ['84', () => expect(Core.Math.Factorial(84)).toBe(3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000n)],
      ['85', () => expect(Core.Math.Factorial(85)).toBe(281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000n)],
      ['86', () => expect(Core.Math.Factorial(86)).toBe(24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000n)],
      ['87', () => expect(Core.Math.Factorial(87)).toBe(2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000n)],
      ['88', () => expect(Core.Math.Factorial(88)).toBe(185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000n)],
      ['89', () => expect(Core.Math.Factorial(89)).toBe(16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000n)],
      ['90', () => expect(Core.Math.Factorial(90)).toBe(1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000n)],
      ['91', () => expect(Core.Math.Factorial(91)).toBe(135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000n)],
      ['92', () => expect(Core.Math.Factorial(92)).toBe(12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000n)],
      ['93', () => expect(Core.Math.Factorial(93)).toBe(1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000n)],
      ['94', () => expect(Core.Math.Factorial(94)).toBe(108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000n)],
      ['95', () => expect(Core.Math.Factorial(95)).toBe(10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000n)],
      ['96', () => expect(Core.Math.Factorial(96)).toBe(991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000n)],
      ['97', () => expect(Core.Math.Factorial(97)).toBe(96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000n)],
      ['98', () => expect(Core.Math.Factorial(98)).toBe(9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000n)],
      ['99', () => expect(Core.Math.Factorial(99)).toBe(933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000n)],
      ['100', () => expect(Core.Math.Factorial(100)).toBe(93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000n)],
    ];
    for (const [n, fn] of Core.Array.Shuffle(tests)) {
      test(n, fn);
    }
  });
});
describe('Promise', () => {
  test(Core.Promise.Async_CountFulfilled.name, async () => {
    const count = await Core.Promise.Async_CountFulfilled([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.reject(1),
      Promise.reject(2),
      Promise.reject(3),
      //
    ]);
    expect(count).toBe(3);
  });
  test(Core.Promise.Async_CountRejected.name, async () => {
    const count = await Core.Promise.Async_CountRejected([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.reject(1),
      Promise.reject(2),
      Promise.reject(3),
      //
    ]);
    expect(count).toBe(3);
  });
  test(Core.Promise.CallAndOrphan.name, () => {
    expect(Core.Promise.CallAndOrphan(async () => {})).toBeEmpty();
  });
  test(Core.Promise.Orphan.name, () => {
    expect(Core.Promise.Orphan((async () => {})())).toBeEmpty();
  });
});
describe('Stream', () => {
  describe(Core.Stream.AsyncGen_ReadChunks.name, () => {
    test('123 456 789', async () => {
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          controller.enqueue(new Uint8Array([1, 2, 3]));
          await Core.Utility.Async_Sleep(0);
          controller.enqueue(new Uint8Array([4, 5, 6]));
          await Core.Utility.Async_Sleep(0);
          controller.enqueue(new Uint8Array([7, 8, 9]));
          await Core.Utility.Async_Sleep(0);
          controller.close();
        },
      });
      expect(await Array.fromAsync(Core.Stream.AsyncGen_ReadChunks(stream))).toEqual([
        new Uint8Array([1, 2, 3]),
        new Uint8Array([4, 5, 6]),
        new Uint8Array([7, 8, 9]),
        //
      ]);
    });
  });
});
describe('Stream Uint8', () => {
  describe(Core.Stream.Uint8.Async_Compare.name, () => {
    test('returns true for equal stream', async () => {
      const stream1 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          controller.close();
        },
      });
      const stream2 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          controller.close();
        },
      });
      expect(await Core.Stream.Uint8.Async_Compare(stream1, stream2)).toBeTrue();
    });
    test('returns false for unequal lengths', async () => {
      const stream1 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3]));
          controller.close();
        },
      });
      const stream2 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          controller.close();
        },
      });
      expect(await Core.Stream.Uint8.Async_Compare(stream1, stream2)).toBeFalse();
    });
    test('returns false for unequal streams', async () => {
      const stream1 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          controller.close();
        },
      });
      const stream2 = new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([2, 3, 4, 5]));
          controller.close();
        },
      });
      expect(await Core.Stream.Uint8.Async_Compare(stream1, stream2)).toBeFalse();
    });
  });
  describe(Core.Stream.Uint8.Async_ReadAll.name, () => {
    test('[1, 2, 3, 4]', async () => {
      const bytes = Uint8Array.from([1, 2, 3, 4]);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      expect([...(await Core.Stream.Uint8.Async_ReadAll(stream))]).toEqual([1, 2, 3, 4]);
    });
    test('10000 bytes', async () => {
      const bytes = new Uint8Array(10000);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = i;
      }
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      expect((await Core.Stream.Uint8.Async_ReadAll(stream)).byteLength).toBe(10000);
    });
  });
  describe(Core.Stream.Uint8.Async_ReadLines.name, () => {
    test('[1, 2, 3, \\n, 4, 5, 6, \\n, 7, 8, 9]', async () => {
      const bytes = Core.Array.Uint8.FromString('123\n456\n789');
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      const lines: string[] = [];
      await Core.Stream.Uint8.Async_ReadLines(stream, (line: string) => {
        lines.push(line);
      });
      expect(lines.flat()).toEqual(['123', '456', '789']);
    });
  });
  describe(Core.Stream.Uint8.Async_ReadSome.name, () => {
    test('[1, 2, 3, 4]', async () => {
      const bytes = Uint8Array.from([1, 2, 3, 4]);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      expect([...(await Core.Stream.Uint8.Async_ReadSome(stream, 2))]).toEqual([1, 2]);
    });
    test('10000 bytes', async () => {
      const bytes = new Uint8Array(10000);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = i;
      }
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      expect((await Core.Stream.Uint8.Async_ReadSome(stream, 1234)).byteLength).toBe(1234);
    });
  });
  describe(Core.Stream.Uint8.AsyncGen_ReadLines.name, () => {
    test('[1, 2, 3, \\n, 4, 5, 6, \\n, 7, 8, 9]', async () => {
      const bytes = Core.Array.Uint8.FromString('123\n456\n789');
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      });
      expect((await Array.fromAsync(Core.Stream.Uint8.AsyncGen_ReadLines(stream))).flat()).toEqual(['123', '456', '789']);
    });
    test('cancel', () => {});
  });
});
describe('String', () => {
  describe(Core.String.GetLeftMarginSize.name, () => {
    test('Empty', () => {
      expect(Core.String.GetLeftMarginSize('')).toBe(0);
    });
    test('0', () => {
      expect(Core.String.GetLeftMarginSize('0')).toBe(0);
    });
    test('1', () => {
      expect(Core.String.GetLeftMarginSize(' 1')).toBe(1);
    });
    test('2', () => {
      expect(Core.String.GetLeftMarginSize('  2')).toBe(2);
    });
    test('3', () => {
      expect(Core.String.GetLeftMarginSize('   3')).toBe(3);
    });
  });
  describe(Core.String.LineIsOnlyWhiteSpace.name, () => {
    test('Empty', () => {
      expect(Core.String.LineIsOnlyWhiteSpace('')).toBeTrue();
    });
    test('Space, Tab, Newline', () => {
      for (const ch of ' \t\n') {
        expect(Core.String.LineIsOnlyWhiteSpace(ch)).toBeTrue();
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 2)]) {
        expect(Core.String.LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 3)]) {
        expect(Core.String.LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 3)]) {
        expect(Core.String.LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 6)]) {
        expect(Core.String.LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
      }
    });
    test('Characters', () => {
      for (const ch of `abc123,./<>?;':"[]{}\\|!@#$%^&*()-=_+\`~`) {
        expect(Core.String.LineIsOnlyWhiteSpace(ch)).toBeFalse();
      }
    });
  });
  describe(Core.String.RemoveWhiteSpaceOnlyLines.name, () => {
    test('Empty', () => {
      expect(Core.String.RemoveWhiteSpaceOnlyLines('')).toEqual([]);
    });
    test('Whitespace only lines.', () => {
      for (const ch of ' \t\n') {
        expect(Core.String.RemoveWhiteSpaceOnlyLines(ch)).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 2)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLines(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 3)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLines(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 3)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLines(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 6)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLines(permu.join(''))).toEqual([]);
      }
      expect(Core.String.RemoveWhiteSpaceOnlyLines('\n\n\n')).toEqual([]);
      expect(Core.String.RemoveWhiteSpaceOnlyLines(' \n \n \n ')).toEqual([]);
      expect(Core.String.RemoveWhiteSpaceOnlyLines(' \t\n\t \t\n \n ')).toEqual([]);
    });
    test('Text surrounded with whitespace lines.', () => {
      expect(Core.String.RemoveWhiteSpaceOnlyLines('\nasdf\n')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLines(' \nasdf\n ')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLines('\t \nasdf\n \t')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLines('\nas\ndf\n')).toEqual(['as', 'df']);
      expect(Core.String.RemoveWhiteSpaceOnlyLines(' \nas\n \ndf\n ')).toEqual(['as', 'df']);
      expect(Core.String.RemoveWhiteSpaceOnlyLines('\t \nas\n\t\ndf\n \t')).toEqual(['as', 'df']);
    });
  });
  describe(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom.name, () => {
    test('Empty', () => {
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('')).toEqual([]);
    });
    test('Whitespace only lines.', () => {
      for (const ch of ' \t\n') {
        expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(ch)).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 2)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n'], 3)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 3)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
      }
      for (const permu of [...Core.Math.Gen_NChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 6)]) {
        expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
      }
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\n\n\n')).toEqual([]);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \n \n \n ')).toEqual([]);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \t\n\t \t\n \n ')).toEqual([]);
    });
    test('Text surrounded with whitespace lines.', () => {
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\nasdf\n')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \nasdf\n ')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\t \nasdf\n \t')).toEqual(['asdf']);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\nas\ndf\n')).toEqual(['as', 'df']);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \nas\n \ndf\n ')).toEqual(['as', ' ', 'df']);
      expect(Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\t \nas\n\t\ndf\n \t')).toEqual(['as', '\t', 'df']);
    });
  });
  describe(Core.String.Split.name, () => {
    test('Empty', () => {
      expect(Core.String.Split('', '')).toEqual([]);
    });
    test('On nothing.', () => {
      expect(Core.String.Split('a b c', '')).toEqual(['a', ' ', 'b', ' ', 'c']);
    });
    test('On spaces.', () => {
      expect(Core.String.Split('a b c', ' ')).toEqual(['a', 'b', 'c']);
    });
    test('On newlines.', () => {
      expect(Core.String.Split('a\nb\nc', '\n')).toEqual(['a', 'b', 'c']);
    });
    test('On ,.', () => {
      expect(Core.String.Split('a,b,c', ',')).toEqual(['a', 'b', 'c']);
    });
  });
  describe(Core.String.SplitLines.name, () => {
    test('Empty', () => {
      expect(Core.String.SplitLines('')).toEqual(['']);
    });
    test('No newlines.', () => {
      expect(Core.String.SplitLines('abc')).toEqual(['abc']);
    });
    test('Only lines.', () => {
      expect(Core.String.SplitLines('\n\n\n')).toEqual(['', '', '', '']);
    });
    test('a/b/c', () => {
      expect(Core.String.SplitLines('a\nb\nc')).toEqual(['a', 'b', 'c']);
    });
  });
  describe(Core.String.SplitMultipleSpaces.name, () => {
    test('Empty', () => {
      expect(Core.String.SplitMultipleSpaces('')).toEqual(['']);
    });
    test('No spaces.', () => {
      expect(Core.String.SplitMultipleSpaces('abc')).toEqual(['abc']);
    });
    test('Only spaces.', () => {
      expect(Core.String.SplitMultipleSpaces('   ')).toEqual(['', '']);
    });
    test('a/b/c', () => {
      expect(Core.String.SplitMultipleSpaces('a b c')).toEqual(['a', 'b', 'c']);
    });
  });
  describe(Core.String.SplitMultipleWhiteSpace.name, () => {
    test('Empty', () => {
      expect(Core.String.SplitMultipleWhiteSpace('')).toEqual(['']);
    });
    test('No whitespace.', () => {
      expect(Core.String.SplitMultipleWhiteSpace('abc')).toEqual(['abc']);
    });
    test('Only whitespace.', () => {
      expect(Core.String.SplitMultipleWhiteSpace(' \t\n \t \n  ')).toEqual(['', '']);
    });
    test('a/b/c', () => {
      expect(Core.String.SplitMultipleWhiteSpace('a \t b \n c')).toEqual(['a', 'b', 'c']);
    });
  });
  describe(Core.String.ToSnakeCase.name, () => {
    test('Empty', () => {
      expect(Core.String.ToSnakeCase('')).toBe('');
    });
    test('lowercase word', () => {
      expect(Core.String.ToSnakeCase('word')).toBe('word');
    });
    test('Uppercase Word', () => {
      expect(Core.String.ToSnakeCase('Word')).toBe('word');
    });
    test('a sentence.', () => {
      expect(Core.String.ToSnakeCase('a sentence.')).toBe('a-sentence.');
    });
    test('A sentence.', () => {
      expect(Core.String.ToSnakeCase('A sentence.')).toBe('a-sentence.');
    });
  });
  describe(Core.String.TrimLines.name, () => {
    test('Empty array.', () => {
      expect(Core.String.TrimLines([])).toEqual([]);
    });
    test('Empty line.', () => {
      expect(Core.String.TrimLines([''])).toEqual(['']);
    });
    test('Empty lines.', () => {
      expect(Core.String.TrimLines(['', '', ''])).toEqual(['', '', '']);
    });
    test('No whitespace.', () => {
      expect(Core.String.TrimLines(['abc'])).toEqual(['abc']);
      expect(Core.String.TrimLines(['abc', 'abc', 'abc'])).toEqual(['abc', 'abc', 'abc']);
    });
    test('Only whitespace.', () => {
      expect(Core.String.TrimLines([' \t\n \t \n  ', ' \t\n \t \n  ', ' \t\n \t \n  '])).toEqual(['', '', '']);
    });
    test('a/b/c', () => {
      expect(Core.String.TrimLines(['a \t b \n c'])).toEqual(['a \t b \n c']);
      expect(Core.String.TrimLines([' \t a \t b \n c \n '])).toEqual(['a \t b \n c']);
    });
  });
});
describe('Utility', () => {
  describe(Core.Utility.DecodeBytes.name, () => {
    test('[49,50,51]', () => {
      expect(Core.Utility.DecodeBytes(new Uint8Array([49, 50, 51]))).toBe('123');
    });
  });
  describe(Core.Utility.EncodeText.name, () => {
    test('123', () => {
      expect(Core.Utility.EncodeText('123')).toEqual(new Uint8Array([49, 50, 51]));
    });
  });
  describe(Core.Utility.CRC32.name, () => {
    const cases = [
      // Trivial one.
      ['', 0x00000000], //
      // Source: https://rosettacode.org/wiki/CRC-32
      ['The quick brown fox jumps over the lazy dog', 0x414fa339],
      // Source: http://cryptomanager.com/tv.html
      ['various CRC algorithms input data', 0x9bd366ae],
      // Source: http://www.febooti.com/products/filetweak/members/hash-and-crc/test-vectors/
      ['Test vector from febooti.com', 0x0c877f61],
    ] as const;
    for (const [input, expected] of cases) {
      test(input, () => {
        expect(Core.Utility.CRC32(Core.Utility.EncodeText(input))).toEqual(expected);
      });
    }
    test('123456789 => 0xCBF43926', () => {
      expect(Core.Utility.CRC32(Core.Utility.EncodeText('123456789'))).toEqual(0xcbf43926);
    });
    test('123, 456, 789 => 0xCBF43926', () => {
      const crc = Core.Utility.Class_CRC32();
      crc.update(Core.Utility.EncodeText('123'));
      crc.update(Core.Utility.EncodeText('456'));
      crc.update(Core.Utility.EncodeText('789'));
      expect(crc.value).toEqual(0xcbf43926);
    });
  });
});
