import { BuilderInternal, ProcessorFunction, SimplePath } from 'tools/lib/Builder-Internal.js';

export class ProjectFile {
  readonly isinlib: boolean;

  constructor(
    public builder: BuilderInternal,
    public src_path: SimplePath,
    public out_path: SimplePath,
  ) {
    this.isinlib = src_path.startsWith(builder.dir.lib);
  }

  processor_function_list: ProcessorFunction[] = [];

  /** When false, $bytes/$text are no longer from the original file. */
  original = true;
  /** When true, downstream files need to be processed. */
  modified = false;
  $bytes?: Uint8Array;
  $text?: string;

  async getBytes(): Promise<Uint8Array> {
    if (this.$bytes === undefined) {
      if (this.$text === undefined) {
        this.$bytes = await this.builder.platform.File.readBytes(this.src_path.raw);
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
        this.$text = await this.builder.platform.File.readText(this.src_path.raw);
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
    await this.builder.platform.File.write(this.out_path.raw, data);
  }

  toString() {
    return this.src_path.standard;
  }
}
