import { describe, expect, test } from 'bun:test';

import { nChooseRPermutations } from '../Algorithm/Math/Combinatorics.js';
import { GetLeftMarginSize, LineIsOnlyWhiteSpace, RemoveWhiteSpaceOnlyLinesFromTopAndBottom, Split, SplitLines, SplitMultipleSpaces, SplitMultipleWhiteSpace, ToSnakeCase, TrimLines } from './String.js';

describe(GetLeftMarginSize.name, () => {
  test('Empty', () => {
    expect(GetLeftMarginSize('')).toBe(0);
  });
  test('0', () => {
    expect(GetLeftMarginSize('0')).toBe(0);
  });
  test('1', () => {
    expect(GetLeftMarginSize(' 1')).toBe(1);
  });
  test('2', () => {
    expect(GetLeftMarginSize('  2')).toBe(2);
  });
  test('3', () => {
    expect(GetLeftMarginSize('   3')).toBe(3);
  });
});

describe(LineIsOnlyWhiteSpace.name, () => {
  test('Empty', () => {
    expect(LineIsOnlyWhiteSpace('')).toBeTrue();
  });
  test('Space, Tab, Newline', () => {
    for (const ch of ' \t\n') {
      expect(LineIsOnlyWhiteSpace(ch)).toBeTrue();
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n'], 2)]) {
      expect(LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n'], 3)]) {
      expect(LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 3)]) {
      expect(LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 6)]) {
      expect(LineIsOnlyWhiteSpace(permu.join(''))).toBeTrue();
    }
  });
  test('Characters', () => {
    for (const ch of `abc123,./<>?;':"[]{}\\|!@#$%^&*()-=_+\`~`) {
      expect(LineIsOnlyWhiteSpace(ch)).toBeFalse();
    }
  });
});

describe(RemoveWhiteSpaceOnlyLinesFromTopAndBottom.name, () => {
  test('Empty', () => {
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom('')).toEqual([]);
  });
  test('Whitespace only lines.', () => {
    for (const ch of ' \t\n') {
      expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(ch)).toEqual([]);
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n'], 2)]) {
      expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n'], 3)]) {
      expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 3)]) {
      expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
    }
    for (const permu of [...nChooseRPermutations([' ', '\t', '\n', ' ', '\t', '\n'], 6)]) {
      expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(permu.join(''))).toEqual([]);
    }
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\n\n\n')).toEqual([]);
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \n \n \n ')).toEqual([]);
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \t\n\t \t\n \n ')).toEqual([]);
  });
  test('Text surrounded with whitespace lines.', () => {
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\nasdf\n')).toEqual(['asdf']);
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom(' \nasdf\n ')).toEqual(['asdf']);
    expect(RemoveWhiteSpaceOnlyLinesFromTopAndBottom('\t \nasdf\n \t')).toEqual(['asdf']);
  });
});

describe(Split.name, () => {
  test('Empty', () => {
    expect(Split('', '')).toEqual([]);
  });
  test('On nothing.', () => {
    expect(Split('a b c', '')).toEqual(['a', ' ', 'b', ' ', 'c']);
  });
  test('On spaces.', () => {
    expect(Split('a b c', ' ')).toEqual(['a', 'b', 'c']);
  });
  test('On newlines.', () => {
    expect(Split('a\nb\nc', '\n')).toEqual(['a', 'b', 'c']);
  });
  test('On ,.', () => {
    expect(Split('a,b,c', ',')).toEqual(['a', 'b', 'c']);
  });
});

describe(SplitLines.name, () => {
  test('Empty', () => {
    expect(SplitLines('')).toEqual(['']);
  });
  test('No newlines.', () => {
    expect(SplitLines('abc')).toEqual(['abc']);
  });
  test('Only lines.', () => {
    expect(SplitLines('\n\n\n')).toEqual(['', '', '', '']);
  });
  test('a/b/c', () => {
    expect(SplitLines('a\nb\nc')).toEqual(['a', 'b', 'c']);
  });
});

describe(SplitMultipleSpaces.name, () => {
  test('Empty', () => {
    expect(SplitMultipleSpaces('')).toEqual(['']);
  });
  test('No spaces.', () => {
    expect(SplitMultipleSpaces('abc')).toEqual(['abc']);
  });
  test('Only spaces.', () => {
    expect(SplitMultipleSpaces('   ')).toEqual(['', '']);
  });
  test('a/b/c', () => {
    expect(SplitMultipleSpaces('a b c')).toEqual(['a', 'b', 'c']);
  });
});

describe(SplitMultipleWhiteSpace.name, () => {
  test('Empty', () => {
    expect(SplitMultipleWhiteSpace('')).toEqual(['']);
  });
  test('No whitespace.', () => {
    expect(SplitMultipleWhiteSpace('abc')).toEqual(['abc']);
  });
  test('Only whitespace.', () => {
    expect(SplitMultipleWhiteSpace(' \t\n \t \n  ')).toEqual(['', '']);
  });
  test('a/b/c', () => {
    expect(SplitMultipleWhiteSpace('a \t b \n c')).toEqual(['a', 'b', 'c']);
  });
});

describe(ToSnakeCase.name, () => {
  test('Empty', () => {
    expect(ToSnakeCase('')).toBe('');
  });
  test('lowercase word', () => {
    expect(ToSnakeCase('word')).toBe('word');
  });
  test('Uppercase Word', () => {
    expect(ToSnakeCase('Word')).toBe('word');
  });
  test('a sentence.', () => {
    expect(ToSnakeCase('a sentence.')).toBe('a-sentence.');
  });
  test('A sentence.', () => {
    expect(ToSnakeCase('A sentence.')).toBe('a-sentence.');
  });
});

describe(TrimLines.name, () => {
  test('Empty array.', () => {
    expect(TrimLines([])).toEqual([]);
  });
  test('Empty line.', () => {
    expect(TrimLines([''])).toEqual(['']);
  });
  test('Empty lines.', () => {
    expect(TrimLines(['', '', ''])).toEqual(['', '', '']);
  });
  test('No whitespace.', () => {
    expect(TrimLines(['abc'])).toEqual(['abc']);
    expect(TrimLines(['abc', 'abc', 'abc'])).toEqual(['abc', 'abc', 'abc']);
  });
  test('Only whitespace.', () => {
    expect(TrimLines([' \t\n \t \n  ', ' \t\n \t \n  ', ' \t\n \t \n  '])).toEqual(['', '', '']);
  });
  test('a/b/c', () => {
    expect(TrimLines(['a \t b \n c'])).toEqual(['a \t b \n c']);
    expect(TrimLines([' \t a \t b \n c \n '])).toEqual(['a \t b \n c']);
  });
});
