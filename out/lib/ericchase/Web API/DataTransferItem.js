import { HasMethod } from "../Utility/Guard.js";
export function Compat_DataTransferItem(item) {
  return {
    getAsEntry() {
      if (HasMethod(item, "getAsEntry")) {
        return item.getAsEntry() ?? undefined;
      }
      if (HasMethod(item, "webkitGetAsEntry")) {
        return item.webkitGetAsEntry() ?? undefined;
      }
    },
    getAsFile() {
      if (HasMethod(item, "getAsFile")) {
        return item.getAsFile() ?? undefined;
      }
    },
    getAsString() {
      if (HasMethod(item, "getAsString")) {
        return new Promise((resolve, reject) => {
          try {
            item.getAsString(resolve);
          } catch (error) {
            reject(error);
          }
        });
      }
      return Promise.resolve(undefined);
    }
  };
}
