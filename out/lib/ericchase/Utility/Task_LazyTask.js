export class LazyTask {
  $task;
  $result;
  constructor($task) {
    this.$task = $task;
  }
  get result() {
    if (!this.$result) {
      this.$result = this.$task();
    }
    return this.$result;
  }
}
