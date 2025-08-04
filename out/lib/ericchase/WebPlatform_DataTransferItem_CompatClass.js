export class Class_WebPlatform_DataTransferItem_CompatClass {
  item;
  constructor(item) {
    this.item = item;
  }
  getAsEntry() {
    if (this.item.kind === "file") {
      return this.item.getAsEntry?.() ?? this.item.webkitGetAsEntry?.() ?? undefined;
    }
  }
  getAsFile() {
    if (this.item.kind === "file") {
      return this.item.getAsFile?.() ?? undefined;
    }
  }
  getAsString(callback) {
    if (this.item.kind === "string") {
      this.item.getAsString?.(callback);
    }
  }
}
export function WebPlatform_DataTransferItem_CompatClass(item) {
  return new Class_WebPlatform_DataTransferItem_CompatClass(item);
}
