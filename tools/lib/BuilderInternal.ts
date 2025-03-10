import { Handler, HandlerCaller } from 'src/lib/ericchase/Design Pattern/Handler.js';
import { PlatformProviderId, UnimplementedProvider } from 'src/lib/ericchase/Platform/PlatformProvider.js';
import { CPath, Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { Defer } from 'src/lib/ericchase/Utility/Defer.js';
import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { Builder } from 'tools/lib/Builder.js';
import { ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

type WatchPublisher = HandlerCaller<{ event: 'rename' | 'change'; path: CPath }>;
type WatchSubscriptionCallback = Handler<{ event: 'rename' | 'change'; path: CPath }>;

export interface BuildStep {
  run: (builder: BuilderInternal) => Promise<void>;
}

export class BuilderInternal {
  constructor(public external: Builder) {}

  platform = UnimplementedProvider;
  runtime: PlatformProviderId = 'bun';
  watchmode = false;

  // Directories

  dir = {
    lib: Path('src/lib'),
    out: Path('out'),
    src: Path('src'),
    tools: Path('tools'),
  };

  // Build Steps & Processor Modules

  startup_steps: BuildStep[] = [];
  processor_modules: ProcessorModule[] = [];
  cleanup_steps: BuildStep[] = [];

  // Dependencies

  $map_downstream_to_upstream = new Map<ProjectFile, Set<ProjectFile>>();
  $map_upstream_to_downstream = new Map<ProjectFile, Set<ProjectFile>>();
  addDependency(upstream: ProjectFile, downstream: ProjectFile) {
    if (this.$map_downstream_to_upstream.get(upstream)?.has(downstream)) {
      throw new Error(`dependency cycle between upstream "${upstream.src_path.standard}" and downstream "${downstream.src_path.standard}"`);
    }
    Map_GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<ProjectFile>()).add(upstream);
    Map_GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<ProjectFile>()).add(downstream);
  }
  removeDependency(upstream: ProjectFile, downstream: ProjectFile) {
    Map_GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<ProjectFile>()).delete(upstream);
    Map_GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<ProjectFile>()).delete(downstream);
  }
  getDownstream(file: ProjectFile): Set<ProjectFile> {
    return this.$map_upstream_to_downstream.get(file) ?? new Set();
  }
  getUpstream(file: ProjectFile): Set<ProjectFile> {
    return this.$map_downstream_to_upstream.get(file) ?? new Set();
  }

  // Files & Paths

  set_files = new Set<ProjectFile>();
  map_path_to_file = new Map<string, ProjectFile>();

  get files(): Set<ProjectFile> {
    return new Set<ProjectFile>(this.set_files);
  }
  get paths(): Set<CPath> {
    return new Set<CPath>(Array.from(this.map_path_to_file.keys()).map((path) => Path(path)));
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
  hasPath(src_path: CPath): boolean {
    return this.map_path_to_file.has(src_path.standard);
  }
  getFile(src_path: CPath): ProjectFile {
    const project_file = this.map_path_to_file.get(src_path.standard);
    if (project_file === undefined) {
      throw new Error(`file "${src_path.standard}" does not exist`);
    }
    return project_file;
  }

  addFile(src_path: CPath, out_path: CPath) {
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
  $watchers = new Map<string, { publisher: WatchPublisher; unwatch: () => void }>();
  addWatcher(path: CPath, callback: WatchSubscriptionCallback) {
    const watcher = Map_GetOrDefault(this.$watchers, path.standard, () => {
      const publisher: WatchPublisher = new HandlerCaller();
      const unwatch = this.platform.Directory.watch(path, (event, path) => {
        publisher.call({ event, path });
      });
      return { publisher, unwatch };
    });
    watcher.publisher.add(callback);
  }

  // on_add = new HandlerCaller<Set<ProjectFile>>();
  // on_modify = new HandlerCaller<Set<ProjectFile>>();
  // on_remove = new HandlerCaller<Set<ProjectFile>>();

  async start() {
    for (const path of await this.platform.Directory.globScan(this.dir.src, '**/*')) {
      this.addFile(Path(this.dir.src, path), Path(this.dir.out, path));
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
  }

  async processAddedFiles(added_files: Set<ProjectFile>) {
    for (const processor of this.processor_modules) {
      await processor.onAdd(this, added_files);
    }
    const tasks: Promise<void>[] = [];
    for (const file of added_files) {
      file.isdirty = true;
      tasks.push(file.runProcessorList());
    }
    await Promise.allSettled(tasks);
    await this.processUpdatedFiles(added_files);
  }

  async processUpdatedFiles(updated_files: Set<ProjectFile>) {
    const defers = new Map<ProjectFile, Defer<void>>();
    // add defers for updated file and all downstream files
    for (const file of updated_files) {
      if (defers.has(file) === false) {
        defers.set(file, Defer());
      }
      for (const downstream of this.getDownstream(file) ?? []) {
        if (defers.has(downstream) === false) {
          defers.set(downstream, Defer());
        }
      }
    }
    // wait on all upstream defers
    const tasks: Promise<void>[] = [];
    for (const [file, defer] of defers) {
      const waitlist: Promise<void>[] = [];
      for (const upstream of this.getUpstream(file) ?? []) {
        const upstream_defer = defers.get(upstream);
        if (upstream_defer) {
          waitlist.push(upstream_defer.promise);
        }
      }
      tasks.push(file.runProcessorList(waitlist, defer));
    }
    await Promise.allSettled(tasks);
  }
}
