import { describe, expect, test } from 'bun:test';

describe('Canary', () => {
  test('true === true', () => {
    expect(true).toBeTrue();
  });
  test('throw error', () => {
    expect(() => {
      throw new Error();
    }).toThrowError();
  });
});

// describe('Error Cases', () => {
//   if (process.platform === 'win32') {
//     describe('Win32', () => {});
//   } else {
//     describe('Posix', () => {});
//   }
// });
