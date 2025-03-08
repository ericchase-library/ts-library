import { BuilderInternal, ProcessorFunction } from 'tools/lib/Builder-Internal.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';

export class ProjectFile {
  constructor(
    public builder: BuilderInternal,
    public src_path: SimplePath,
    public out_path: SimplePath,
  ) {}

  $processor_list: ProcessorFunction[] = [];

  addProcessorFunction(fn: ProcessorFunction): void {
    this.$processor_list.push(fn);
  }

  /** When false, $bytes/$text are no longer from the original file. */
  isoriginal = true;
  /** When true, downstream files need to be processed. */
  ismodified = false;

  $bytes?: Uint8Array;
  $text?: string;

  async getBytes(): Promise<Uint8Array> {
    if (this.$bytes === undefined) {
      if (this.$text === undefined) {
        this.$bytes = await this.builder.platform.File.readBytes(this.src_path);
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
        this.$text = await this.builder.platform.File.readText(this.src_path);
      } else {
        this.$text = new TextDecoder().decode(this.$bytes);
        this.$bytes = undefined;
      }
    }
    return this.$text;
  }

  setBytes(bytes: Uint8Array) {
    this.isoriginal = false;
    this.ismodified = true;
    this.$bytes = bytes;
    this.$text = undefined;
  }
  setText(text: string) {
    this.isoriginal = false;
    this.ismodified = true;
    this.$bytes = undefined;
    this.$text = text;
  }

  resetBytes() {
    this.isoriginal = true;
    this.ismodified = false;
    this.$bytes = undefined;
    this.$text = undefined;
  }

  async write() {
    const data = this.$text !== undefined ? this.$text : await this.getBytes();
    await this.builder.platform.File.write(this.out_path, data);
  }

  toString(): string {
    return this.src_path.toString();
  }
}
