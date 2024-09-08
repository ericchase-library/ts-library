import { describe, expect, test } from 'bun:test';

describe('Canary', () => {
  test('true=true', () => {
    expect(true).toBeTrue();
  });
});

describe('!! THIS SHOULD FAIL !!', () => {
  test('true=false should fail', () => {
    expect(true).toBeFalse();
  });
});
