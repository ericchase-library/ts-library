import { Store } from '../Design Pattern/Observer/Store.js';
import { ConsoleLog } from './Console.js';

export class JobQueue {
  delay_ms;
  constructor(delay_ms) {
    this.delay_ms = delay_ms;
  }
  async abort() {
    this.aborted = true;
    await this.done;
  }
  add(fn, tag) {
    if (this.aborted === false) {
      this.queue.push({ fn, tag });
      if (this.running === false) {
        this.running = true;
        this.run();
      }
    }
  }
  get done() {
    return new Promise((resolve) => {
      this.runningCount.subscribe((count) => {
        if (count === 0) resolve();
      });
    });
  }
  async reset() {
    if (this.running === true || (await this.runningCount.get()) > 0) {
      throw 'Warning: Wait for running jobs to finish before calling reset. `await JobQueue.done;`';
    }
    this.aborted = false;
    this.completionCount = 0;
    this.queue.length = 0;
    this.queueIndex = 0;
    this.results.length = 0;
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    for (const result of this.results) {
      if (callback(result.value, result.error)?.abort === true) {
        this.subscriptionSet.delete(callback);
        return () => {};
      }
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  aborted = false;
  completionCount = 0;
  queue = [];
  queueIndex = 0;
  results = [];
  running = false;
  runningCount = new Store(0);
  subscriptionSet = new Set();
  run() {
    if (this.aborted === false && this.queueIndex < this.queue.length) {
      const { fn, tag } = this.queue[this.queueIndex++];
      (async () => {
        this.runningCount.update((count) => {
          return count + 1;
        });
        try {
          const value = await fn();
          this.send({ value, tag });
        } catch (error) {
          ConsoleLog(error);
          this.send({ error, tag });
        }
        this.runningCount.update((count) => {
          return count - 1;
        });
        if (this.delay_ms < 0) {
          this.run();
        }
      })();
      if (this.delay_ms >= 0) {
        setTimeout(() => this.run(), this.delay_ms);
      }
    } else {
      this.running = false;
    }
  }
  send(result) {
    if (this.aborted === false) {
      this.completionCount++;
      this.results.push(result);
      for (const callback of this.subscriptionSet) {
        if (callback(result.value, result.error, result.tag)?.abort === true) {
          this.subscriptionSet.delete(callback);
        }
      }
    }
  }
}
new JobQueue(0);
