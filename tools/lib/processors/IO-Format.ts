// TODO:
import { U8StreamReadAll } from 'src/lib/ericchase/Algorithm/Stream.js';
import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class CProcessor_IOFormat implements ProcessorModule {
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    for (const file of files) {
      file.addProcessor(this, this.onProcess);
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}

  async onProcess(builder: BuilderInternal, file: ProjectFile): Promise<void> {
    const p0 = Bun.spawn(['biome', 'format', '--files-ignore-unknown', 'true', '--verbose', '--write', file.src_path.raw], { stderr: 'pipe', stdout: 'pipe' });
    const p1 = Bun.spawn(['bun', 'prettier', file.src_path.raw, '--write'], { stderr: 'pipe', stdout: 'pipe' });
    await Promise.allSettled([p0.exited, p1.exited]);
    ConsoleLog(await U8StreamReadAll(p0.stdout));
    ConsoleLog(await U8StreamReadAll(p0.stderr));
    ConsoleLog(await U8StreamReadAll(p1.stdout));
    ConsoleLog(await U8StreamReadAll(p1.stderr));
    ConsoleLog();
  }
}

export function Processor_IOFormat(): ProcessorModule {
  return new CProcessor_IOFormat();
}
