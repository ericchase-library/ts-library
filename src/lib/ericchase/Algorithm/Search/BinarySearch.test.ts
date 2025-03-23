import { describe, expect, test } from 'bun:test';
import { BinarySearch } from './BinarySearch.js';

const nums = [-1, 0, 3, 5, 9, 12];
describe('BinarySearch', () => {
  describe('Exact Index', () => {
    test('-2', () => expect(BinarySearch(nums, -2)).toBe(-1));
    test('-1', () => expect(BinarySearch(nums, -1)).toBe(0));
    test(' 4', () => expect(BinarySearch(nums, 4)).toBe(-1));
    test(' 6', () => expect(BinarySearch(nums, 6)).toBe(-1));
    test(' 9', () => expect(BinarySearch(nums, 9)).toBe(4));
    test('12', () => expect(BinarySearch(nums, 12)).toBe(5));
    test('13', () => expect(BinarySearch(nums, 13)).toBe(-1));
  });
  describe('Insertion Index', () => {
    test('-2', () => expect(BinarySearch.Insertion(nums, -2)).toBe(-1));
    test('-1', () => expect(BinarySearch.Insertion(nums, -1)).toBe(0));
    test(' 4', () => expect(BinarySearch.Insertion(nums, 4)).toBe(3));
    test(' 6', () => expect(BinarySearch.Insertion(nums, 6)).toBe(4));
    test(' 9', () => expect(BinarySearch.Insertion(nums, 9)).toBe(4));
    test('12', () => expect(BinarySearch.Insertion(nums, 12)).toBe(5));
    test('13', () => expect(BinarySearch.Insertion(nums, 13)).toBe(6));
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
