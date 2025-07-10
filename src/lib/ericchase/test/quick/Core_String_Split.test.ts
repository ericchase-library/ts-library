import { describe, expect, test } from 'bun:test';
import { Core_String_Split } from '../../Core_String_Split.js';
import { Core_String_Split_Lines } from '../../Core_String_Split_Lines.js';
import { Core_String_Split_Multiple_Spaces } from '../../Core_String_Split_Multiple_Spaces.js';
import { Core_String_Split_Multiple_WhiteSpace } from '../../Core_String_Split_Multiple_WhiteSpace.js';

describe(Core_String_Split.name, () => {
  test('Empty', () => {
    expect(Core_String_Split('', '', true)).toEqual([]);
    expect(Core_String_Split('', '', false)).toEqual([]);
  });
  test('On nothing.', () => {
    expect(Core_String_Split('a b c', '', true)).toEqual(['a', ' ', 'b', ' ', 'c']);
    expect(Core_String_Split('a b c', '', false)).toEqual(['a', ' ', 'b', ' ', 'c']);
  });
  test('On spaces.', () => {
    expect(Core_String_Split('a b c', ' ', true)).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split('a b c', ' ', false)).toEqual(['a', 'b', 'c']);
  });
  test('On consecutive spaces.', () => {
    expect(Core_String_Split('a  b  c', ' ', true)).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split('a  b  c', ' ', false)).toEqual(['a', '', 'b', '', 'c']);
  });
  test('On newlines.', () => {
    expect(Core_String_Split('a\nb\nc', '\n', true)).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split('a\nb\nc', '\n', false)).toEqual(['a', 'b', 'c']);
  });
  test('On consecutive newlines.', () => {
    expect(Core_String_Split('a\n\nb\n\nc', '\n', true)).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split('a\n\nb\n\nc', '\n', false)).toEqual(['a', '', 'b', '', 'c']);
  });
  test('On comma.', () => {
    expect(Core_String_Split('a,b,c', ',', true)).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split('a,b,c', ',', false)).toEqual(['a', 'b', 'c']);
  });
});

describe(Core_String_Split_Lines.name, () => {
  test('Empty', () => {
    expect(Core_String_Split_Lines('')).toEqual(['']);
  });
  test('No newlines.', () => {
    expect(Core_String_Split_Lines('abc')).toEqual(['abc']);
  });
  test('Only lines.', () => {
    expect(Core_String_Split_Lines('\n\n\n')).toEqual(['', '', '', '']);
    expect(Core_String_Split_Lines('\n\n\n', true)).toEqual([]);
  });
  test('a/b/c', () => {
    expect(Core_String_Split_Lines('a\nb\nc')).toEqual(['a', 'b', 'c']);
  });
});

describe(Core_String_Split_Multiple_Spaces.name, () => {
  test('Empty', () => {
    expect(Core_String_Split_Multiple_Spaces('')).toEqual(['']);
  });
  test('No spaces.', () => {
    expect(Core_String_Split_Multiple_Spaces('abc')).toEqual(['abc']);
  });
  test('Only spaces.', () => {
    expect(Core_String_Split_Multiple_Spaces('   ')).toEqual(['', '']);
    expect(Core_String_Split_Multiple_Spaces('   ', true)).toEqual([]);
  });
  test('a/b/c', () => {
    expect(Core_String_Split_Multiple_Spaces('a b c')).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split_Multiple_Spaces('a  b  c')).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split_Multiple_Spaces('a   b   c')).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split_Multiple_Spaces(' a b c ')).toEqual(['', 'a', 'b', 'c', '']);
    expect(Core_String_Split_Multiple_Spaces(' a b c ', true)).toEqual(['a', 'b', 'c']);
  });
});

describe(Core_String_Split_Multiple_WhiteSpace.name, () => {
  test('Empty', () => {
    expect(Core_String_Split_Multiple_WhiteSpace('')).toEqual(['']);
  });
  test('No whitespace.', () => {
    expect(Core_String_Split_Multiple_WhiteSpace('abc')).toEqual(['abc']);
  });
  test('Only whitespace.', () => {
    expect(Core_String_Split_Multiple_WhiteSpace(' \t\n \t \n  ')).toEqual(['', '']);
    expect(Core_String_Split_Multiple_WhiteSpace(' \t\n \t \n  ', true)).toEqual([]);
  });
  test('a/b/c', () => {
    expect(Core_String_Split_Multiple_WhiteSpace('a \t b \n c')).toEqual(['a', 'b', 'c']);
    expect(Core_String_Split_Multiple_WhiteSpace(' \t a \t b \n c \n')).toEqual(['', 'a', 'b', 'c', '']);
    expect(Core_String_Split_Multiple_WhiteSpace(' \t a \t b \n c \n', true)).toEqual(['a', 'b', 'c']);
  });
});
