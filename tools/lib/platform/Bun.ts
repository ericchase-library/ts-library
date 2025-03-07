import { GenericProvider } from 'tools/lib/platform/generic_provider.js';

export class BunProvider implements GenericProvider {
  File = {
    async bytes(path: string): Promise<Uint8Array> {
      return await Bun.file(path).bytes();
    },
    async text(path: string): Promise<string> {
      return await Bun.file(path).text();
    },
    async write(path: string, input: string | ArrayBufferLike | Blob | NodeJS.TypedArray<ArrayBufferLike>): Promise<void> {
      await Bun.write(path, input);
    },
  };
}
