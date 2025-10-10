export class Class_WebPlatform_DOM_ChildList_Observer_Class {
  $mutation_observer;
  $subscription_set = new Set();
  constructor(config) {
    config.options ??= {};
    this.$mutation_observer = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.$send(record);
      }
    });
    this.$mutation_observer.observe(config.source ?? document.documentElement, {
      childList: true,
      subtree: config.options.subtree ?? true,
    });
  }
  disconnect() {
    this.$mutation_observer.disconnect();
    for (const callback of this.$subscription_set) {
      this.$subscription_set.delete(callback);
    }
  }
  subscribe(callback) {
    this.$subscription_set.add(callback);
    return () => {
      this.$subscription_set.delete(callback);
    };
  }
  $send(record) {
    for (const callback of this.$subscription_set) {
      callback(record, () => {
        this.$subscription_set.delete(callback);
      });
    }
  }
}
export function WebPlatform_DOM_ChildList_Observer_Class(config) {
  return new Class_WebPlatform_DOM_ChildList_Observer_Class(config);
}
