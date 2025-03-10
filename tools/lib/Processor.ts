import { ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

// Type Declarations

export type ProcessorFunction = (builder: BuilderInternal, file: ProjectFile) => Promise<void>;

export interface ProcessorModule {
  onAdd: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
  onRemove: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
}

// Example

// The function a file runs during the pocessing phase.
async function ExampleProcessorFunction(builder: BuilderInternal, file: ProjectFile) {
  // Do whatever you want to do with the file.
  ConsoleLog(file.src_path.standard);
}

// The class used to setup files with the processor function.
export class CProcessor_ExampleProcessorModule implements ProcessorModule {
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    // Determine which files should be processed.
    for (const file of files) {
      file.addProcessorFunction(ExampleProcessorFunction);
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    // Handle any necessary cleanup for this class instance.
    // The files may no longer exist, but you may still have access to their
    // cached contents.
  }
}

// A "factory" function for creating and/or configuring the class. Also helps
// cut down on code ceremony for the user.
export function Processor_ExampleProcessorModule(): ProcessorModule {
  return new CProcessor_ExampleProcessorModule();
}
