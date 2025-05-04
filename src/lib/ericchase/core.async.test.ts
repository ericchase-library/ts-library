import { describe, expect, test } from 'bun:test';
import { Core } from './core.js';

describe('Utility', () => {
  describe(Core.Utility.Debounce.name, async () => {
    test('Sync - Consecutive Awaits', async () => {
      let value = 0;
      const fn = Core.Utility.Debounce(() => value++, 5);
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
      const fn = Core.Utility.Debounce(() => value++, 5);
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      await fn();
      expect(value).toBe(1);
      await Bun.sleep(50);
      expect(value).toBe(1);
    });
    test('Sync - Consecutive Calls no Await', async () => {
      let value = 0;
      const fn = Core.Utility.Debounce(() => value++, 5);
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      await Bun.sleep(50);
      expect(value).toBe(1);
    });
    test('Async - Consecutive Awaits', async () => {
      let value = 0;
      const fn = Core.Utility.Debounce(async () => {
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
      const fn = Core.Utility.Debounce(async () => {
        await Bun.sleep(5);
        value++;
      }, 5);
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      await fn();
      expect(value).toBe(1);
      await Bun.sleep(50);
      expect(value).toBe(1);
    });
    test('Async - Consecutive Calls no Await', async () => {
      let value = 0;
      const fn = Core.Utility.Debounce(async () => {
        await Bun.sleep(5);
        value++;
      }, 5);
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      fn();
      expect(value).toBe(0);
      await Bun.sleep(50);
      expect(value).toBe(1);
    });
  });
  describe(Core.Utility.ImmediateDebounce.name, () => {
    test('Sync - Consecutive Awaits', async () => {
      let value = 0;
      const fn = Core.Utility.ImmediateDebounce(() => value++, 5);
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
      const fn = Core.Utility.ImmediateDebounce(() => value++, 5);
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
    });
    test('Sync - Consecutive Calls no Await', async () => {
      let value = 0;
      const fn = Core.Utility.ImmediateDebounce(() => value++, 5);
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
    });
    test('Async - Consecutive Awaits', async () => {
      let value = 0;
      const fn = Core.Utility.ImmediateDebounce(async () => {
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
      const fn = Core.Utility.ImmediateDebounce(async () => {
        await Bun.sleep(5);
        value++;
      }, 5);
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
    });
    test('Async - Consecutive Calls no Await', async () => {
      let value = 0;
      const fn = Core.Utility.ImmediateDebounce(async () => {
        await Bun.sleep(5);
        value++;
      }, 5);
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
    });
  });
});
