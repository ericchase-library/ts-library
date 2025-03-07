import { Handler, HandlerCaller } from 'src/lib/ericchase/Design Pattern/Handler.js';
import { GlobScanner } from 'src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { DependencyGraph } from 'tools/lib/DependencyGraph.js';
import { GenericProvider } from 'tools/lib/platform/generic_provider.js';
import { AvailableRuntimes, getPlatform } from 'tools/lib/platform/index.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class ProjectManager {
  readonly out_dir: Path;
  readonly src_dir: Path;
  readonly platform: GenericProvider;

  constructor({ out_dir = 'out', src_dir = 'src' }, { runtime }: { runtime: AvailableRuntimes }) {
    this.out_dir = new Path(out_dir);
    this.src_dir = new Path(src_dir);
    this.platform = getPlatform(runtime);
  }

  dependency_graph = new DependencyGraph<ProjectFile>();

  async start() {
    // TODO: hide GlobScanner behind platform provider
    for (const path_group of new GlobScanner().scanDot(this.src_dir, '**/*').path_groups) {
      this.newFile(path_group.relative_path.path);
    }
    await this.$handler_fileAdded.call([...this.files]);
  }

  $handler_fileAdded = new HandlerCaller<ProjectFile[]>();
  $handler_fileUpdated = new HandlerCaller<ProjectFile[]>();
  subscribe(event: 'fileAdded' | 'fileUpdated', handler: Handler<ProjectFile[]>) {
    switch (event) {
      case 'fileAdded':
        this.$handler_fileAdded.add(handler);
        break;
      case 'fileUpdated':
        this.$handler_fileUpdated.add(handler);
        break;
    }
  }

  addWatcher() {}
  deleteWatcher() {}

  $map_file_to_path: Map<ProjectFile, string> = new Map();
  $map_path_to_file: Map<string, ProjectFile> = new Map();
  get files(): IterableIterator<ProjectFile> {
    return this.$map_file_to_path.keys();
  }
  get paths(): IterableIterator<string> {
    return this.$map_path_to_file.keys();
  }

  newFile(relative_path: string) {
    const standard_path = new Path(relative_path).standard_path;
    if (this.$map_path_to_file.has(standard_path)) {
      throw new Error(`file "${standard_path}" already added`);
    }
    const project_file = new ProjectFile(this, relative_path);
    this.$map_path_to_file.set(standard_path, project_file);
    this.$map_file_to_path.set(project_file, standard_path);
    this.dependency_graph.addNode(project_file);
    return project_file;
  }

  hasFile(project_file: ProjectFile): boolean {
    return this.$map_file_to_path.has(project_file);
  }
  getFile(relative_path: string): ProjectFile {
    const standard_path = new Path(relative_path).standard_path;
    const project_file = this.$map_path_to_file.get(standard_path);
    if (project_file === undefined) {
      throw new Error(`file "${standard_path}" does not exist`);
    }
    return project_file;
  }
  hasPath(path: string): boolean {
    return this.$map_path_to_file.has(new Path(path).standard_path);
  }
  getPath(project_file: ProjectFile): string {
    const standard_path = this.$map_file_to_path.get(project_file);
    if (standard_path === undefined) {
      throw new Error(`file "${standard_path}" does not exist`);
    }
    return new Path(standard_path).path;
  }
}
