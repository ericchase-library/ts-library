import { BuilderInternal, ProcessorModule } from 'tools/lib/Builder-Internal.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_IOBasicWriter implements ProcessorModule {
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    for (const file of files) {
      if (this.canWrite(file)) {
        file.processor_function_list.push(async (builder, file) => {
          if (file.modified === true) {
            await file.write();
          }
        });
      }
    }
  }

  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}

  canWrite(file: ProjectFile): boolean {
    // we want to copy all module and script source files
    if (file.src_path.endsWith('.module.ts')) {
      return true;
    }
    if (file.src_path.endsWith('.script.ts')) {
      return true;
    }

    // skip regular typescript files
    if (file.src_path.ext === '.ts') {
      return false;
    }

    // skip anything else in lib directory
    if (file.isinlib) {
      return false;
    }

    return true;
  }
}
