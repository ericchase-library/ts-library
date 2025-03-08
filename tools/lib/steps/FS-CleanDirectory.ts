import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { BuilderInternal, BuildStep } from 'tools/lib/Builder-Internal.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';

class CBuildStep_FSCleanDirectory implements BuildStep {
  constructor(readonly paths: SimplePath[]) {}
  async run(builder: BuilderInternal) {
    for (const path of this.paths) {
      await builder.platform.Directory.delete(path);
      await builder.platform.Directory.create(path);
    }
  }
}

const cache = new Map<string, BuildStep>();
export function BuildStep_FSCleanDirectory(paths: string[]): BuildStep {
  return Map_GetOrDefault(cache, paths.join('|'), () => new CBuildStep_FSCleanDirectory(paths.map((path) => new SimplePath(path))));
}
