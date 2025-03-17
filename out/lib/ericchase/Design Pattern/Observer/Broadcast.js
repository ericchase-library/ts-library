export class Broadcast {
  subscriptionSet = new Set;
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  wait(untilValue) {
    return new Promise((resolve) => {
      this.subscribe((value, unsubscribe) => {
        if (value === untilValue) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
  send(value) {
    for (const callback of this.subscriptionSet) {
      callback(value, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
  sendAndWait(value, untilValue) {
    const _ = this.wait(untilValue);
    this.send(value);
    return _;
  }
}
