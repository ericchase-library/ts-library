// TODO:
import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { Sleep } from 'src/lib/ericchase/Utility/Sleep.js';
import { BuilderInternal, ProcessorModule } from 'tools/lib/Builder-Internal.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class CProcessor_Test implements ProcessorModule {
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    for (const file of files) {
      file.addProcessorFunction(Task);
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}
}

const cache = new Map<string, ProcessorModule>();
export function Processor_Test(): ProcessorModule {
  return Map_GetOrDefault(cache, '', () => new CProcessor_Test());
}

async function Task(builder: BuilderInternal, file: ProjectFile) {
  await Sleep(100);
  ConsoleLog(file.src_path.standard);
}
