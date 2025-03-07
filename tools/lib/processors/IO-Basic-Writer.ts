import { ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_IOBasicWriter implements ProcessorModule {
  async onFilesAdded(files: ProjectFile[]): Promise<void> {
    for (const file of files) {
      if (this.canWrite(file)) {
        file.processor_function_list.push(async (file) => {
          if (file.modified === true) {
            await file.write();
          }
        });
      }
    }
  }

  canWrite(file: ProjectFile): boolean {
    // we want to copy all module and script source files
    if (file.relative_path.endsWith('.module.ts')) {
      return true;
    }
    if (file.relative_path.endsWith('.script.ts')) {
      return true;
    }

    // skip regular typescript files
    if (file.relative_path.endsWith('.ts')) {
      return false;
    }

    // skip anything else in lib directory
    if (file.isinlib) {
      return false;
    }

    return true;
  }
}
