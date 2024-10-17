import { describe, expect, test } from 'bun:test';

import { levenshtein_distance } from './LevenshteinDistance.js';

describe('LevenshteinDistance', () => {
  test('0', () => {
    expect(levenshtein_distance('', '')).toBe(0);
    expect(levenshtein_distance('Different', 'Different')).toBe(0);
    expect(levenshtein_distance('sane', 'sane')).toBe(0);
  });

  test('1', () => {
    const a = 'a';
    const b = 'ab';
    expect(levenshtein_distance(a, b)).toBe(1);
    expect(levenshtein_distance(b, a)).toBe(1);
    expect(levenshtein_distance('', 'ŵ')).toBe(1);
    expect(levenshtein_distance('A', '')).toBe(1);
    expect(levenshtein_distance('A', 'Z')).toBe(1);
  });
  test('2', () => {
    expect(levenshtein_distance('atomic', 'atom')).toBe(2);
    expect(levenshtein_distance('flaw', 'lawn')).toBe(2);
    expect(levenshtein_distance('object', 'inject')).toBe(2);
  });
  test('3', () => {
    expect(levenshtein_distance('attaca', 'tataa')).toBe(3);
    expect(levenshtein_distance('gattaca', 'tataa')).toBe(3);
  });
  test('6', () => {
    expect(levenshtein_distance('Java', 'JavaScript')).toBe(6);
  });
  test('7', () => {
    expect(levenshtein_distance('bullfrog', 'frogger')).toBe(7);
  });
});
