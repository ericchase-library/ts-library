import { HasProperty } from "../Utility/Guard.js";
import { IsDeviceMobile } from "./Device.js";
export function Compat_HTMLInputElement(input) {
  return {
    get webkitEntries() {
      return HasProperty(input, "webkitEntries") ? input.webkitEntries : undefined;
    },
    get webkitdirectory() {
      return HasProperty(input, "webkitdirectory") ? input.webkitdirectory : undefined;
    }
  };
}
export function IsWebkitDirectorySupported() {
  return IsDeviceMobile() ? false : true;
}
