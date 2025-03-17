import { ConsoleError } from "src/lib/ericchase/Utility/Console.js";
import { ImmediateDebounce } from "src/lib/ericchase/Utility/Debounce.js";

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
