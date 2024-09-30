import { Once, OptionalStore, Store } from '../Design Pattern/Observer/Store.js';

export class Debouncer {
  fn;
  delay;
  queueStrategy;
  constructor(
    fn,
    delay = 250,
    queueStrategy = (inputs) => {
      return inputs.filter((_) => _).at(-1);
    },
  ) {
    this.fn = fn;
    this.delay = delay;
    this.queueStrategy = queueStrategy;
  }
  async run(input) {
    if ((await this.running.get()) === false) {
      this.currentQueue.push(input);
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.timeout(), this.delay)[Symbol.toPrimitive]();
    } else {
      this.nextQueue.push(input);
      await Once(this.running);
    }
    return Once(this.store);
  }
  subscribe(callback) {
    this.store.subscribe(callback);
  }
  running = new Store(false, true);
  store = new OptionalStore();
  timer = undefined;
  currentQueue = [];
  nextQueue = [];
  async timeout() {
    this.running.set(true);
    this.store.set(await this.fn(this.queueStrategy(this.currentQueue)));
    this.running.set(false);
    this.currentQueue = this.nextQueue;
    this.nextQueue.length = 0;
    if (this.currentQueue.length > 0) {
      this.timer = setTimeout(() => this.timeout(), this.delay)[Symbol.toPrimitive]();
    }
  }
}
