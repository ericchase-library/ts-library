import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { BuilderInternal, ProcessorModule } from 'tools/lib/Builder-Internal.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';
import { globMatch } from 'tools/lib/platform/utility.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class CProcessor_IOBasicWriter implements ProcessorModule {
  constructor(
    readonly include_patterns: string[],
    readonly exclude_patterns: string[],
  ) {}
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    for (const file of files) {
      if (globMatch(builder.platform, file.src_path.standard, this.include_patterns, this.exclude_patterns) === true) {
        file.addProcessorFunction(Task);
      }
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}
}

async function Task(builder: BuilderInternal, file: ProjectFile) {
  if (file.ismodified === true) {
    try {
      await builder.platform.Directory.create(file.out_path.slice(0, -1));
    } catch (e) {}
    await file.write();
  }
}

const cache = new Map<string, ProcessorModule>();
export function Processor_IOBasicWriter(include_patterns: string[], exclude_patterns: string[]): ProcessorModule {
  include_patterns = include_patterns.map((pattern) => new SimplePath(pattern).standard);
  exclude_patterns = exclude_patterns.map((pattern) => new SimplePath(pattern).standard);
  return Map_GetOrDefault(cache, `${include_patterns.join(',')}|${exclude_patterns.join(',')}`, () => new CProcessor_IOBasicWriter(include_patterns, exclude_patterns));
}
