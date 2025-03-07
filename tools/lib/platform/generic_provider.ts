export interface GenericProvider {
  File: {
    bytes(path: string): Promise<Uint8Array>;
    text(path: string): Promise<string>;
    write(path: string, input: string | ArrayBufferLike | Blob | NodeJS.TypedArray<ArrayBufferLike>): Promise<void>;
  };
}
