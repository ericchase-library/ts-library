import { default as node_path } from 'node:path';
import { GlobScanner } from 'src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { Defer } from 'src/lib/ericchase/Utility/Defer.js';
import { Map_GetOrDefault } from 'src/lib/ericchase/Utility/Map.js';
import { Builder } from 'tools/lib/Builder.js';
import { AvailableRuntimes, UnimplementedProvider } from 'tools/lib/platform/index.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export interface BuildStep {
  run: () => Promise<void>;
}
export type ProcessorFunction = (builder: BuilderInternal, file: ProjectFile) => Promise<void>;
export interface ProcessorModule {
  onAdd: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
  onRemove: (builder: BuilderInternal, files: Set<ProjectFile>) => Promise<void>;
}
export class SimplePath {
  parts: string[] = [];
  constructor(...paths: (SimplePath | string)[]) {
    for (const path of paths) {
      if (path instanceof SimplePath) {
        this.parts.push(...path.parts);
      } else {
        this.parts.push(...node_path.normalize(path).replaceAll('\\', '/').split('/'));
      }
    }
  }
  /** The basename is the final rightmost segment of the file path; it is
   * usually a file, but can also be a directory name. */
  get basename() {
    return this.parts[this.parts.length - 1];
  }
  set basename(value: string) {
    this.parts[this.parts.length - 1] = value;
  }
  get name() {
    const dot = this.basename.lastIndexOf('.');
    return dot > 0 ? this.basename.slice(0, dot) : this.basename;
  }
  set name(value: string) {
    this.basename = value + this.ext;
  }
  get ext() {
    const dot = this.basename.lastIndexOf('.');
    return dot > 0 ? this.basename.slice(dot) : '';
  }
  set ext(value: string) {
    if (value[0] !== '.') {
      this.basename = `${this.name}.${value}`;
    } else {
      this.basename = this.name + value;
    }
  }
  get raw() {
    return node_path.join(...this.parts);
  }
  get standard() {
    return this.parts.join('/');
  }
  startsWith(other: SimplePath | string) {
    if (other instanceof SimplePath) {
      return this.raw.startsWith(other.raw);
    }
    return this.raw.startsWith(new SimplePath(other).raw);
  }
  endsWith(other: SimplePath | string) {
    if (other instanceof SimplePath) {
      return this.raw.endsWith(other.raw);
    }
    return this.raw.endsWith(new SimplePath(other).raw);
  }
}

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
      await step.run();
    }
    // Processor Modules
    await this.processAddedFiles(this.files);
    // Cleanup Steps
    for (const step of this.cleanup_steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run();
    }
    // TODO: Start Watcher on Src
  }

  async processAddedFiles(added_files: Set<ProjectFile>) {
    console.log('added_files', added_files.size);

    for (const processor of this.processor_modules) {
      await processor.onAdd(this, added_files);
    }
    const tasks: Promise<void>[] = [];
    for (const file of added_files) {
      // TODO: should we mark as modified on first run?
      file.modified = true;
      for (const processor_function of file.processor_function_list) {
        tasks.push(processor_function(this, file));
      }
      file.modified = false;
    }
    await Promise.allSettled(tasks);
    await this.processUpdatedFiles(added_files);
  }

  async processUpdatedFiles(updated_files: Set<ProjectFile>) {
    console.log('updated_files', updated_files.size);

    const tasks = new Map<ProjectFile, Defer<void>>();
    // setup task for file and downstream files if not exist
    for (const file of updated_files) {
      if (!tasks.has(file)) {
        tasks.set(file, Defer());
      }
      for (const downstream of this.map_upstream_to_downstream.get(file) ?? []) {
        if (!tasks.has(downstream)) {
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
        for (const processor_function of file.processor_function_list) {
          await processor_function(this, file);
        }
        task.resolve();
      })();
    }
  }
}
