import { SimplePath } from 'tools/lib/platform/SimplePath.js';

class Directory {
  async create(path: SimplePath, recursive = true): Promise<boolean> {
    throw 'Not Implemented';
  }
  async delete(path: SimplePath, recursive = true): Promise<boolean> {
    throw 'Not Implemented';
  }
  async globScan(path: SimplePath, pattern: string): Promise<Set<string>> {
    throw 'Not Implemented';
  }
}

class File {
  async compare(from: SimplePath, to: SimplePath): Promise<boolean> {
    throw 'Not Implemented';
  }
  async copy(from: SimplePath, to: SimplePath, overwrite = false): Promise<boolean> {
    throw 'Not Implemented';
  }
  async delete(path: SimplePath): Promise<boolean> {
    throw 'Not Implemented';
  }
  async move(from: SimplePath, to: SimplePath, overwrite = false): Promise<boolean> {
    throw 'Not Implemented';
  }
  async readBytes(path: SimplePath): Promise<Uint8Array> {
    throw 'Not Implemented';
  }
  async readText(path: SimplePath): Promise<string> {
    throw 'Not Implemented';
  }
  async write(path: SimplePath, data: string | ArrayBufferLike | Blob | NodeJS.TypedArray<ArrayBufferLike>): Promise<number> {
    throw 'Not Implemented';
  }
}

class Utility {
  globMatch(query: string, pattern: string): boolean {
    throw 'Not Implemented';
  }
}

export class Provider {
  Directory = new Directory();
  File = new File();
  Utility = new Utility();
}
