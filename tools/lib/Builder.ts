import { ConsoleError, ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { TryLockEach } from 'tools/lib/cache/LockCache.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';
import { ProjectManager } from 'tools/lib/ProjectManager.js';

export interface BuildStep {
  run: () => Promise<void>;
}
export interface ProcessorModule {
  onFilesAdded: (files: ProjectFile[]) => Promise<void>;
}
export type ProcessorFunction = (file: ProjectFile) => Promise<void>;

export class Builder {
  $init_steps: BuildStep[];
  $post_steps: BuildStep[];
  $processors: ProcessorModule[];

  constructor(
    public project_manager: ProjectManager,
    { init_steps = [], post_steps = [], processors = [] }: { init_steps?: BuildStep[]; post_steps?: BuildStep[]; processors?: ProcessorModule[] },
  ) {
    this.$init_steps = init_steps;
    this.$post_steps = post_steps;
    this.$processors = processors;
  }

  async start() {
    TryLockEach(['Build', 'Format']);

    this.project_manager.subscribe('fileAdded', (files) => this.processAddedFiles(files));
    this.project_manager.subscribe('fileUpdated', (files) => this.processUpdatedFiles(files));

    for (const build_step of this.$init_steps) {
      ConsoleLogWithDate(build_step.constructor.name);
      await build_step.run();
    }

    await this.project_manager.start();

    for (const build_step of this.$post_steps) {
      ConsoleLogWithDate(build_step.constructor.name);
      await build_step.run();
    }

    // setup file watchers with debounce
    // on trigger
    // add any dependencies for modified file to process queue
    // add modified file itself to process queue

    // after debounce time
    // run each processor in processor list on every file in the process queue
  }

  async processAddedFiles(files: ProjectFile[]) {
    for (const processor of this.$processors) {
      await processor.onFilesAdded(files);
    }
    for (const file of files) {
      // mark as modified on first run
      file.modified = true;
      for (const processor_function of file.processor_function_list) {
        await processor_function(file);
      }
    }
    await this.processUpdatedFiles(files);
  }

  async processUpdatedFiles(files: ProjectFile[]) {
    const topological_results = this.project_manager.dependency_graph.getTopologicalOrder(files);
    if (topological_results.has_cycle) {
      ConsoleError('ERROR: Found cycle in dependency graph:', `${topological_results.cycle_nodes.map((file) => file.relative_path).join(' -> ')}`);
    } else {
      for (const file of topological_results.ordered_nodes) {
        for (const processor_function of file.processor_function_list) {
          await processor_function(file);
        }
      }
    }
  }
}
