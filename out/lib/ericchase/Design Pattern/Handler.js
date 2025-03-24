export class HandlerSet {
  $set = new Set;
  add(handler) {
    this.$set.add(handler);
    return () => this.remove(handler);
  }
  clear() {
    this.$set.clear();
  }
  remove(handler) {
    this.$set.delete(handler);
  }
  *[Symbol.iterator]() {
    for (const handler of this.$set) {
      yield handler;
    }
  }
}

export class HandlerCaller extends HandlerSet {
  async call(request, actions) {
    for (const handler of this) {
      await handler(request, {
        ...actions,
        removeSelf: () => this.remove(handler)
      });
    }
  }
}
