class File {
  async readBytes(path: string): Promise<Uint8Array> {
    throw 'Not Implemented';
  }
  async readText(path: string): Promise<string> {
    throw 'Not Implemented';
  }
  async write(path: string, data: string | ArrayBufferLike | Blob | NodeJS.TypedArray<ArrayBufferLike>): Promise<number> {
    throw 'Not Implemented';
  }
}

export class Provider {
  File = new File();
}
