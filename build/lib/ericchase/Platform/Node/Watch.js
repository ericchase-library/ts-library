import node_fs from 'node:fs';

export class Watcher {
  debounce_interval;
  constructor(path, debounce_interval = 0, recursive = true) {
    this.debounce_interval = debounce_interval;
    let calling = false;
    let events = [];
    let timer = setTimeout(() => {});
    const enqueue = (event) => {
      events.push(event);
      if (calling === false) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (calling === false) {
            calling = true;
            clearTimeout(timer);
            this.notify(events);
            events = [];
            clearTimeout(timer);
            calling = false;
          }
        }, debounce_interval);
      }
    };
    this.done = (async () => {
      try {
        for await (const event of node_fs.promises.watch(path, {
          recursive,
          signal: this.controller.signal,
        })) {
          enqueue(event);
        }
      } catch (err) {}
    })();
  }
  abort() {
    this.controller.abort();
  }
  observe(callback) {
    this.callbackSet.add(callback);
    return () => {
      this.callbackSet.delete(callback);
    };
  }
  done;
  callbackSet = new Set();
  controller = new AbortController();
  notify(events) {
    for (const callback of this.callbackSet) {
      callback(events, () => {
        this.callbackSet.delete(callback);
      });
    }
  }
}
