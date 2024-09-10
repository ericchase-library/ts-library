export class LazyTask {
  fn;
  results;
  constructor(fn) {
    this.fn = fn;
  }
  get get() {
    if (!this.results) {
      this.results = this.fn();
    }
    return this.results;
  }
}
