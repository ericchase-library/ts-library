import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ProcessorFunction } from 'tools/lib/Builder.js';
import { ProjectManager } from 'tools/lib/ProjectManager.js';

export class ProjectFile {
  readonly relative_path: string;
  readonly isinlib: boolean;
  out_ext: string;

  constructor(
    public project_manager: ProjectManager,
    relative_path: string,
  ) {
    this.relative_path = Path.from(relative_path).standard_path;
    this.isinlib = this.relative_path.startsWith('lib/');
    this.out_ext = Path.from(relative_path).ext;
  }

  addUpstream(upstream_file: ProjectFile) {
    if (upstream_file !== this) {
      this.project_manager.dependency_graph.addEdge(upstream_file, this);
    }
  }

  get src_path() {
    return this.project_manager.src_dir.appendSegment(this.relative_path).path;
  }

  processor_function_list = new Array<ProcessorFunction>();

  /** When false, $bytes/$text are no longer from the original file. */
  original = true;
  /** When true, downstream files need to be processed. */
  modified = false;
  $bytes?: Uint8Array;
  $text?: string;

  async getBytes(): Promise<Uint8Array> {
    if (this.$bytes === undefined) {
      if (this.$text === undefined) {
        this.$bytes = await this.project_manager.platform.File.bytes(this.project_manager.src_dir.appendSegment(this.relative_path).path);
      } else {
        this.$bytes = new TextEncoder().encode(this.$text);
        this.$text = undefined;
      }
    }
    return this.$bytes;
  }
  async getText(): Promise<string> {
    if (this.$text === undefined) {
      if (this.$bytes === undefined) {
        this.$text = await this.project_manager.platform.File.text(this.project_manager.src_dir.appendSegment(this.relative_path).path);
      } else {
        this.$text = new TextDecoder().decode(this.$bytes);
        this.$bytes = undefined;
      }
    }
    return this.$text;
  }

  setBytes(bytes: Uint8Array) {
    this.original = false;
    this.modified = true;
    this.$bytes = bytes;
    this.$text = undefined;
  }
  setText(text: string) {
    this.original = false;
    this.modified = true;
    this.$bytes = undefined;
    this.$text = text;
  }

  resetBytes() {
    this.original = true;
    this.modified = false;
    this.$bytes = undefined;
    this.$text = undefined;
  }

  async write() {
    const data = this.$text !== undefined ? this.$text : await this.getBytes();
    await this.project_manager.platform.File.write(this.project_manager.out_dir.appendSegment(this.relative_path).newExt(this.out_ext).path, data);
  }

  toString() {
    return this.src_path;
  }
}
