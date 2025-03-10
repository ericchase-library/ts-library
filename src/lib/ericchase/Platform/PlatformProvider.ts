import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { SplitLines } from 'src/lib/ericchase/Utility/String.js';

export type FileData = string | ArrayBufferLike | Blob | NodeJS.TypedArray<ArrayBufferLike>;
export type WatchCallback = (event: 'rename' | 'change', path: CPath) => void;

export class CPlatformProvider {
  Directory = {
    create: async (path: CPath, recursive = true): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    delete: async (path: CPath, recursive = true): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    globScan: async (path: CPath, pattern: string): Promise<Set<string>> => {
      throw new Error('Not Implemented');
    },
    watch: (path: CPath, callback: WatchCallback, recursive = true): (() => void) => {
      throw new Error('Not Implemented');
    },
  };
  File = {
    compare: async (from: CPath, to: CPath): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    copy: async (from: CPath, to: CPath, overwrite = false): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    delete: async (path: CPath): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    move: async (from: CPath, to: CPath, overwrite = false): Promise<boolean> => {
      throw new Error('Not Implemented');
    },
    readBytes: async (path: CPath): Promise<Uint8Array> => {
      throw new Error('Not Implemented');
    },
    readText: async (path: CPath): Promise<string> => {
      throw new Error('Not Implemented');
    },
    writeBytes: async (path: CPath, bytes: Uint8Array, createpath = true): Promise<number> => {
      throw new Error('Not Implemented');
    },
    writeText: async (path: CPath, text: string, createpath = true): Promise<number> => {
      throw new Error('Not Implemented');
    },
  };
  Utility = {
    globMatch: (query: string, pattern: string): boolean => {
      throw new Error('Not Implemented');
    },
  };
}

export const UnimplementedProvider = new CPlatformProvider();

// Creates a descendent of UnimplementedProvider, and then creates descendents
// of each property of UnimplementedProvider.
export function PlatformProvider(): CPlatformProvider {
  const provider: CPlatformProvider = Object.create(UnimplementedProvider);
  provider.Directory = Object.create(UnimplementedProvider.Directory);
  provider.File = Object.create(UnimplementedProvider.File);
  provider.Utility = Object.create(UnimplementedProvider.Utility);
  return provider;
}

function cleanStack(stack = '') {
  const lines = SplitLines(stack ?? '');
  if (lines[0].trim() === 'Error') {
    lines[0] = 'Fixed Call Stack:';
  }
  return lines.join('\n');
}
async function callAsync<T>(stack = '', value: T) {
  try {
    return await value;
  } catch (async_error: any) {
    if (typeof async_error === 'object') {
      throw new Error(`${async_error.message}\n${cleanStack(stack)}`);
    }
    throw new Error(`${async_error}\n${cleanStack(stack)}`);
  }
}
class CPlatformProviderErrorWrapper extends CPlatformProvider {
  constructor(public provider: CPlatformProvider) {
    super();
  }
  Directory = {
    create: async (path: CPath, recursive = true): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.Directory.create(path, recursive));
    },
    delete: async (path: CPath, recursive = true): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.Directory.delete(path, recursive));
    },
    globScan: async (path: CPath, pattern: string): Promise<Set<string>> => {
      return callAsync(Error().stack, this.provider.Directory.globScan(path, pattern));
    },
    watch: (path: CPath, callback: WatchCallback, recursive = true): (() => void) => {
      return this.provider.Directory.watch(path, callback, recursive);
    },
  };
  File = {
    compare: async (from: CPath, to: CPath): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.File.compare(from, to));
    },
    copy: async (from: CPath, to: CPath, overwrite = false): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.File.copy(from, to, overwrite));
    },
    delete: async (path: CPath): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.File.delete(path));
    },
    move: async (from: CPath, to: CPath, overwrite = false): Promise<boolean> => {
      return callAsync(Error().stack, this.provider.File.move(from, to, overwrite));
    },
    readBytes: async (path: CPath): Promise<Uint8Array> => {
      return callAsync(Error().stack, this.provider.File.readBytes(path));
    },
    readText: async (path: CPath): Promise<string> => {
      return callAsync(Error().stack, this.provider.File.readText(path));
    },
    writeBytes: async (path: CPath, bytes: Uint8Array, createpath = true): Promise<number> => {
      return callAsync(Error().stack, this.provider.File.writeBytes(path, bytes, createpath));
    },
    writeText: async (path: CPath, text: string, createpath = true): Promise<number> => {
      return callAsync(Error().stack, this.provider.File.writeText(path, text, createpath));
    },
  };
  Utility = {
    globMatch: (query: string, pattern: string): boolean => {
      return this.provider.Utility.globMatch(query, pattern);
    },
  };
}

export type PlatformProviderId = 'bun' | 'node';
const modulemap: Record<PlatformProviderId, string> = {
  'bun': 'BunProvider.js',
  'node': 'NodeProvider.js',
};

const $cache = new Map<PlatformProviderId, CPlatformProvider>();
export async function getPlatformProvider(id: PlatformProviderId): Promise<CPlatformProvider> {
  if ($cache.has(id) === false) {
    try {
      $cache.set(id, new CPlatformProviderErrorWrapper((await import(Path(__dirname, 'PlatformProviders', modulemap[id]).raw)).default));
    } catch (error) {
      throw new Error(`Runtime "${id}" Not Implemented`);
    }
  }
  return $cache.get(id) ?? UnimplementedProvider;
}
