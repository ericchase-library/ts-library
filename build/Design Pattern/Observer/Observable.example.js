export class Observable {
  notify(data) {
    for (const callback of this.callbackSet) {
      callback(data, () => {
        this.callbackSet.delete(callback);
        if (this.callbackSet.size === 0) {
        }
      });
    }
  }
  observe(callback) {
    this.callbackSet.add(callback);
    if (this.callbackSet.size === 1) {
    }
    return () => {
      this.callbackSet.delete(callback);
      if (this.callbackSet.size === 0) {
      }
    };
  }
  callbackSet = new Set();
}
