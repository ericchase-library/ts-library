export class Const {
  value;
  subscriptionSet = new Set();
  constructor(value) {
    this.value = value;
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    if (this.value !== undefined) {
      callback(this.value, () => {
        this.subscriptionSet.delete(callback);
      });
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  get() {
    return new Promise((resolve) => {
      this.subscribe((value, unsubscribe) => {
        unsubscribe();
        resolve(value);
      });
    });
  }
  set(value) {
    if (this.value === undefined) {
      this.value = value;
      for (const callback of this.subscriptionSet) {
        callback(value, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}

export class Store {
  initialValue;
  notifyOnChangeOnly;
  currentValue;
  subscriptionSet = new Set();
  constructor(initialValue, notifyOnChangeOnly = false) {
    this.initialValue = initialValue;
    this.notifyOnChangeOnly = notifyOnChangeOnly;
    this.currentValue = initialValue;
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    const unsubscribe = () => {
      this.subscriptionSet.delete(callback);
    };
    callback(this.currentValue, unsubscribe);
    return unsubscribe;
  }
  get() {
    return new Promise((resolve) => {
      this.subscribe((value, unsubscribe) => {
        unsubscribe();
        resolve(value);
      });
    });
  }
  set(value) {
    if (this.notifyOnChangeOnly && this.currentValue === value) return;
    this.currentValue = value;
    for (const callback of this.subscriptionSet) {
      callback(value, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
  update(callback) {
    this.set(callback(this.currentValue));
  }
}

export class Optional {
  store;
  constructor(notifyOnChangeOnly = false) {
    this.store = new Store(undefined, notifyOnChangeOnly);
  }
  subscribe(callback) {
    return this.store.subscribe(callback);
  }
  get() {
    return new Promise((resolve) => {
      this.subscribe((value, unsubscribe) => {
        unsubscribe();
        resolve(value);
      });
    });
  }
  set(value) {
    this.store.set(value);
  }
  update(callback) {
    this.store.update(callback);
  }
}
export function CompoundSubscription(stores, callback) {
  const unsubs = [];
  const unsubscribe = () => {
    for (const unsub of unsubs) {
      unsub();
    }
  };
  const values = [];
  const callback_handler = () => {
    if (values.length === stores.length) {
      callback(values, unsubscribe);
    }
  };
  for (let i = 0; i < stores.length; i++) {
    stores[i].subscribe((value, unsubscribe) => {
      values[i] = value;
      unsubs[i] = unsubscribe;
      if (values.length === stores.length) {
        callback_handler();
      }
    });
  }
  return unsubscribe;
}
