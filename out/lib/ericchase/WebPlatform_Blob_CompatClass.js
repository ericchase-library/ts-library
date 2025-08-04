export class Class_WebPlatform_Blob_CompatClass {
  blob;
  constructor(blob) {
    this.blob = blob;
  }
  get size() {
    return this.blob.size ?? undefined;
  }
  get type() {
    return this.blob.type ?? undefined;
  }
  async arrayBuffer() {
    return await this.blob.arrayBuffer?.() ?? undefined;
  }
  async bytes() {
    return await this.blob.bytes?.() ?? await this.blob.arrayBuffer?.().then((buffer) => buffer ? new Uint8Array(buffer) : undefined) ?? undefined;
  }
  slice() {
    return this.blob.slice?.() ?? undefined;
  }
  stream() {
    return this.blob.stream?.() ?? undefined;
  }
  async text() {
    return await this.blob.text?.() ?? undefined;
  }
}
export function WebPlatform_Blob_CompatClass(blob) {
  return new Class_WebPlatform_Blob_CompatClass(blob);
}
