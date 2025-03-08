import { GlobScanner } from 'src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { Defer } from 'src/lib/ericchase/Utility/Defer.js';
import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { Builder } from 'tools/lib/Builder.js';
import { AvailableRuntimes, UnimplementedProvider } from 'tools/lib/platform/platform.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export interface BuildStep {
  run: (builder: BuilderInternal) => Promise<void>;
}
export interface ProcessorModule {
  onAdd: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
  onRemove: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
}
export type ProcessorFunction = (builder: BuilderInternal, file: ProjectFile) => Promise<void>;

export class BuilderInternal {
  constructor(public external: Builder) {}

  platform = UnimplementedProvider;
  runtime: AvailableRuntimes = 'bun';

  // Directories

  dir = {
    out: new SimplePath('out'),
    src: new SimplePath('src'),
    lib: new SimplePath('src/lib'),
    tools: new SimplePath('tools'),
  };

  // Build Steps & Processor Modules

  startup_steps: BuildStep[] = [];
  processor_modules: ProcessorModule[] = [];
  cleanup_steps: BuildStep[] = [];

  // Dependencies

  map_upstream_to_downstream = new Map<ProjectFile, Set<ProjectFile>>();
  map_downstream_to_upstream = new Map<ProjectFile, Set<ProjectFile>>();
  addDependency(upstream: ProjectFile, downstream: ProjectFile) {
    if (this.map_downstream_to_upstream.get(upstream)?.has(downstream)) {
      throw new Error(`dependency cycle between upstream "${upstream.src_path.standard}" and downstream "${downstream.src_path.standard}"`);
    }
    Map_GetOrDefault(this.map_upstream_to_downstream, upstream, () => new Set<ProjectFile>()).add(downstream);
    Map_GetOrDefault(this.map_downstream_to_upstream, downstream, () => new Set<ProjectFile>()).add(upstream);
  }
  removeDependency(upstream: ProjectFile, downstream: ProjectFile) {
    Map_GetOrDefault(this.map_upstream_to_downstream, upstream, () => new Set<ProjectFile>()).delete(downstream);
    Map_GetOrDefault(this.map_downstream_to_upstream, downstream, () => new Set<ProjectFile>()).delete(upstream);
  }

  // Files & Paths

  set_files = new Set<ProjectFile>();
  map_path_to_file = new Map<string, ProjectFile>();

  get files(): Set<ProjectFile> {
    return new Set<ProjectFile>(this.set_files);
  }
  get paths(): Set<SimplePath> {
    return new Set<SimplePath>(Array.from(this.map_path_to_file.keys()).map((path) => new SimplePath(path)));
  }
  hasFile(project_file: ProjectFile): boolean {
    // @debug-start
    const stored_file = this.map_path_to_file.get(project_file.src_path.standard);
    if (stored_file !== undefined && stored_file !== project_file) {
      throw new Error(`file "${project_file.src_path.standard}" different from stored file "${stored_file.src_path.standard}"`);
    }
    // @debug-end
    return this.map_path_to_file.has(project_file.src_path.standard);
  }
  hasPath(src_path: SimplePath): boolean {
    return this.map_path_to_file.has(src_path.standard);
  }
  getFile(src_path: SimplePath): ProjectFile {
    const project_file = this.map_path_to_file.get(src_path.standard);
    if (project_file === undefined) {
      throw new Error(`file "${src_path.standard}" does not exist`);
    }
    return project_file;
  }

  addFile(src_path: SimplePath, out_path: SimplePath) {
    // @debug-start
    if (this.map_path_to_file.has(src_path.standard)) {
      throw new Error(`file "${src_path.standard}" already added`);
    }
    // @debug-end
    const file = new ProjectFile(this, src_path, out_path);
    this.set_files.add(file);
    this.map_path_to_file.set(src_path.standard, file);
    return file;
  }

  // File Events

  // on_add = new HandlerCaller<Set<ProjectFile>>();
  // on_modify = new HandlerCaller<Set<ProjectFile>>();
  // on_remove = new HandlerCaller<Set<ProjectFile>>();

  async start() {
    // TODO: hide GlobScanner behind platform provider
    for (const path_group of new GlobScanner().scanDot(Path.from(this.dir.src.raw), '**/*').path_groups) {
      this.addFile(new SimplePath(this.dir.src, path_group.relative_path.path), new SimplePath(this.dir.out, path_group.relative_path.path));
    }

    // Startup Steps
    for (const step of this.startup_steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run(this);
    }

    // Processor Modules
    await this.processAddedFiles(this.files);

    // Cleanup Steps
    for (const step of this.cleanup_steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run(this);
    }
    // TODO: Start Watcher on Src
  }

  async processAddedFiles(added_files: Set<ProjectFile>) {
    for (const processor of this.processor_modules) {
      await processor.onAdd(this, added_files);
    }
    const tasks: Promise<void>[] = [];
    const addTask = async (file: ProjectFile) => {
      // TODO: should we mark as modified on first run?
      file.ismodified = true;
      for (const processor_function of file.$processor_list) {
        await processor_function(this, file);
      }
      file.ismodified = false;
    };
    for (const file of added_files) {
      tasks.push(addTask(file));
    }
    await Promise.all(tasks);
    await this.processUpdatedFiles(added_files);
  }

  async processUpdatedFiles(updated_files: Set<ProjectFile>) {
    const tasks = new Map<ProjectFile, Defer<void>>();
    // setup task for file and downstream files if not exist
    for (const file of updated_files) {
      if (tasks.has(file) === false) {
        tasks.set(file, Defer());
      }
      for (const downstream of this.map_upstream_to_downstream.get(file) ?? []) {
        if (tasks.has(downstream) === false) {
          tasks.set(downstream, Defer());
        }
      }
    }
    // add tasks for each file that waits on upstream file if it exists in queue
    for (const [file, task] of tasks) {
      (async () => {
        const waitlist: Promise<void>[] = [];
        for (const upstream of this.map_downstream_to_upstream.get(file) ?? []) {
          const upstream_task = tasks.get(upstream);
          if (upstream_task) {
            waitlist.push(upstream_task.promise);
          }
        }
        await Promise.allSettled(waitlist);
        for (const processor_function of file.$processor_list) {
          await processor_function(this, file);
        }
        task.resolve();
      })();
    }
    await Promise.allSettled(tasks.values());
  }
}
