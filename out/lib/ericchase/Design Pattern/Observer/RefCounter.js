export class RefCounter {
  locks = new Set;
  callbacks = new Set;
  lock() {
    const lock = {};
    this.locks.add(lock);
    return () => {
      if (this.locks.delete(lock) && this.locks.size === 0) {
        for (const callback of this.callbacks) {
          this.callbacks.delete(callback);
          callback();
        }
      }
    };
  }
  onZeroLocks() {
    return new Promise((resolve) => {
      if (this.locks.size > 0) {
        this.callbacks.add(() => resolve());
      } else {
        resolve();
      }
    });
  }
}
