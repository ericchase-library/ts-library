import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
import { Builder } from '../Builder.js';
import { Logger } from '../Logger.js';

// A "factory" function for creating and/or configuring the class. Also helps
// cut down on ceremonial code for the user.
export function Processor_Example(): Builder.Processor {
  return new Class();
}
class Class implements Builder.Processor {
  ProcessorName = Processor_Example.name;
  channel = Logger(this.ProcessorName).newChannel();

  constructor() {
    // The constructor can only be used for very simple setup. Asynchronous
    // calls cannot be awaited. The builder is not available, yet. Basically
    // nothing is setup, yet. Use this to pass in static data that you might
    // need.
  }
  async onStartUp(builder: Builder.Internal): Promise<void> {
    // Use this to do the majority of actual setup for this processor instance.
    // This method is called only once after the startup steps phase.
  }
  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    // Determine which files should be processed.
    for (const file of files) {
      // Example glob matcher for text (.txt) files:
      if (BunPlatform.Glob.Match(file.src_path.toStandard(), '**/*.txt')) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }
  async onRemove(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    // Handle any necessary cleanup for this class instance.
    // The files may no longer exist, but you may still have access to their
    // cached contents.
  }
  async onCleanUp(builder: Builder.Internal): Promise<void> {
    // Use this to do the majority of cleanup for this processor instance. This
    // method is called only once after the cleanup steps phase.
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    // Do whatever you want to do with the file. You can write multiple process
    // methods for different file paths. This method is not part of the
    // ProcessorModule interface. You could potentially add an anonymous
    // function during the onAdd call if you want; but, using a class method is
    // a bit cleaner and easier to work with.
    this.channel.log(`Example Processor: "${file.src_path.value}"`);
  }
}
