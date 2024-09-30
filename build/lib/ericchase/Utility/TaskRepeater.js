export class TaskRepeater {
  $result;
  $running = false;
  $executor;
  constructor(task, interval_ms, keep_script_running_while_repeater_is_running = true) {
    if (keep_script_running_while_repeater_is_running) {
      this.$executor = async () => {
        if (this.$running === true) {
          this.$result = await task();
          setTimeout(this.$executor, interval_ms).ref();
        }
      };
    } else {
      this.$executor = async () => {
        if (this.$running === true) {
          this.$result = await task();
          setTimeout(this.$executor, interval_ms).unref();
        }
      };
    }
  }
  get result() {
    return this.$result;
  }
  start() {
    if (this.$running === false) {
      this.$running = true;
      this.$executor();
    }
  }
  stop() {
    this.$running = false;
  }
}
