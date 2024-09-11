import { describe, expect, test } from 'bun:test';
import { Debouncer } from './Debounce.js';

describe('Debouncer', () => {
  test('Consecutive', async () => {
    let value = 0;
    const runner = new Debouncer(() => {
      value++;
    }, 50);
    expect(value).toBe(0);
    await runner.run();
    expect(value).toBe(1);
    await runner.run();
    await runner.run();
    await runner.run();
    expect(value).toBe(4);
  });
  test('Consecutive', async () => {
    let value = 0;
    const runner = new Debouncer(() => {
      value++;
    }, 250);
    expect(value).toBe(0);
    await runner.run();
    expect(value).toBe(1);
    runner.run();
    runner.run();
    await runner.run();
    expect(value).toBe(2);
  });
});
