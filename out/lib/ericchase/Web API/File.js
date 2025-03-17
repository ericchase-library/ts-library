import { HasProperty } from "src/lib/ericchase/Utility/Guard.js";
export function Compat_File(file) {
  return {
    get lastModified() {
      return HasProperty(file, "lastModified") ? file.lastModified : undefined;
    },
    get name() {
      return HasProperty(file, "name") ? file.name : undefined;
    },
    get webkitRelativePath() {
      return HasProperty(file, "webkitRelativePath") ? file.webkitRelativePath : undefined;
    }
  };
}
