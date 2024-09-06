import { Store } from '../Design Pattern/Observer/Store.js';

export type SubscriptionCallback<Result, Tag> = (result?: Result, error?: Error, tag?: Tag) => { abort: boolean } | void;

export class JobQueue<Result = void, Tag = void> {
  /**
   * 0: No delay. -1: Consecutive.
   */
  constructor(public delay_ms: number) {}
  public abort() {
    this._aborted = true;
  }
  public get aborted() {
    return this._aborted;
  }
  public add(fn: () => Promise<Result>, tag?: Tag) {
    if (this._aborted === false) {
      this.queue.push({ fn, tag });
      if (this.running === false) {
        this.running = true;
        this.run();
      }
    }
  }
  public get done() {
    return this.completionCount === this.queue.length ? true : false;
  }
  public reset() {
    return new Promise<void>((resolve) => {
      this.runningCount.subscribe(() => {
        this._aborted = false;
        this.completionCount = 0;
        this.queue = [];
        this.queueIndex = 0;
        this.results = [];
        this.running = false;
        resolve();
      });
    });
  }
  public subscribe(callback: SubscriptionCallback<Result, Tag>): () => void {
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
  protected _aborted = false;
  protected completionCount = 0;
  protected queue: { fn: () => Promise<Result>; tag?: Tag }[] = [];
  protected queueIndex = 0;
  protected results: { value?: Result; error?: Error }[] = [];
  protected running = false;
  protected runningCount = new Store(0);
  protected subscriptionSet = new Set<SubscriptionCallback<Result, Tag>>();
  protected run() {
    if (this._aborted === false && this.queueIndex < this.queue.length) {
      const { fn, tag } = this.queue[this.queueIndex++];
      (async () => {
        this.runningCount.update((count) => count + 1);
        try {
          const value = await fn();
          this.send({ value, tag });
        } catch (error: any) {
          this.send({ error, tag });
        }
        this.runningCount.update((count) => count - 1);
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
  protected send(result: { value?: Result; error?: Error; tag?: Tag }) {
    if (this._aborted === false) {
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
