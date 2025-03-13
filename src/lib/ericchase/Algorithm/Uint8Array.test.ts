import { describe, expect, test } from 'bun:test';
import { U8, U8Clamped, U8Concat, U8Copy, U8FromBase64, U8FromString, U8FromUint32, U8Group, U8Split, U8Take, U8TakeEnd, U8ToASCII, U8ToBase64, U8ToDecimal, U8ToHex } from 'src/lib/ericchase/Algorithm/Uint8Array.js';

describe(U8Group.name, () => {
  test('[]', () => {
    const group = new U8Group();
    group.add(U8());
    expect(group.byteLength).toBe(0);
  });
  test('[0]', () => {
    const group = new U8Group();
    group.add(U8([0]));
    expect(group.byteLength).toBe(1);
    expect(group.get(1)).toEqual(new Uint8Array([0]));
  });
  test('[0, 0]', () => {
    const group = new U8Group();
    group.add(U8([0, 0]));
    expect(group.byteLength).toBe(2);
    expect(group.get(2)).toEqual(new Uint8Array([0, 0]));
  });
  test('[0], [0]', () => {
    const group = new U8Group();
    group.add(U8([0]));
    group.add(U8([0]));
    expect(group.byteLength).toBe(2);
    expect(group.get(2)).toEqual(new Uint8Array([0, 0]));
  });
  test('[1, 2, 3]', () => {
    const group = new U8Group();
    group.add(U8([1, 2, 3]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('[1], [2], [3]', () => {
    const group = new U8Group();
    group.add(U8([1]));
    group.add(U8([2]));
    group.add(U8([3]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('[200, 250, 300]', () => {
    const group = new U8Group();
    group.add(U8([200, 250, 300]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([200, 250, 44]));
  });
  test('[200], [250], [300]', () => {
    const group = new U8Group();
    group.add(U8([200]));
    group.add(U8([250]));
    group.add(U8([300]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([200, 250, 44]));
  });
  test('[0x0f, 0xff0f, 0xffff0f, 0xffffff0f]', () => {
    const group = new U8Group();
    group.add(U8([0x0f, 0xff0f, 0xffff0f, 0xffffff0f]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([0x0f, 0x0f, 0x0f, 0x0f]));
  });
  test('[0xff, 0xffff, 0xffffff, 0xffffffff]', () => {
    const group = new U8Group();
    group.add(U8([0xff, 0xffff, 0xffffff, 0xffffffff]));
    expect(group.get(group.byteLength)).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });
});

describe(U8.name, () => {
  test('[]', () => {
    expect(U8()).toEqual(new Uint8Array(0));
    expect(U8([])).toEqual(new Uint8Array(0));
  });
  test('[0]', () => {
    expect(U8([0])).toEqual(new Uint8Array([0]));
  });
  test('[0, 0]', () => {
    expect(U8([0, 0])).toEqual(new Uint8Array([0, 0]));
  });
  test('[1, 2, 3]', () => {
    expect(U8([1, 2, 3])).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('[200, 250, 300]', () => {
    expect(U8([200, 250, 300])).toEqual(new Uint8Array([200, 250, 44]));
  });
  test('[0x0f, 0xff0f, 0xffff0f, 0xffffff0f]', () => {
    expect(U8([0x0f, 0xff0f, 0xffff0f, 0xffffff0f])).toEqual(new Uint8Array([0x0f, 0x0f, 0x0f, 0x0f]));
  });
  test('[0xff, 0xffff, 0xffffff, 0xffffffff]', () => {
    expect(U8([0xff, 0xffff, 0xffffff, 0xffffffff])).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });
  test('U8S(U8S())', () => {
    expect(U8(U8([0x0f, 0xff0f, 0xffff0f, 0xffffff0f]))).toEqual(new Uint8Array([0x0f, 0x0f, 0x0f, 0x0f]));
    expect(U8(U8([0xff, 0xffff, 0xffffff, 0xffffffff]))).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });
});

describe(U8Clamped.name, () => {
  test('[]', () => {
    expect(U8Clamped()).toEqual(new Uint8Array(0));
    expect(U8Clamped([])).toEqual(new Uint8Array(0));
  });
  test('[0]', () => {
    expect(U8Clamped([0])).toEqual(new Uint8Array([0]));
  });
  test('[0, 0]', () => {
    expect(U8Clamped([0, 0])).toEqual(new Uint8Array([0, 0]));
  });
  test('[1, 2, 3]', () => {
    expect(U8Clamped([1, 2, 3])).toEqual(new Uint8Array([1, 2, 3]));
  });
  test('[200, 250, 300]', () => {
    expect(U8Clamped([200, 250, 300])).toEqual(new Uint8Array([200, 250, 255]));
  });
  test('[0x0f, 0xff0f, 0xffff0f, 0xffffff0f]', () => {
    expect(U8Clamped([0x0f, 0xff0f, 0xffff0f, 0xffffff0f])).toEqual(new Uint8Array([0x0f, 0xff, 0xff, 0xff]));
  });
  test('[0xff, 0xffff, 0xffffff, 0xffffffff]', () => {
    expect(U8Clamped([0xff, 0xffff, 0xffffff, 0xffffffff])).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });
  test('U8SClamped(U8SClamped())', () => {
    expect(U8Clamped(U8Clamped([0x0f, 0xff0f, 0xffff0f, 0xffffff0f]))).toEqual(new Uint8Array([0x0f, 0xff, 0xff, 0xff]));
    expect(U8Clamped(U8Clamped([0xff, 0xffff, 0xffffff, 0xffffffff]))).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });
});

describe(U8Concat.name, () => {
  const cases = [
    [[U8([])], U8([])],
    [[U8([1, 2])], U8([1, 2])],
    [[U8([1, 2]), U8([3, 4])], U8([1, 2, 3, 4])],
  ] as const;
  for (const [input, expected] of cases) {
    test(U8ToHex(expected).join(' '), () => {
      expect(U8Concat(input)).toEqual(expected);
    });
  }
});

describe(U8Copy.name, () => {
  function fn(bytes: Uint8Array, size: number, offset: number, expected: Uint8Array) {
    test(`[${U8ToHex(bytes).toString()}] ${size}:${offset}`, () => {
      expect(U8Copy(bytes, size, offset)).toEqual(expected);
    });
  }
  fn(U8(), 4, 0, U8());
  fn(U8(), 4, 4, U8());
  fn(U8([1, 2, 3, 4, 5, 6, 7, 8]), 4, 0, U8([1, 2, 3, 4]));
  fn(U8([1, 2, 3, 4, 5, 6, 7, 8]), 4, 4, U8([5, 6, 7, 8]));
  fn(U8([1, 2, 3, 4, 5, 6, 7, 8]), 4, 8, U8());
});

describe(U8FromBase64.name, () => {
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
      expect(U8FromBase64(input)).toEqual(U8FromString(expected));
    });
  }
});

describe(U8FromString.name, () => {
  const cases = [
    ['123', U8([49, 50, 51])],
    ['abc', U8([97, 98, 99])],
    ['ABC', U8([65, 66, 67])],
    ['IDAT', U8([0x49, 0x44, 0x41, 0x54])],
  ] as const;
  for (const [input, expected] of cases) {
    test(input, () => {
      expect(U8FromString(input)).toEqual(expected);
    });
  }
});

describe(U8FromUint32.name, () => {
  const cases = [
    [0x00000000, U8([0x00, 0x00, 0x00, 0x00])],
    [0x414fa339, U8([0x41, 0x4f, 0xa3, 0x39])],
    [0x9bd366ae, U8([0x9b, 0xd3, 0x66, 0xae])],
    [0x0c877f61, U8([0x0c, 0x87, 0x7f, 0x61])],
  ] as const;
  for (const [input, expected] of cases) {
    test(`0x${input.toString(16).padStart(8, '0')}`, () => {
      expect(U8FromUint32(input)).toEqual(expected);
    });
  }
});

describe(U8Split.name, () => {
  test('[]', () => {
    expect(U8Split(U8(), -1)).toEqual([U8()]);
    expect(U8Split(U8(), 0)).toEqual([U8()]);
    expect(U8Split(U8(), 1)).toEqual([U8()]);
  });
  test('[1]', () => {
    expect(U8Split(U8([1]), -1)).toEqual([U8([1])]);
    expect(U8Split(U8([1]), 0)).toEqual([U8([1])]);
    expect(U8Split(U8([1]), 1)).toEqual([U8([1])]);
  });
  test('[1, 2]', () => {
    expect(U8Split(U8([1, 2]), -1)).toEqual([U8([1, 2])]);
    expect(U8Split(U8([1, 2]), 0)).toEqual([U8([1, 2])]);
    expect(U8Split(U8([1, 2]), 1)).toEqual([U8([1]), U8([2])]);
  });
  test('[1, 2, 3] split 1', () => {
    expect(U8Split(U8([1, 2, 3]), 1)).toEqual([U8([1]), U8([2]), U8([3])]);
  });
  test('[1, 2] split 2', () => {
    expect(U8Split(U8([1, 2]), 2)).toEqual([U8([1, 2])]);
  });
  test('[1, 2, 3, 4] split 2', () => {
    expect(U8Split(U8([1, 2, 3, 4]), 2)).toEqual([U8([1, 2]), U8([3, 4])]);
  });
  test('[1, 2, 3, 4, 5, 6] split 2', () => {
    expect(U8Split(U8([1, 2, 3, 4, 5, 6]), 2)).toEqual([U8([1, 2]), U8([3, 4]), U8([5, 6])]);
  });
  test('[1, 2, 3, 4] split 6', () => {
    expect(U8Split(U8([1, 2, 3, 4]), 6)).toEqual([U8([1, 2, 3, 4])]);
  });
  test('[] split 1', () => {
    expect(U8Split(U8(), 1)).toEqual([U8()]);
  });
  test('Underlying Buffers are Different', () => {
    const original = U8([1, 2, 3, 4, 5, 6]);
    const u8s = U8Split(original, 2);
    for (const u8 of u8s) {
      expect(u8.buffer).not.toBe(original.buffer);
    }
  });
});

describe(U8Take.name, () => {
  test('[]', () => {
    expect(U8Take(U8(), -1)).toEqual([U8(), U8()]);
    expect(U8Take(U8(), 0)).toEqual([U8(), U8()]);
    expect(U8Take(U8(), 1)).toEqual([U8(), U8()]);
  });
  test('[1]', () => {
    expect(U8Take(U8([1]), -1)).toEqual([U8(), U8([1])]);
    expect(U8Take(U8([1]), 0)).toEqual([U8(), U8([1])]);
    expect(U8Take(U8([1]), 1)).toEqual([U8([1]), U8()]);
  });
  test('[1, 2]', () => {
    expect(U8Take(U8([1, 2]), -1)).toEqual([U8(), U8([1, 2])]);
    expect(U8Take(U8([1, 2]), 0)).toEqual([U8(), U8([1, 2])]);
    expect(U8Take(U8([1, 2]), 1)).toEqual([U8([1]), U8([2])]);
  });
  test('[1, 2] take 2', () => {
    expect(U8Take(U8([1, 2]), 2)).toEqual([U8([1, 2]), U8()]);
  });
  test('[1, 2, 3, 4] take 2', () => {
    expect(U8Take(U8([1, 2, 3, 4]), 2)).toEqual([U8([1, 2]), U8([3, 4])]);
  });
  test('[1, 2, 3, 4] take 6', () => {
    expect(U8Take(U8([1, 2, 3, 4]), 6)).toEqual([U8([1, 2, 3, 4]), U8()]);
  });
});

describe(U8TakeEnd.name, () => {
  test('[]', () => {
    expect(U8TakeEnd(U8(), -1)).toEqual([U8(), U8()]);
    expect(U8TakeEnd(U8(), 0)).toEqual([U8(), U8()]);
    expect(U8TakeEnd(U8(), 1)).toEqual([U8(), U8()]);
  });
  test('[1]', () => {
    expect(U8TakeEnd(U8([1]), -1)).toEqual([U8(), U8([1])]);
    expect(U8TakeEnd(U8([1]), 0)).toEqual([U8(), U8([1])]);
    expect(U8TakeEnd(U8([1]), 1)).toEqual([U8([1]), U8()]);
  });
  test('[1, 2]', () => {
    expect(U8TakeEnd(U8([1, 2]), -1)).toEqual([U8(), U8([1, 2])]);
    expect(U8TakeEnd(U8([1, 2]), 0)).toEqual([U8(), U8([1, 2])]);
    expect(U8TakeEnd(U8([1, 2]), 1)).toEqual([U8([2]), U8([1])]);
  });
  test('[1, 2] take 2', () => {
    expect(U8TakeEnd(U8([1, 2]), 2)).toEqual([U8([1, 2]), U8()]);
  });
  test('[1, 2, 3, 4] take 2', () => {
    expect(U8TakeEnd(U8([1, 2, 3, 4]), 2)).toEqual([U8([3, 4]), U8([1, 2])]);
  });
  test('[1, 2, 3, 4] take 6', () => {
    expect(U8TakeEnd(U8([1, 2, 3, 4]), 6)).toEqual([U8([1, 2, 3, 4]), U8()]);
  });
  test('[] take 1', () => {
    expect(U8TakeEnd(U8(), 1)).toEqual([U8(), U8()]);
  });
});

describe(U8ToASCII.name, () => {
  const cases = [
    [U8([49, 50, 51]), '123'],
    [U8([97, 98, 99]), 'abc'],
    [U8([65, 66, 67]), 'ABC'],
    [U8([0x49, 0x44, 0x41, 0x54]), 'IDAT'],
  ] as const;
  for (const [input, expected] of cases) {
    test(expected, () => {
      expect(U8ToASCII(input)).toEqual(expected);
    });
  }
});

describe(U8ToBase64.name, () => {
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
      expect(U8ToBase64(U8FromString(input))).toEqual(expected);
    });
  }
});

describe(U8ToDecimal.name, () => {
  const cases = [
    [0x00000000, '0 0 0 0'],
    [0x414fa339, '65 79 163 57'],
    [0x9bd366ae, '155 211 102 174'],
    [0x0c877f61, '12 135 127 97'],
  ] as const;
  for (const [input, expected] of cases) {
    test(expected, () => {
      expect(U8ToDecimal(U8FromUint32(input)).join(' ')).toEqual(expected);
    });
  }
});

describe(U8ToHex.name, () => {
  const cases = [
    [0x00000000, '00 00 00 00'],
    [0x414fa339, '41 4f a3 39'],
    [0x9bd366ae, '9b d3 66 ae'],
    [0x0c877f61, '0c 87 7f 61'],
  ] as const;
  for (const [input, expected] of cases) {
    test(expected, () => {
      expect(U8ToHex(U8FromUint32(input)).join(' ')).toEqual(expected);
    });
  }
});
