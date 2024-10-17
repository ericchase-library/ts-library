import { describe, expect, test } from 'bun:test';

import { Debounce, ImmediateDebounce } from './Debounce.js';

describe(Debounce.name, async () => {
  test('Sync - Consecutive Awaits', async () => {
    let value = 0;
    const fn = Debounce(() => value++, 5);
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    await fn();
    expect(value).toBe(3);
    await Bun.sleep(50);
    expect(value).toBe(3);
  });
  test('Sync - Consecutive Calls then Await', async () => {
    let value = 0;
    const fn = Debounce(() => value++, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Sync - Consecutive Calls no Await', async () => {
    let value = 0;
    const fn = Debounce(() => value++, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    await Bun.sleep(50);
    expect(value).toBe(1);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Async - Consecutive Awaits', async () => {
    let value = 0;
    const fn = Debounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    await fn();
    expect(value).toBe(3);
    await Bun.sleep(50);
    expect(value).toBe(3);
  });
  test('Async - Consecutive Calls then Await', async () => {
    let value = 0;
    const fn = Debounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Async - Consecutive Calls no Await', async () => {
    let value = 0;
    const fn = Debounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    await Bun.sleep(50);
    expect(value).toBe(1);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
});

describe(ImmediateDebounce.name, () => {
  test('Sync - Consecutive Awaits', async () => {
    let value = 0;
    const fn = ImmediateDebounce(() => value++, 5);
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
  });
  test('Sync - Consecutive Calls then Await', async () => {
    let value = 0;
    const fn = ImmediateDebounce(() => value++, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(1);
    fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Sync - Consecutive Calls no Await', async () => {
    let value = 0;
    const fn = ImmediateDebounce(() => value++, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(1);
    fn();
    expect(value).toBe(1);
    fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Async - Consecutive Awaits', async () => {
    let value = 0;
    const fn = ImmediateDebounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
  });
  test('Async - Consecutive Calls then Await', async () => {
    let value = 0;
    const fn = ImmediateDebounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0); // not enough time for inner function to complete
    fn();
    expect(value).toBe(0);
    await fn();
    expect(value).toBe(1);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
  test('Async - Consecutive Calls no Await', async () => {
    let value = 0;
    const fn = ImmediateDebounce(async () => {
      await Bun.sleep(5);
      value++;
    }, 5);
    /* eslint-disable @typescript-eslint/no-floating-promises */
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0); // not enough time for inner function to complete
    fn();
    expect(value).toBe(0);
    fn();
    expect(value).toBe(0);
    await Bun.sleep(50);
    expect(value).toBe(1);
    await fn();
    expect(value).toBe(2);
    /* eslint-enable @typescript-eslint/no-floating-promises */
  });
});
