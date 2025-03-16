import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, ProcessorModule, ProjectFile } from 'tools/lib/Builder.js';

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
