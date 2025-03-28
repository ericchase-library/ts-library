import { describe, expect, test } from 'bun:test';
import { BinarySearch } from './BinarySearch.js';

describe('BinarySearch [0, 2, 4, 6, 8]', () => {
  const nums = [0, 2, 4, 6, 8];
  describe('Exact Index', () => {
    test(' 0', () => expect(BinarySearch(nums, 0)).toBe(0));
    test(' 2', () => expect(BinarySearch(nums, 2)).toBe(1));
    test(' 4', () => expect(BinarySearch(nums, 4)).toBe(2));
    test(' 6', () => expect(BinarySearch(nums, 6)).toBe(3));
    test(' 8', () => expect(BinarySearch(nums, 8)).toBe(4));
    //
    test('-1', () => expect(BinarySearch(nums, -1)).toBe(-1));
    test(' 1', () => expect(BinarySearch(nums, 1)).toBe(-1));
    test(' 3', () => expect(BinarySearch(nums, 3)).toBe(-1));
    test(' 5', () => expect(BinarySearch(nums, 5)).toBe(-1));
    test(' 7', () => expect(BinarySearch(nums, 7)).toBe(-1));
    test(' 9', () => expect(BinarySearch(nums, 9)).toBe(-1));
  });
  describe('Insertion Index', () => {
    test(' 0', () => expect(BinarySearch.Insertion(nums, 0)).toBe(0));
    test(' 2', () => expect(BinarySearch.Insertion(nums, 2)).toBe(1));
    test(' 4', () => expect(BinarySearch.Insertion(nums, 4)).toBe(2));
    test(' 6', () => expect(BinarySearch.Insertion(nums, 6)).toBe(3));
    test(' 8', () => expect(BinarySearch.Insertion(nums, 8)).toBe(4));
    //
    test('-1', () => expect(BinarySearch.Insertion(nums, -1)).toBe(-1));
    test(' 1', () => expect(BinarySearch.Insertion(nums, 1)).toBe(0));
    test(' 3', () => expect(BinarySearch.Insertion(nums, 3)).toBe(1));
    test(' 5', () => expect(BinarySearch.Insertion(nums, 5)).toBe(2));
    test(' 7', () => expect(BinarySearch.Insertion(nums, 7)).toBe(3));
    test(' 9', () => expect(BinarySearch.Insertion(nums, 9)).toBe(4));
  });
});

describe('BinarySearch [3, 6, 9]', () => {
  const nums = [3, 6, 9];
  describe('Exact Index', () => {
    test('-3', () => expect(BinarySearch(nums, -3)).toBe(-1));
    test('-2', () => expect(BinarySearch(nums, -2)).toBe(-1));
    test('-1', () => expect(BinarySearch(nums, -1)).toBe(-1));
    test(' 0', () => expect(BinarySearch(nums, 0)).toBe(-1));
    test(' 1', () => expect(BinarySearch(nums, 1)).toBe(-1));
    test(' 2', () => expect(BinarySearch(nums, 2)).toBe(-1));
    // 3
    test(' 4', () => expect(BinarySearch(nums, 4)).toBe(-1));
    test(' 5', () => expect(BinarySearch(nums, 5)).toBe(-1));
    // 6
    test(' 7', () => expect(BinarySearch(nums, 7)).toBe(-1));
    test(' 8', () => expect(BinarySearch(nums, 8)).toBe(-1));
    // 9
    test('10', () => expect(BinarySearch(nums, 10)).toBe(-1));
    test('11', () => expect(BinarySearch(nums, 11)).toBe(-1));
    test('12', () => expect(BinarySearch(nums, 12)).toBe(-1));
  });
  describe('Insertion Index', () => {
    test('-3', () => expect(BinarySearch.Insertion(nums, -3)).toBe(-1));
    test('-2', () => expect(BinarySearch.Insertion(nums, -2)).toBe(-1));
    test('-1', () => expect(BinarySearch.Insertion(nums, -1)).toBe(-1));
    //
    test(' 0', () => expect(BinarySearch.Insertion(nums, 0)).toBe(-1));
    test(' 1', () => expect(BinarySearch.Insertion(nums, 1)).toBe(-1));
    test(' 2', () => expect(BinarySearch.Insertion(nums, 2)).toBe(-1));
    // 3
    test(' 4', () => expect(BinarySearch.Insertion(nums, 4)).toBe(0));
    test(' 5', () => expect(BinarySearch.Insertion(nums, 5)).toBe(0));
    // 6
    test(' 7', () => expect(BinarySearch.Insertion(nums, 7)).toBe(1));
    test(' 8', () => expect(BinarySearch.Insertion(nums, 8)).toBe(1));
    // 9
    test('10', () => expect(BinarySearch.Insertion(nums, 10)).toBe(2));
    test('11', () => expect(BinarySearch.Insertion(nums, 11)).toBe(2));
    test('12', () => expect(BinarySearch.Insertion(nums, 12)).toBe(2));
  });
});

// # Test case 1
// nums = [-1,0,3,5,9,12]
// target = 9
// expected_output = 4
// assert Solution().search(nums, target) == expected_output

// # Test case 2
// nums = [-1,0,3,5,9,12]
// target = 12
// expected_output = 5
// assert Solution().search(nums, target) == expected_output

// # Test case 3
// nums = [-1,0,3,5,9,12]
// target = -1
// expected_output = 0
// assert Solution().search(nums, target) == expected_output

// # Test case 4
// nums = [-1,0,3,5,9,12]
// target = 4
// expected_output = -1
// assert Solution().search(nums, target) == expected_output

// # Test case 5
// nums = [-1,0,3,5,9,12]
// target = 6
// expected_output = -1
// assert Solution().search(nums, target) == expected_output
