import { describe, expect, test } from 'bun:test';

import { GeneratorArray } from './GeneratorArray.js';

describe('Array', () => {
  describe('Mutating Methods', () => {
    test('push', () => {
      const array = [1, 2, 3];
      expect(array.push(4)).toBe(4);
      expect(array).toEqual([1, 2, 3, 4]);
    });
    test('pop', () => {
      expect([].pop()).toBe(undefined);
      const array = [1, 2, 3];
      expect(array.pop()).toBe(3);
      expect(array).toEqual([1, 2]);
    });
    test('shift', () => {
      expect([].shift()).toBe(undefined);
      const array = [1, 2, 3];
      expect(array.shift()).toBe(1);
      expect(array).toEqual([2, 3]);
    });
    test('unshift', () => {
      const array = [1, 2, 3];
      expect(array.unshift(0)).toBe(4);
      expect(array).toEqual([0, 1, 2, 3]);
    });
    describe('splice - additions', () => {
      test('?, 0, 0', () => {
        {
          const array = [1, 2, 3];
          array.splice(4, 0, 0);
          expect(array).toEqual([1, 2, 3, 0]);
        }
        {
          const array = [1, 2, 3];
          array.splice(3, 0, 0);
          expect(array).toEqual([1, 2, 3, 0]);
        }
        {
          const array = [1, 2, 3];
          array.splice(2, 0, 0);
          expect(array).toEqual([1, 2, 0, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(1, 0, 0);
          expect(array).toEqual([1, 0, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(0, 0, 0);
          expect(array).toEqual([0, 1, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(-1, 0, 0);
          expect(array).toEqual([1, 2, 0, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(-2, 0, 0);
          expect(array).toEqual([1, 0, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(-3, 0, 0);
          expect(array).toEqual([0, 1, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          array.splice(-4, 0, 0);
          expect(array).toEqual([0, 1, 2, 3]);
        }
      });
    });
    describe('splice - deletetions', () => {
      test('edge cases', () => {
        const array = [1, 2, 3];
        // @ts-ignore: just need to test it
        expect(array.splice()).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('0, ?', () => {
        const array = [1, 2, 3];
        expect(array.splice(0)).toEqual([1, 2, 3]);
        expect(array).toEqual([]);
        expect([1, 2, 3].splice(0, 4)).toEqual([1, 2, 3]);
        expect([1, 2, 3].splice(0, 3)).toEqual([1, 2, 3]);
        expect([1, 2, 3].splice(0, 2)).toEqual([1, 2]);
        expect([1, 2, 3].splice(0, 1)).toEqual([1]);
        expect([1, 2, 3].splice(0, 0)).toEqual([]);
        expect([1, 2, 3].splice(0, -1)).toEqual([]);
        expect([1, 2, 3].splice(0, -2)).toEqual([]);
        expect([1, 2, 3].splice(0, -3)).toEqual([]);
        expect([1, 2, 3].splice(0, -4)).toEqual([]);
      });
      test('1, ?', () => {
        expect([1, 2, 3].splice(1)).toEqual([2, 3]);
        expect([1, 2, 3].splice(1, 4)).toEqual([2, 3]);
        expect([1, 2, 3].splice(1, 3)).toEqual([2, 3]);
        expect([1, 2, 3].splice(1, 2)).toEqual([2, 3]);
        expect([1, 2, 3].splice(1, 1)).toEqual([2]);
        expect([1, 2, 3].splice(1, 0)).toEqual([]);
        expect([1, 2, 3].splice(1, -1)).toEqual([]);
        expect([1, 2, 3].splice(1, -2)).toEqual([]);
        expect([1, 2, 3].splice(1, -3)).toEqual([]);
        expect([1, 2, 3].splice(1, -4)).toEqual([]);
      });
      test('2, ?', () => {
        expect([1, 2, 3].splice(2)).toEqual([3]);
        expect([1, 2, 3].splice(2, 4)).toEqual([3]);
        expect([1, 2, 3].splice(2, 3)).toEqual([3]);
        expect([1, 2, 3].splice(2, 2)).toEqual([3]);
        expect([1, 2, 3].splice(2, 1)).toEqual([3]);
        expect([1, 2, 3].splice(2, 0)).toEqual([]);
        expect([1, 2, 3].splice(2, -1)).toEqual([]);
        expect([1, 2, 3].splice(2, -2)).toEqual([]);
        expect([1, 2, 3].splice(2, -3)).toEqual([]);
        expect([1, 2, 3].splice(2, -4)).toEqual([]);
      });
      test('3, ?', () => {
        expect([1, 2, 3].splice(3)).toEqual([]);
        expect([1, 2, 3].splice(3, 4)).toEqual([]);
        expect([1, 2, 3].splice(3, 3)).toEqual([]);
        expect([1, 2, 3].splice(3, 2)).toEqual([]);
        expect([1, 2, 3].splice(3, 1)).toEqual([]);
        expect([1, 2, 3].splice(3, 0)).toEqual([]);
        expect([1, 2, 3].splice(3, -1)).toEqual([]);
        expect([1, 2, 3].splice(3, -2)).toEqual([]);
        expect([1, 2, 3].splice(3, -3)).toEqual([]);
        expect([1, 2, 3].splice(3, -4)).toEqual([]);
      });
      test('-1, ?', () => {
        expect([1, 2, 3].splice(-1)).toEqual([3]);
        expect([1, 2, 3].splice(-1, 4)).toEqual([3]);
        expect([1, 2, 3].splice(-1, 3)).toEqual([3]);
        expect([1, 2, 3].splice(-1, 2)).toEqual([3]);
        expect([1, 2, 3].splice(-1, 1)).toEqual([3]);
        expect([1, 2, 3].splice(-1, 0)).toEqual([]);
        expect([1, 2, 3].splice(-1, -1)).toEqual([]);
        expect([1, 2, 3].splice(-1, -2)).toEqual([]);
        expect([1, 2, 3].splice(-1, -3)).toEqual([]);
        expect([1, 2, 3].splice(-1, -4)).toEqual([]);
      });
      test('-2, ?', () => {
        expect([1, 2, 3].splice(-2)).toEqual([2, 3]);
        expect([1, 2, 3].splice(-2, 4)).toEqual([2, 3]);
        expect([1, 2, 3].splice(-2, 3)).toEqual([2, 3]);
        expect([1, 2, 3].splice(-2, 2)).toEqual([2, 3]);
        expect([1, 2, 3].splice(-2, 1)).toEqual([2]);
        expect([1, 2, 3].splice(-2, 0)).toEqual([]);
        expect([1, 2, 3].splice(-2, -1)).toEqual([]);
        expect([1, 2, 3].splice(-2, -2)).toEqual([]);
        expect([1, 2, 3].splice(-2, -3)).toEqual([]);
        expect([1, 2, 3].splice(-2, -4)).toEqual([]);
      });
      test('-3, ?', () => {
        expect([1, 2, 3].splice(-3)).toEqual([1, 2, 3]);
        expect([1, 2, 3].splice(-3, 4)).toEqual([1, 2, 3]);
        expect([1, 2, 3].splice(-3, 3)).toEqual([1, 2, 3]);
        expect([1, 2, 3].splice(-3, 2)).toEqual([1, 2]);
        expect([1, 2, 3].splice(-3, 1)).toEqual([1]);
        expect([1, 2, 3].splice(-3, 0)).toEqual([]);
        expect([1, 2, 3].splice(-3, -1)).toEqual([]);
        expect([1, 2, 3].splice(-3, -2)).toEqual([]);
        expect([1, 2, 3].splice(-3, -3)).toEqual([]);
        expect([1, 2, 3].splice(-3, -4)).toEqual([]);
      });
    });
    describe('splice - mixed', () => {
      test('0, ?, 0', () => {
        {
          const array = [1, 2, 3];
          expect(array.splice(0, 4, 0)).toEqual([1, 2, 3]);
          expect(array).toEqual([0]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, 3, 0)).toEqual([1, 2, 3]);
          expect(array).toEqual([0]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, 2, 0)).toEqual([1, 2]);
          expect(array).toEqual([0, 3]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, 1, 0)).toEqual([1]);
          expect(array).toEqual([0, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, -1, 0)).toEqual([]);
          expect(array).toEqual([0, 1, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, -2, 0)).toEqual([]);
          expect(array).toEqual([0, 1, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, -3, 0)).toEqual([]);
          expect(array).toEqual([0, 1, 2, 3]);
        }
        {
          const array = [1, 2, 3];
          expect(array.splice(0, -4, 0)).toEqual([]);
          expect(array).toEqual([0, 1, 2, 3]);
        }
      });
    });
  });
  describe('Non-mutating Methods', () => {
    describe('slice', () => {
      test('edge cases', () => {
        const array = [1, 2, 3];
        expect(array.slice()).toEqual([1, 2, 3]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('0 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(0)).toEqual([1, 2, 3]);
        expect(array.slice(0, 4)).toEqual([1, 2, 3]);
        expect(array.slice(0, 3)).toEqual([1, 2, 3]);
        expect(array.slice(0, 2)).toEqual([1, 2]);
        expect(array.slice(0, 1)).toEqual([1]);
        expect(array.slice(0, 0)).toEqual([]);
        expect(array.slice(0, -1)).toEqual([1, 2]);
        expect(array.slice(0, -2)).toEqual([1]);
        expect(array.slice(0, -3)).toEqual([]);
        expect(array.slice(0, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('1 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(1)).toEqual([2, 3]);
        expect(array.slice(1, 4)).toEqual([2, 3]);
        expect(array.slice(1, 3)).toEqual([2, 3]);
        expect(array.slice(1, 2)).toEqual([2]);
        expect(array.slice(1, 1)).toEqual([]);
        expect(array.slice(1, 0)).toEqual([]);
        expect(array.slice(1, -1)).toEqual([2]);
        expect(array.slice(1, -2)).toEqual([]);
        expect(array.slice(1, -3)).toEqual([]);
        expect(array.slice(1, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('2 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(2)).toEqual([3]);
        expect(array.slice(2, 4)).toEqual([3]);
        expect(array.slice(2, 3)).toEqual([3]);
        expect(array.slice(2, 2)).toEqual([]);
        expect(array.slice(2, 1)).toEqual([]);
        expect(array.slice(2, 0)).toEqual([]);
        expect(array.slice(2, -1)).toEqual([]);
        expect(array.slice(2, -2)).toEqual([]);
        expect(array.slice(2, -3)).toEqual([]);
        expect(array.slice(2, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('3 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(3)).toEqual([]);
        expect(array.slice(3, 4)).toEqual([]);
        expect(array.slice(3, 3)).toEqual([]);
        expect(array.slice(3, 2)).toEqual([]);
        expect(array.slice(3, 1)).toEqual([]);
        expect(array.slice(3, 0)).toEqual([]);
        expect(array.slice(3, -1)).toEqual([]);
        expect(array.slice(3, -2)).toEqual([]);
        expect(array.slice(3, -3)).toEqual([]);
        expect(array.slice(3, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('-1 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(-1)).toEqual([3]);
        expect(array.slice(-1, 4)).toEqual([3]);
        expect(array.slice(-1, 3)).toEqual([3]);
        expect(array.slice(-1, 2)).toEqual([]);
        expect(array.slice(-1, 1)).toEqual([]);
        expect(array.slice(-1, 0)).toEqual([]);
        expect(array.slice(-1, -1)).toEqual([]);
        expect(array.slice(-1, -2)).toEqual([]);
        expect(array.slice(-1, -3)).toEqual([]);
        expect(array.slice(-1, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('-2 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(-2)).toEqual([2, 3]);
        expect(array.slice(-2, 4)).toEqual([2, 3]);
        expect(array.slice(-2, 3)).toEqual([2, 3]);
        expect(array.slice(-2, 2)).toEqual([2]);
        expect(array.slice(-2, 1)).toEqual([]);
        expect(array.slice(-2, 0)).toEqual([]);
        expect(array.slice(-2, -1)).toEqual([2]);
        expect(array.slice(-2, -2)).toEqual([]);
        expect(array.slice(-2, -3)).toEqual([]);
        expect(array.slice(-2, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
      test('-3 to', () => {
        const array = [1, 2, 3];
        expect(array.slice(-3)).toEqual([1, 2, 3]);
        expect(array.slice(-3, 4)).toEqual([1, 2, 3]);
        expect(array.slice(-3, 3)).toEqual([1, 2, 3]);
        expect(array.slice(-3, 2)).toEqual([1, 2]);
        expect(array.slice(-3, 1)).toEqual([1]);
        expect(array.slice(-3, 0)).toEqual([]);
        expect(array.slice(-3, -1)).toEqual([1, 2]);
        expect(array.slice(-3, -2)).toEqual([1]);
        expect(array.slice(-3, -3)).toEqual([]);
        expect(array.slice(-3, -4)).toEqual([]);
        expect(array).toEqual([1, 2, 3]);
      });
    });
    test('map', () => {
      expect([1, 2, 3].map((x) => x * 2)).toEqual([2, 4, 6]);
    });
    test('filter', () => {
      expect([1, 2, 3, 4, 5, 6].filter((x) => x % 2 === 0)).toEqual([2, 4, 6]);
    });
    test('forEach', () => {
      let sum = 0;
      // biome-ignore lint/complexity/noForEach: just need to test it
      [1, 2, 3].forEach((x) => {
        sum += x;
      });
      expect(sum).toBe(6);
    });
    test('reduce', () => {
      const sum = [1, 2, 3].reduce((acc, curr) => acc + curr, 0);
      expect(sum).toBe(6);
    });
  });
});

describe('GeneratorArray', () => {
  function* basicGenerator() {
    for (let i = 0; i < 3; i++) {
      yield i + 1;
    }
  }
  describe('Mutating Methods', () => {
    test('push', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.push(4)).toBe(4);
      expect(generator_array.slice()).toEqual([1, 2, 3, 4]);
    });
    test('pop', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.pop()).toBe(3);
      expect(generator_array.slice()).toEqual([1, 2]);
    });
    test('shift', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.shift()).toBe(1);
      expect(generator_array.slice()).toEqual([2, 3]);
    });
    test('unshift', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.unshift(0)).toBe(4);
      expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
    });
    describe('splice - additions', () => {
      test('?, 0, 0', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(4, 0, 0);
          expect(generator_array.slice()).toEqual([1, 2, 3, 0]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(3, 0, 0);
          expect(generator_array.slice()).toEqual([1, 2, 3, 0]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(2, 0, 0);
          expect(generator_array.slice()).toEqual([1, 2, 0, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(1, 0, 0);
          expect(generator_array.slice()).toEqual([1, 0, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(0, 0, 0);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(-1, 0, 0);
          expect(generator_array.slice()).toEqual([1, 2, 0, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(-2, 0, 0);
          expect(generator_array.slice()).toEqual([1, 0, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(-3, 0, 0);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          generator_array.splice(-4, 0, 0);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
      });
    });
    describe('splice - deletetions', () => {
      test('edge cases', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        // @ts-ignore: just need to test it
        expect(generator_array.splice()).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('0, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 4)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 3)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 2)).toEqual([1, 2]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 1)).toEqual([1]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -4)).toEqual([]);
        }
      });
      test('1, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, 4)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, 3)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, 2)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, 1)).toEqual([2]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(1, -4)).toEqual([]);
        }
      });
      test('2, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, 4)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, 3)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, 2)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, 1)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(2, -4)).toEqual([]);
        }
      });
      test('3, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, 4)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, 3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, 2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, 1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(3, -4)).toEqual([]);
        }
      });
      test('-1, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, 4)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, 3)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, 2)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, 1)).toEqual([3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-1, -4)).toEqual([]);
        }
      });
      test('-2, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, 4)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, 3)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, 2)).toEqual([2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, 1)).toEqual([2]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-2, -4)).toEqual([]);
        }
      });
      test('-3, ?', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, 4)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, 3)).toEqual([1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, 2)).toEqual([1, 2]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, 1)).toEqual([1]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, 0)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, -1)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, -2)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, -3)).toEqual([]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(-3, -4)).toEqual([]);
        }
      });
    });
    describe('splice - mixed', () => {
      test('0, ?, 0', () => {
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 4, 0)).toEqual([1, 2, 3]);
          expect(generator_array.slice()).toEqual([0]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 3, 0)).toEqual([1, 2, 3]);
          expect(generator_array.slice()).toEqual([0]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 2, 0)).toEqual([1, 2]);
          expect(generator_array.slice()).toEqual([0, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, 1, 0)).toEqual([1]);
          expect(generator_array.slice()).toEqual([0, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -1, 0)).toEqual([]);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -2, 0)).toEqual([]);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -3, 0)).toEqual([]);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
        {
          const generator_array = GeneratorArray(basicGenerator());
          expect([...generator_array]).toEqual([1, 2, 3]);
          expect(generator_array.splice(0, -4, 0)).toEqual([]);
          expect(generator_array.slice()).toEqual([0, 1, 2, 3]);
        }
      });
    });
  });
  describe('Non-mutating Methods', () => {
    describe('slice', () => {
      test('edge cases', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('0 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(0)).toEqual([1, 2, 3]);
        expect(generator_array.slice(0, 4)).toEqual([1, 2, 3]);
        expect(generator_array.slice(0, 3)).toEqual([1, 2, 3]);
        expect(generator_array.slice(0, 2)).toEqual([1, 2]);
        expect(generator_array.slice(0, 1)).toEqual([1]);
        expect(generator_array.slice(0, 0)).toEqual([]);
        expect(generator_array.slice(0, -1)).toEqual([1, 2]);
        expect(generator_array.slice(0, -2)).toEqual([1]);
        expect(generator_array.slice(0, -3)).toEqual([]);
        expect(generator_array.slice(0, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('1 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(1)).toEqual([2, 3]);
        expect(generator_array.slice(1, 4)).toEqual([2, 3]);
        expect(generator_array.slice(1, 3)).toEqual([2, 3]);
        expect(generator_array.slice(1, 2)).toEqual([2]);
        expect(generator_array.slice(1, 1)).toEqual([]);
        expect(generator_array.slice(1, 0)).toEqual([]);
        expect(generator_array.slice(1, -1)).toEqual([2]);
        expect(generator_array.slice(1, -2)).toEqual([]);
        expect(generator_array.slice(1, -3)).toEqual([]);
        expect(generator_array.slice(1, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('2 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(2)).toEqual([3]);
        expect(generator_array.slice(2, 4)).toEqual([3]);
        expect(generator_array.slice(2, 3)).toEqual([3]);
        expect(generator_array.slice(2, 2)).toEqual([]);
        expect(generator_array.slice(2, 1)).toEqual([]);
        expect(generator_array.slice(2, 0)).toEqual([]);
        expect(generator_array.slice(2, -1)).toEqual([]);
        expect(generator_array.slice(2, -2)).toEqual([]);
        expect(generator_array.slice(2, -3)).toEqual([]);
        expect(generator_array.slice(2, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('3 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(3)).toEqual([]);
        expect(generator_array.slice(3, 4)).toEqual([]);
        expect(generator_array.slice(3, 3)).toEqual([]);
        expect(generator_array.slice(3, 2)).toEqual([]);
        expect(generator_array.slice(3, 1)).toEqual([]);
        expect(generator_array.slice(3, 0)).toEqual([]);
        expect(generator_array.slice(3, -1)).toEqual([]);
        expect(generator_array.slice(3, -2)).toEqual([]);
        expect(generator_array.slice(3, -3)).toEqual([]);
        expect(generator_array.slice(3, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('-1 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(-1)).toEqual([3]);
        expect(generator_array.slice(-1, 4)).toEqual([3]);
        expect(generator_array.slice(-1, 3)).toEqual([3]);
        expect(generator_array.slice(-1, 2)).toEqual([]);
        expect(generator_array.slice(-1, 1)).toEqual([]);
        expect(generator_array.slice(-1, 0)).toEqual([]);
        expect(generator_array.slice(-1, -1)).toEqual([]);
        expect(generator_array.slice(-1, -2)).toEqual([]);
        expect(generator_array.slice(-1, -3)).toEqual([]);
        expect(generator_array.slice(-1, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('-2 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(-2)).toEqual([2, 3]);
        expect(generator_array.slice(-2, 4)).toEqual([2, 3]);
        expect(generator_array.slice(-2, 3)).toEqual([2, 3]);
        expect(generator_array.slice(-2, 2)).toEqual([2]);
        expect(generator_array.slice(-2, 1)).toEqual([]);
        expect(generator_array.slice(-2, 0)).toEqual([]);
        expect(generator_array.slice(-2, -1)).toEqual([2]);
        expect(generator_array.slice(-2, -2)).toEqual([]);
        expect(generator_array.slice(-2, -3)).toEqual([]);
        expect(generator_array.slice(-2, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
      test('-3 to', () => {
        const generator_array = GeneratorArray(basicGenerator());
        expect([...generator_array]).toEqual([1, 2, 3]);
        expect(generator_array.slice(-3)).toEqual([1, 2, 3]);
        expect(generator_array.slice(-3, 4)).toEqual([1, 2, 3]);
        expect(generator_array.slice(-3, 3)).toEqual([1, 2, 3]);
        expect(generator_array.slice(-3, 2)).toEqual([1, 2]);
        expect(generator_array.slice(-3, 1)).toEqual([1]);
        expect(generator_array.slice(-3, 0)).toEqual([]);
        expect(generator_array.slice(-3, -1)).toEqual([1, 2]);
        expect(generator_array.slice(-3, -2)).toEqual([1]);
        expect(generator_array.slice(-3, -3)).toEqual([]);
        expect(generator_array.slice(-3, -4)).toEqual([]);
        expect(generator_array.slice()).toEqual([1, 2, 3]);
      });
    });
    test('map', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.map((x) => x * 2)).toEqual([2, 4, 6]);
    });
    test('filter', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      expect(generator_array.filter((x) => x % 2 === 0)).toEqual([2]);
    });
    test('forEach', () => {
      let sum = 0;
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      // biome-ignore lint/complexity/noForEach: just need to test it
      generator_array.forEach((x) => {
        sum += x;
      });
      expect(sum).toBe(6);
    });
    test('reduce', () => {
      const generator_array = GeneratorArray(basicGenerator());
      expect([...generator_array]).toEqual([1, 2, 3]);
      const sum = generator_array.reduce((acc, curr) => acc + curr, 0);
      expect(sum).toBe(6);
    });
  });
});
