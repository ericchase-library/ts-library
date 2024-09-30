import { ChainedHandlerCaller } from '../../Design Pattern/Chain of Responsibility/ChainedHandler.js';
import { Sleep } from '../../Utility/Sleep.js';

export class StdinReader {
  $decoder;
  $handler_caller = new ChainedHandlerCaller();
  $listener;
  constructor($decoder) {
    this.$decoder = $decoder;
    this.$listener = async (bytes) => {
      const value = this.$decoder ? this.$decoder(bytes) : bytes;
      await this.$handler_caller.call(value);
    };
  }
  addHandler(handler) {
    this.$handler_caller.add(handler);
  }
  removeHandler(handler) {
    this.$handler_caller.remove(handler);
  }
  reset() {
    this.$handler_caller.clear();
  }
  async start() {
    process.stdin.addListener('data', this.$listener).resume();
    await Sleep(0);
  }
  async stop() {
    process.stdin.pause().removeListener('data', this.$listener);
    await Sleep(0);
  }
}

export class StdinByteReader extends StdinReader {}

export class StdinTextReader extends StdinReader {
  $textDecoder = new TextDecoder();
  constructor() {
    super((data) => this.$textDecoder.decode(data));
  }
}

export class StdinRawModeReader extends StdinReader {
  $is_raw_mode = false;
  $textDecoder = new TextDecoder();
  constructor() {
    super((data) => this.$textDecoder.decode(data));
  }
  async start() {
    if (this.$is_raw_mode === false) {
      process.stdin.setRawMode(true).addListener('data', this.$listener).resume();
      await Sleep(0);
      this.$is_raw_mode = true;
    }
  }
  async stop() {
    if (this.$is_raw_mode === true) {
      process.stdin.pause().removeListener('data', this.$listener).setRawMode(false);
      await Sleep(0);
      this.$is_raw_mode = false;
    }
  }
}
