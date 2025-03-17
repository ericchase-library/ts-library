var __dirname = "";
import { Path } from "src/lib/ericchase/Platform/FilePath.js";
import { SplitLines } from "src/lib/ericchase/Utility/String.js";

export class CPlatformProvider {
  Directory = {
    create: (path, recursive = true) => {
      throw new Error("Not Implemented");
    },
    delete: (path, recursive = true) => {
      throw new Error("Not Implemented");
    },
    globScan: (path, pattern) => {
      throw new Error("Not Implemented");
    },
    watch: (path, callback, recursive = true) => {
      throw new Error("Not Implemented");
    }
  };
  File = {
    appendBytes: (path, bytes) => {
      throw new Error("Not Implemented");
    },
    appendText: (path, text) => {
      throw new Error("Not Implemented");
    },
    compare: (from, to) => {
      throw new Error("Not Implemented");
    },
    copy: (from, to, overwrite = false) => {
      throw new Error("Not Implemented");
    },
    delete: (path) => {
      throw new Error("Not Implemented");
    },
    move: (from, to, overwrite = false) => {
      throw new Error("Not Implemented");
    },
    readBytes: (path) => {
      throw new Error("Not Implemented");
    },
    readText: (path) => {
      throw new Error("Not Implemented");
    },
    writeBytes: (path, bytes, createpath = true) => {
      throw new Error("Not Implemented");
    },
    writeText: (path, text, createpath = true) => {
      throw new Error("Not Implemented");
    }
  };
  Path = {
    getStats: (path) => {
      throw new Error("Not Implemented");
    },
    isDirectory: (path) => {
      throw new Error("Not Implemented");
    },
    isFile: (path) => {
      throw new Error("Not Implemented");
    },
    isSymbolicLink: (path) => {
      throw new Error("Not Implemented");
    }
  };
  Utility = {
    globMatch: (query, pattern) => {
      throw new Error("Not Implemented");
    }
  };
}
export const UnimplementedProvider = new CPlatformProvider;
export function PlatformProvider() {
  const provider = Object.create(UnimplementedProvider);
  provider.Directory = Object.create(UnimplementedProvider.Directory);
  provider.File = Object.create(UnimplementedProvider.File);
  provider.Utility = Object.create(UnimplementedProvider.Utility);
  return provider;
}
function cleanStack(stack = "") {
  const lines = SplitLines(stack ?? "");
  if (lines[0].trim() === "Error") {
    lines[0] = "Fixed Call Stack:";
  }
  return lines.join(`
`);
}
async function callAsync(stack = "", promise) {
  try {
    return await promise;
  } catch (async_error) {
    if (typeof async_error === "object") {
      throw new Error(`${async_error.message}
${cleanStack(stack)}`);
    }
    throw new Error(`${async_error}
${cleanStack(stack)}`);
  }
}

class CPlatformProviderErrorWrapper extends CPlatformProvider {
  provider;
  constructor(provider) {
    super();
    this.provider = provider;
  }
  Directory = {
    create: (path, recursive = true) => {
      return callAsync(Error().stack, this.provider.Directory.create(path, recursive));
    },
    delete: (path, recursive = true) => {
      return callAsync(Error().stack, this.provider.Directory.delete(path, recursive));
    },
    globScan: (path, pattern) => {
      return callAsync(Error().stack, this.provider.Directory.globScan(path, pattern));
    },
    watch: (path, callback, recursive = true) => {
      return this.provider.Directory.watch(path, callback, recursive);
    }
  };
  File = {
    appendBytes: (path, bytes) => {
      return callAsync(Error().stack, this.provider.File.appendBytes(path, bytes));
    },
    appendText: (path, text) => {
      return callAsync(Error().stack, this.provider.File.appendText(path, text));
    },
    compare: (from, to) => {
      return callAsync(Error().stack, this.provider.File.compare(from, to));
    },
    copy: (from, to, overwrite = false) => {
      return callAsync(Error().stack, this.provider.File.copy(from, to, overwrite));
    },
    delete: (path) => {
      return callAsync(Error().stack, this.provider.File.delete(path));
    },
    move: (from, to, overwrite = false) => {
      return callAsync(Error().stack, this.provider.File.move(from, to, overwrite));
    },
    readBytes: (path) => {
      return callAsync(Error().stack, this.provider.File.readBytes(path));
    },
    readText: (path) => {
      return callAsync(Error().stack, this.provider.File.readText(path));
    },
    writeBytes: (path, bytes, createpath = true) => {
      return callAsync(Error().stack, this.provider.File.writeBytes(path, bytes, createpath));
    },
    writeText: (path, text, createpath = true) => {
      return callAsync(Error().stack, this.provider.File.writeText(path, text, createpath));
    }
  };
  Path = {
    getStats: (path) => {
      return callAsync(Error().stack, this.provider.Path.getStats(path));
    },
    isDirectory: (path) => {
      return callAsync(Error().stack, this.provider.Path.isDirectory(path));
    },
    isFile: (path) => {
      return callAsync(Error().stack, this.provider.Path.isFile(path));
    },
    isSymbolicLink: (path) => {
      return callAsync(Error().stack, this.provider.Path.isSymbolicLink(path));
    }
  };
  Utility = {
    globMatch: (query, pattern) => {
      return this.provider.Utility.globMatch(query, pattern);
    }
  };
}
const modulemap = {
  bun: "BunProvider.js",
  node: "NodeProvider.js"
};
const $cache = new Map;
export async function getPlatformProvider(id) {
  if ($cache.has(id) === false) {
    const path = Path(__dirname, "PlatformProviders", modulemap[id]).raw;
    try {
      $cache.set(id, new CPlatformProviderErrorWrapper((await import(path)).default));
    } catch (error) {
      throw new Error(`Runtime "${id}" @ "${path}" threw: ${error}`);
    }
  }
  return $cache.get(id) ?? UnimplementedProvider;
}
