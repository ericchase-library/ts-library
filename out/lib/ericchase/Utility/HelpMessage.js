import { ConsoleError } from "./Console.js";
import { ImmediateDebounce } from "./Debounce.js";

export class HelpMessage {
  message;
  print;
  constructor(message) {
    this.message = message;
    this.print = ImmediateDebounce(() => {
      ConsoleError(this.message);
    }, 500);
  }
}
