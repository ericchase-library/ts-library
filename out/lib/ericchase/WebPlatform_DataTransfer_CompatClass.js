import { WebPlatform_DataTransferItem_CompatClass } from "./WebPlatform_DataTransferItem_CompatClass.js";

export class Class_WebPlatform_DataTransfer_CompatClass {
  dataTransfer;
  constructor(dataTransfer) {
    this.dataTransfer = dataTransfer;
  }
  items() {
    const list = [];
    for (const item of this.dataTransfer.items) {
      list.push(WebPlatform_DataTransferItem_CompatClass(item));
    }
    return list;
  }
}
export function WebPlatform_DataTransfer_CompatClass(dataTransfer) {
  return new Class_WebPlatform_DataTransfer_CompatClass(dataTransfer);
}
