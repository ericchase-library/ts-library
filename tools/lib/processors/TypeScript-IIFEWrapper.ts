import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

const logger = Logger(__filename, Processor_TypeScript_IIFEWrapper.name);

export function Processor_TypeScript_IIFEWrapper(): ProcessorModule {
  return new CProcessor_TypeScript_IIFEWrapper();
}

class CProcessor_TypeScript_IIFEWrapper implements ProcessorModule {
  logger = logger.newChannel();

  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>) {
    for (const file of files) {
      if (file.src_path.endsWith('.script.ts')) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}

  async onProcess(builder: BuilderInternal, file: ProjectFile): Promise<void> {
    file.setText(`(() => {\n${await file.getText()}})();`);
  }
}
