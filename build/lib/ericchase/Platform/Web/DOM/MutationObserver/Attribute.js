export class AttributeObserver {
  constructor({ source = document.documentElement, options = { attributeOldValue: true, subtree: true } }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(source, {
      attributes: true,
      attributeFilter: options.attributeFilter,
      attributeOldValue: options.attributeOldValue ?? true,
      subtree: options.subtree ?? true,
    });
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  subscriptionSet = new Set();
  send(record) {
    for (const callback of this.subscriptionSet) {
      callback(record, () => {
        this.subscriptionSet.delete(callback);
      });
    }
  }
}
