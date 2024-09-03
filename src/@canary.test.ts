import { describe, expect, test } from 'bun:test';

describe('Canary', () => {
  test('true=true', () => {
    expect(true).toBeTrue();
  });
  test('true=false should fail', () => {
    expect(true).toBeFalse();
  });
});
