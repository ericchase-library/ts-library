export class ChildListObserver {
  constructor({ source = document.documentElement, options = { subtree: true } }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(source, {
      childList: true,
      subtree: options.subtree ?? true
    });
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  subscriptionSet = new Set;
  send(record) {
    for (const callback of this.subscriptionSet) {
      callback(record, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
}
