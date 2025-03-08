import { default as node_path } from 'node:path';
import { GlobScanner } from 'src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleError, ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { Builder } from 'tools/lib/Builder.js';
import { DependencyGraph } from 'tools/lib/DependencyGraph.js';
import { AvailableRuntimes, UnimplementedProvider } from 'tools/lib/platform/index.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export interface BuildStep {
  run: () => Promise<void>;
}
export type ProcessorFunction = (file: ProjectFile) => Promise<void>;
export interface ProcessorModule {
  onAdd: (builder: BuilderInternal, files: ProjectFile[]) => Promise<void>;
  onRemove: (builder: BuilderInternal, files: ProjectFile[]) => Promise<void>;
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

  // Build Steps and Processor Modules

  startup_steps: BuildStep[] = [];
  processor_modules: ProcessorModule[] = [];
  cleanup_steps: BuildStep[] = [];

  // Files

  dependency_graph = new DependencyGraph<ProjectFile>();
  map_file_to_path: Map<ProjectFile, string> = new Map();
  map_path_to_file: Map<string, ProjectFile> = new Map();
  get files(): ProjectFile[] {
    return Array.from(this.map_file_to_path.keys());
  }
  get paths(): SimplePath[] {
    return Array.from(this.map_path_to_file.keys()).map((path) => new SimplePath(path));
  }
  hasFile(project_file: ProjectFile): boolean {
    return this.map_file_to_path.has(project_file);
  }
  getFile(src_path: SimplePath): ProjectFile {
    const { standard } = src_path;
    const project_file = this.map_path_to_file.get(standard);
    if (project_file === undefined) {
      throw new Error(`file "${standard}" does not exist`);
    }
    return project_file;
  }
  hasPath(src_path: SimplePath): boolean {
    return this.map_path_to_file.has(src_path.standard);
  }
  getPath(project_file: ProjectFile): SimplePath {
    const path = this.map_file_to_path.get(project_file);
    if (path === undefined) {
      throw new Error(`file "${path}" does not exist`);
    }
    return new SimplePath(path);
  }

  addFile(src_path: SimplePath, out_path: SimplePath) {
    const { standard } = src_path;
    if (this.map_path_to_file.has(standard)) {
      throw new Error(`file "${standard}" already added`);
    }
    const file = new ProjectFile(this, src_path, out_path);
    this.map_path_to_file.set(standard, file);
    this.map_file_to_path.set(file, standard);
    this.dependency_graph.addNode(file);
    return file;
  }

  // File Events

  // on_add = new HandlerCaller<ProjectFile[]>();
  // on_modify = new HandlerCaller<ProjectFile[]>();
  // on_remove = new HandlerCaller<ProjectFile[]>();

  async start() {
    // TODO: hide GlobScanner behind platform provider
    for (const path_group of new GlobScanner().scanDot(Path.from(this.dir.src.raw), '**/*').path_groups) {
      this.addFile(new SimplePath(this.dir.src, path_group.relative_path.path), new SimplePath(this.dir.out, path_group.relative_path.path));
    }

    for (const step of this.startup_steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run();
    }

    await this.processAddedFiles(this.files);

    for (const step of this.cleanup_steps) {
      ConsoleLogWithDate(step.constructor.name);
      await step.run();
    }

    // setup file watchers with debounce
    // on trigger
    // add any dependencies for modified file to process queue
    // add modified file itself to process queue

    // after debounce time
    // run each processor in processor list on every file in the process queue
  }

  async processAddedFiles(files: ProjectFile[]) {
    console.log('added_files', files.length);

    for (const processor of this.processor_modules) {
      await processor.onAdd(this, files);
    }
    for (const file of files) {
      // mark as modified on first run
      file.modified = true;
      for (const processor_function of file.processor_function_list) {
        await processor_function(file);
      }
      file.modified = false;
    }
    await this.processUpdatedFiles(files);
  }

  async processUpdatedFiles(files: ProjectFile[]) {
    console.log('updated_files', files.length);

    const topological_results = this.dependency_graph.getTopologicalOrder(files);
    if (topological_results.ordered_nodes.length > 0 && topological_results.has_cycle) {
      ConsoleError('ERROR: Found cycle in dependency graph:', `${topological_results.cycle_nodes.map((file) => file.src_path).join(' -> ')}`);
    } else {
      for (const file of topological_results.ordered_nodes) {
        for (const processor_function of file.processor_function_list) {
          await processor_function(file);
        }
      }
    }
  }
}
