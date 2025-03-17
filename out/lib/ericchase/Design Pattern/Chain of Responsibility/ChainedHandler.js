import { HandlerCaller } from "src/lib/ericchase/Design Pattern/Handler.js";

export class ChainedHandlerCaller extends HandlerCaller {
  async call(request, actions) {
    let abort = false;
    for (const handler of this) {
      await handler(request, {
        ...actions,
        removeSelf: () => this.remove(handler),
        stopHandlerChain: () => {
          abort = true;
        }
      });
      if (abort !== false) {
        break;
      }
    }
  }
}
