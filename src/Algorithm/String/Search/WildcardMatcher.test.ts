import { describe, expect, test } from 'bun:test';
import { SlidingWindow } from '../../Array/SlidingWindow.js';
import { MatchAny } from './WildcardMatcher.js';

describe(MatchAny.name, () => {
  test("Siler's incorrect algorithm fails this", () => {
    expect(MatchAny('daaadabadmanda', 'da*da*da*')).toBeTrue();
  });
  test('matches any character', () => {
    expect(MatchAny('abcde.ts', 'a*')).toBeTrue();
    expect(MatchAny('abcde.ts', '*s')).toBeTrue();
    for (const char of 'abcde.ts') {
      expect(MatchAny('abcde.ts', `*${char}*`)).toBeTrue();
    }
    for (const window of SlidingWindow([...'abcde.ts'], 2)) {
      expect(MatchAny('abcde.ts', `*${window.slice.join('')}*`)).toBeTrue();
    }
  });
});
