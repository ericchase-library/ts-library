import { ConsoleLog } from '../../Utility/Console.js';

class Store {
  currentValue;
  subscriptionSet = new Set();
  constructor(initialValue) {
    this.currentValue = initialValue;
  }
  subscribe(callback) {
    ConsoleLog('store, subscribe');
    this.subscriptionSet.add(callback);
    callback(this.currentValue);
    return () => {
      ConsoleLog('store, unsubscribe');
      this.subscriptionSet.delete(callback);
    };
  }
  get value() {
    ConsoleLog('store, get');
    return this.currentValue;
  }
  set(value) {
    ConsoleLog('store, set', value);
    if (this.currentValue !== value) {
      this.currentValue = value;
      for (const callback of this.subscriptionSet) {
        callback(value);
      }
    }
  }
  update(callback) {
    ConsoleLog('store, update');
    this.set(callback(this.currentValue));
  }
}

class ComputedStore {
  source;
  computeFn;
  cachedValue;
  subscriptionSet = new Set();
  sourceUnsubscribe = undefined;
  constructor(source, computeFn) {
    this.source = source;
    this.computeFn = computeFn;
  }
  subscribe(callback) {
    ConsoleLog('computed, subscribe');
    if (this.subscriptionSet.size === 0) {
      this.sourceUnsubscribe = this.source.subscribe((value) => {
        const newCachedValue = this.computeFn(value);
        if (this.cachedValue !== newCachedValue) {
          this.cachedValue = newCachedValue;
          for (const callback of this.subscriptionSet) {
            callback(newCachedValue);
          }
        }
      });
    }
    this.subscriptionSet.add(callback);
    if (this.cachedValue) {
      callback(this.cachedValue);
    }
    return () => {
      ConsoleLog('computed, unsubscribe');
      this.subscriptionSet.delete(callback);
      if (this.subscriptionSet.size === 0) {
        this.sourceUnsubscribe?.();
      }
    };
  }
  get value() {
    ConsoleLog('computed, get');
    return this.computeFn(this.source.value);
  }
}
const counter = new Store(0);
ConsoleLog(counter.value);
counter.set(1);
ConsoleLog(counter.value);
const isEven = new ComputedStore(counter, (value) => (value & 1) === 0);
ConsoleLog(isEven.value);
counter.set(2);
ConsoleLog(isEven.value);
const parity = new ComputedStore(isEven, (value) => (value ? 'even' : 'odd'));
counter.set(3);
ConsoleLog(parity.value);
ConsoleLog();
ConsoleLog('the important part');
const parityUnsubscribe = parity.subscribe((value) => ConsoleLog('EFFECT, parity:', value));
ConsoleLog();
counter.set(2);
ConsoleLog('isEven:', isEven.value);
ConsoleLog('parity:', parity.value);
ConsoleLog();
counter.set(4);
ConsoleLog('isEven:', isEven.value);
ConsoleLog('parity:', parity.value);
ConsoleLog('effect is not called because the value of parity did not change');
ConsoleLog();
ConsoleLog('unsubscribe');
parityUnsubscribe();
ConsoleLog('effect will no longer be called, because of unsubscription');
ConsoleLog();
counter.set(5);
ConsoleLog('isEven:', isEven.value);
ConsoleLog('parity:', parity.value);
ConsoleLog();
counter.set(7);
ConsoleLog('isEven:', isEven.value);
ConsoleLog('parity:', parity.value);
ConsoleLog();
counter.set(4);
ConsoleLog('isEven:', isEven.value);
ConsoleLog('parity:', parity.value);
