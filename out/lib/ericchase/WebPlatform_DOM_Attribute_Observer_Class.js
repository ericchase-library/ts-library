export class Class_WebPlatform_DOM_Attribute_Observer_Class {
  constructor(config) {
    config.options ??= {};
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        this.send(record);
      }
    });
    this.mutationObserver.observe(config.source ?? document.documentElement, {
      attributes: true,
      attributeFilter: config.options.attributeFilter,
      attributeOldValue: config.options.attributeOldValue ?? true,
      subtree: config.options.subtree ?? true
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
export function WebPlatform_DOM_Attribute_Observer_Class(config) {
  return new Class_WebPlatform_DOM_Attribute_Observer_Class(config);
}
