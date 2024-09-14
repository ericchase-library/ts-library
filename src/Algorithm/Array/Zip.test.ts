import { describe, expect, test } from 'bun:test';
import { Zip } from './Zip.js';

describe('Zip', () => {
  test('[1,2,3] [a,b,c]', () => {
    expect(Array.from(Zip([1, 2, 3], ['a', 'b', 'c']))).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
});
