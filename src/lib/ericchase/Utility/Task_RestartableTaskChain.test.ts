import { describe, expect, test } from 'bun:test';
import { Sleep } from './Sleep.js';
import { RestartableTaskChain } from './Task_RestartableTaskChain.js';

describe('start', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { start } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
});

describe('restart', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      restart();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('2', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      restart();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('3', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
    test('4', async () => {
      let value = 0;
      const { restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(3);
    });
  });
});

describe('abort', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('2', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('3', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('4', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('2', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('3', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('4', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('2', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('3', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
    test('4', async () => {
      let value = 0;
      const { abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
      await Sleep(0);
      expect(value).toBe(0);
    });
  });
});

describe('start restart', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // await onEnd
      // task 1 sleep
      expect(value).toBe(1);
      await Sleep(0);
      // task 1 finishes
      // onEnd finishes
      // task 2 sleep
      expect(value).toBe(2);
      await Sleep(0);
      // task 2 finishes
      // task 3 sleep
      expect(value).toBe(3);
      await Sleep(0);
      // task 3 finishes
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // await onEnd
      // task 1 sleep
      expect(value).toBe(11);
      await Sleep(0);
      // task 1 finishes
      // onEnd finishes
      // task 2 sleep
      expect(value).toBe(12);
      await Sleep(0);
      // task 2 finishes
      // task 3 sleep
      expect(value).toBe(13);
      await Sleep(0);
      // task 3 finishes
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // await onEnd
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      // task 1 sleep
      expect(value).toBe(101);
      await Sleep(0);
      // task 1 finishes
      // task 2 sleep
      expect(value).toBe(102);
      await Sleep(0);
      // task 2 finishes
      // task 3 sleep
      expect(value).toBe(103);
      await Sleep(0);
      // task 3 finishes
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // await onAbort
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // await onEnd
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      // task 1 sleep
      expect(value).toBe(111);
      await Sleep(0);
      // task 1 finishes
      // task 2 sleep
      expect(value).toBe(112);
      await Sleep(0);
      // task 2 finishes
      // task 3 sleep
      expect(value).toBe(113);
      await Sleep(0);
      // task 3 finishes
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
});

describe('start abort', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
});

describe('restart abort', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
});

describe('start restart abort', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(11);
      abort();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // await onAbort
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
});

describe('start abort start', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      start();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      start();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      start();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      start();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      start();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      expect(value).toBe(0);
      start();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(1);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      start();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(11);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // await onAbort
      expect(value).toBe(0);
      start();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(101);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      start();
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(111);
    });
  });
});

describe('start abort restart', () => {
  describe('sync', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        () => {
          value++;
        },
        () => {
          value++;
        },
        () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          () => {
            value++;
          },
          () => {
            value++;
          },
          () => {
            value++;
          },
        ],
        {
          onAbort() {
            value += 10;
          },
          onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
  describe('empty async', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          value++;
        },
        async () => {
          value++;
        },
        async () => {
          value++;
        },
      ]);
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(1);
      restart();
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            value++;
          },
          async () => {
            value++;
          },
          async () => {
            value++;
          },
        ],
        {
          async onAbort() {
            value += 10;
          },
          async onEnd() {
            value += 100;
          },
        },
      );
      start();
      expect(value).toBe(1);
      abort();
      expect(value).toBe(11);
      restart();
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
  describe('async with await', () => {
    test('1', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain([
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
        async () => {
          await Sleep(0);
          value++;
        },
      ]);
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      expect(value).toBe(1);
      await Sleep(0);
      expect(value).toBe(2);
      await Sleep(0);
      expect(value).toBe(3);
      await Sleep(0);
      expect(value).toBe(4);
      await Sleep(0);
      expect(value).toBe(4);
    });
    test('2', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      expect(value).toBe(11);
      await Sleep(0);
      expect(value).toBe(12);
      await Sleep(0);
      expect(value).toBe(13);
      await Sleep(0);
      expect(value).toBe(14);
      await Sleep(0);
      expect(value).toBe(14);
    });
    test('3', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // await onAbort
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onEnd sleep
      expect(value).toBe(1);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(101);
      await Sleep(0);
      expect(value).toBe(102);
      await Sleep(0);
      expect(value).toBe(103);
      await Sleep(0);
      expect(value).toBe(104);
      await Sleep(0);
      expect(value).toBe(104);
    });
    test('4', async () => {
      let value = 0;
      const { start, restart, abort } = RestartableTaskChain(
        [
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
          async () => {
            await Sleep(0);
            value++;
          },
        ],
        {
          async onAbort() {
            await Sleep(0);
            value += 10;
          },
          async onEnd() {
            await Sleep(0);
            value += 100;
          },
        },
      );
      start();
      // task 1 sleep
      expect(value).toBe(0);
      abort();
      // onAbort sleep
      expect(value).toBe(0);
      restart();
      // task 1 sleep
      expect(value).toBe(0);
      await Sleep(0);
      // task 1 finishes
      // onAbort finishes
      // onEnd sleep
      expect(value).toBe(11);
      await Sleep(0);
      // onEnd finishes
      expect(value).toBe(111);
      await Sleep(0);
      expect(value).toBe(112);
      await Sleep(0);
      expect(value).toBe(113);
      await Sleep(0);
      expect(value).toBe(114);
      await Sleep(0);
      expect(value).toBe(114);
    });
  });
});
