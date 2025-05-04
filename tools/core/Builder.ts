import { Core } from '../../src/lib/ericchase/core.js';
import { BunPlatform } from '../../src/lib/ericchase/platform-bun.js';
import { NODE_FS, NodePlatform } from '../../src/lib/ericchase/platform-node.js';
import { CACHELOCK, FILESTATS } from './Cacher.js';
import { AddLoggerOutputDirectory, Logger } from './Logger.js';

await AddLoggerOutputDirectory('cache');

class ClassRawPath {
  value: string;
  constructor(...paths: string[]) {
    this.value = NodePlatform.Path.Join(...paths);
  }
  toStandard() {
    return NodePlatform.Path.JoinStandard(this.value);
  }
}
class ClassRefCounter {
  protected ref_set = new Set<object>();
  protected onzerorefs_callback_set = new Set<() => void>();
  getRef() {
    const ref = {};
    this.ref_set.add(ref);
    return () => {
      if (this.ref_set.delete(ref) && this.ref_set.size === 0) {
        for (const callback of this.onzerorefs_callback_set) {
          this.onzerorefs_callback_set.delete(callback);
          callback();
        }
      }
    };
  }
  onZeroRefs(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.ref_set.size > 0) {
        this.onzerorefs_callback_set.add(() => resolve());
      } else {
        resolve();
      }
    });
  }
}

export function Builder(options?: { mode?: Builder.BUILD_MODE; verbosity?: Builder.LOG_VERBOSITY }) {
  return new Builder.Class(options);
}

export namespace Builder {
  export enum BUILD_MODE {
    BUILD,
    DEV,
  }
  export enum LOG_VERBOSITY {
    _0_ERROR,
    _1_LOG,
    _2_DEBUG,
  }
  export type ProcessorMethod = (builder: Internal, file: SourceFile) => Promise<void>;
  export interface Processor {
    ProcessorName: string;
    onStartUp?: (builder: Internal) => Promise<void>;
    onAdd?: (builder: Internal, files: Set<SourceFile>) => Promise<void>;
    onRemove?: (builder: Internal, files: Set<SourceFile>) => Promise<void>;
    onCleanUp?: (builder: Internal) => Promise<void>;
  }
  export interface Step {
    StepName: string;
    onStartUp?: (builder: Internal) => Promise<void>;
    onRun?: (builder: Internal) => Promise<void>;
    onCleanUp?: (builder: Internal) => Promise<void>;
  }
  export function RawPath(...paths: string[]) {
    return new ClassRawPath(...paths);
  }
  export class Class {
    $internal = new Internal(this);

    constructor(options?: { mode?: BUILD_MODE; verbosity?: LOG_VERBOSITY }) {
      if (options?.mode !== undefined) {
        this.$internal.buildmode = options.mode;
      }
      if (options?.verbosity !== undefined) {
        this.$internal.verbosity = options.verbosity;
      }
    }

    dir = this.$internal.dir;
    watchmode = this.$internal.buildmode;
    verbosity = this.$internal.verbosity;

    setStartUpSteps(...steps: Step[]): void {
      this.$internal.startup_steps = steps;
    }
    setBeforeProcessingSteps(...steps: Step[]): void {
      this.$internal.before_steps = steps;
    }
    setProcessorModules(...modules: Processor[]): void {
      this.$internal.processor_modules = modules;
    }
    setAfterProcessingSteps(...steps: Step[]): void {
      this.$internal.after_steps = steps;
    }
    setCleanUpSteps(...steps: Step[]): void {
      this.$internal.cleanup_steps = steps;
    }

    async start(): Promise<void> {
      await this.$internal.start();
    }
  }
  export class Internal {
    channel = Logger('Builder').newChannel();

    constructor(public external: Class) {}

    buildmode = BUILD_MODE.BUILD;
    verbosity = LOG_VERBOSITY._1_LOG;

    // Directories

    dir = {
      lib: 'src/lib',
      out: 'out',
      src: 'src',
      tools: 'tools',
    };

    // Build Steps & Processor Modules

    startup_steps: Step[] = [];
    before_steps: Step[] = [];
    processor_modules: Processor[] = [];
    after_steps: Step[] = [];
    cleanup_steps: Step[] = [];

    get all_steps() {
      return [...this.startup_steps, ...this.before_steps, ...this.after_steps, ...this.cleanup_steps];
    }

    // Dependencies

    $map_downstream_to_upstream = new Map<SourceFile, Set<SourceFile>>();
    $map_upstream_to_downstream = new Map<SourceFile, Set<SourceFile>>();

    addDependency(upstream: SourceFile, downstream: SourceFile) {
      if (upstream === downstream) {
        const msg = `dependency cycle "${upstream.src_path.value}": a file cannot depend on itself`;
        this.channel.error(msg);
        throw new Error(msg);
      }
      if (this.$map_downstream_to_upstream.get(upstream)?.has(downstream)) {
        const msg = `dependency cycle between upstream "${upstream.src_path.value}" and downstream "${downstream.src_path.value}"`;
        this.channel.error(msg);
        throw new Error(msg);
      }
      Core.Map.GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<SourceFile>()).add(upstream);
      Core.Map.GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<SourceFile>()).add(downstream);
    }
    removeDependency(upstream: SourceFile, downstream: SourceFile) {
      Core.Map.GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<SourceFile>()).delete(upstream);
      Core.Map.GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<SourceFile>()).delete(downstream);
    }
    getDownstream(file: SourceFile): Set<SourceFile> {
      return this.$map_upstream_to_downstream.get(file) ?? new Set();
    }
    getUpstream(file: SourceFile): Set<SourceFile> {
      return this.$map_downstream_to_upstream.get(file) ?? new Set();
    }

    // Files & Paths

    $set_files = new Set<SourceFile>();
    // raw src paths
    $set_paths = new Set<string>();
    // raw src paths to project files
    $map_path_to_file = new Map<string, SourceFile>();

    get files(): Set<SourceFile> {
      return new Set(this.$set_files);
    }
    get paths(): Set<string> {
      return new Set(this.$set_paths);
    }
    hasFile(project_file: SourceFile): boolean {
      // @debug-start
      const stored_file = this.$map_path_to_file.get(project_file.src_path.value);
      if (stored_file !== undefined && stored_file !== project_file) {
        throw new Error(`file "${project_file.src_path.value}" different from stored file "${stored_file.src_path.value}"`);
      }
      // @debug-end
      return this.$map_path_to_file.has(project_file.src_path.value);
    }
    hasPath(src_path: ClassRawPath): boolean {
      return this.$map_path_to_file.has(src_path.value);
    }
    getFile(src_path: ClassRawPath): SourceFile {
      const project_file = this.$map_path_to_file.get(src_path.value);
      if (project_file === undefined) {
        throw new Error(`file "${src_path.value}" does not exist`);
      }
      return project_file;
    }

    addPath(src_path: ClassRawPath, out_path: ClassRawPath) {
      // @debug-start
      if (this.$map_path_to_file.has(src_path.value)) {
        throw new Error(`file "${src_path.value}" already added`);
      }
      // @debug-end
      const file = new SourceFile(this, src_path, out_path);
      this.$map_path_to_file.set(src_path.value, file);
      this.$set_files.add(file);
      this.$set_paths.add(src_path.value);
      this.$set_unprocessed_added_files.add(file);
      return file;
    }
    removePath(src_path: ClassRawPath) {
      // @debug-start
      if (this.$map_path_to_file.has(src_path.value) === false) {
        throw new Error(`file "${src_path.value}" already removed`);
      }
      // @debug-end
      const file = this.getFile(src_path);
      this.$map_path_to_file.delete(src_path.value);
      this.$set_files.delete(file);
      this.$set_paths.delete(src_path.value);
      this.$set_unprocessed_removed_files.add(file);
      for (const upstream of this.$map_downstream_to_upstream.get(file) ?? []) {
        this.removeDependency(upstream, file);
      }
      for (const downstream of this.$map_upstream_to_downstream.get(file) ?? []) {
        this.removeDependency(file, downstream);
      }
      this.$map_downstream_to_upstream.delete(file);
      this.$map_upstream_to_downstream.delete(file);
      return file;
    }
    updatePath(src_path: ClassRawPath) {
      const file = this.getFile(src_path);
      this.$set_unprocessed_updated_files.add(file);
      return file;
    }

    refreshFile(file: SourceFile) {
      this.$set_unprocessed_added_files.add(file); // trigger a first run
      this.$set_unprocessed_updated_files.add(file);
    }
    updateFile(file: SourceFile) {
      this.$set_unprocessed_updated_files.add(file);
    }

    // Source Watcher

    $unwatchSource?: () => void;
    async getStats(path: ClassRawPath): Promise<NODE_FS.Stats | undefined> {
      try {
        return await NodePlatform.Path.Async_GetStats(path.value);
      } catch (error) {
        return undefined;
      }
    }
    setupSourceWatcher() {
      if (this.$unwatchSource === undefined) {
        const event_paths = new Set<string>();
        const processEvents = Core.Utility.Debounce(async () => {
          const releaseRef = this.$idle.getRef();

          // copy the set and clear it
          const event_paths_copy = new Set(event_paths);
          event_paths.clear();

          for (const path of event_paths_copy) {
            const src_path = new ClassRawPath(this.dir.src, path);
            const stats = await this.getStats(src_path);
            if (stats?.isFile() === true) {
              if (this.hasPath(src_path)) {
                this.updatePath(src_path);
              } else {
                this.addPath(src_path, new ClassRawPath(this.dir.out, path));
              }
            }
          }

          const scan_paths = new Set(await Array.fromAsync(BunPlatform.Glob.AsyncGen_Scan('./', `${NodePlatform.Path.JoinStandard(this.dir.src)}**/*`)));
          const this_paths = new Set(Array.from(this.$map_path_to_file.keys()).map((str) => NodePlatform.Path.Join(str)));
          for (const path of scan_paths.difference(this_paths)) {
            this.addPath(new ClassRawPath(path), new ClassRawPath(this.dir.out, NodePlatform.Path.Slice(path, 1)));
          }
          for (const path of this_paths.difference(scan_paths)) {
            this.removePath(new ClassRawPath(path));
          }

          // process files
          await this.$processUnprocessedFiles();

          releaseRef();
        }, 100);
        this.$unwatchSource = NodePlatform.Directory.Watch(this.dir.src, (event, path) => {
          event_paths.add(path);
          Core.Promise.Orphan(processEvents());
        });
        if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
          this.channel.log(`Watching "${this.dir.src}"`);
        }
      }
    }

    // Processing

    $idle = new ClassRefCounter();

    $set_unprocessed_added_files = new Set<SourceFile>();
    $set_unprocessed_removed_files = new Set<SourceFile>();
    $set_unprocessed_updated_files = new Set<SourceFile>();

    async start() {
      // Grab Locks
      FILESTATS.LockTable();
      CACHELOCK.TryLockEach(['Build', 'Format']);

      try {
        const releaseRef = this.$idle.getRef();

        for await (const path of BunPlatform.Glob.AsyncGen_Scan(this.dir.src, '**/*')) {
          this.addPath(new ClassRawPath(this.dir.src, path), new ClassRawPath(this.dir.out, path));
        }

        if (this.buildmode === BUILD_MODE.DEV) {
          // Setup Source Watcher
          this.setupSourceWatcher();
          // Setup Stdin Reader
          const releaseStdIn = NodePlatform.Shell.StdIn.LockReader();
          NodePlatform.Shell.StdIn.AddListener(async (bytes, text, removeSelf) => {
            if (text === 'q') {
              removeSelf();
              if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
                this.channel.log('User Command: Quit');
              }
              await this.$idle.onZeroRefs();
              this.$unwatchSource?.();
              await this.$runCleanUpPhase();
              // Release Locks
              CACHELOCK.UnlockEach(['Build', 'Format']);
              FILESTATS.UnlockTable();
              releaseStdIn();
            }
          });
          NodePlatform.Shell.StdIn.AddListener(async (bytes, text, removeSelf) => {
            if (text === NodePlatform.Shell.KEYS.SIGINT) {
              removeSelf();
              if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
                this.channel.log('User Command: Force Quit');
              }
              this.$unwatchSource?.();
              releaseStdIn();
              process.exit();
            }
          });
          NodePlatform.Shell.StdIn.StartReaderInRawMode();
        }

        await this.$runStartUpPhase();

        // Processor Modules
        await this.$processUnprocessedFiles();

        if (this.buildmode === BUILD_MODE.BUILD) {
          await this.$runCleanUpPhase();
          // Release Locks
          CACHELOCK.UnlockEach(['Build', 'Format']);
          FILESTATS.UnlockTable();
        }

        releaseRef();
      } catch (error) {
        this.channel.error(error, 'Unhandled exception in Builder:');
        throw error;
      }
    }

    async $runStartUpPhase() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] StartUp');
      }
      // All Steps onStartUp
      for (const step of this.all_steps) {
        await this.safe_step_onStartUp(step);
      }
      // StartUp Steps onRun
      for (const step of this.startup_steps) {
        await this.safe_step_onRun(step);
      }
      // All Processors onStartUp
      for (const processor of this.processor_modules) {
        await this.safe_processor_onStartUp(processor);
      }
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] StartUp\n...');
      }
    }

    async $runCleanUpPhase() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] CleanUp');
      }
      // All Processors onCleanUp
      for (const processor of this.processor_modules) {
        await this.safe_processor_onCleanUp(processor);
      }
      // CleanUp Steps onRun
      for (const step of this.cleanup_steps) {
        await this.safe_step_onRun(step);
      }
      // All Steps onCleanUp
      for (const step of this.all_steps) {
        await this.safe_step_onCleanUp(step);
      }
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] CleanUp');
      }
    }

    async $processUnprocessedFiles() {
      if (this.processor_modules.length > 0) {
        if (this.$set_unprocessed_removed_files.size > 0) {
          await this.$processRemovedFiles();
        }
        if (this.$set_unprocessed_added_files.size > 0) {
          await this.$processAddedFiles();
        }
      }
      for (const step of this.before_steps) {
        await this.safe_step_onRun(step);
      }
      if (this.processor_modules.length > 0) {
        if (this.$set_unprocessed_updated_files.size > 0) {
          await this.$processUpdatedFiles();
        }
      }
      for (const step of this.after_steps) {
        await this.safe_step_onRun(step);
      }
    }

    // always call processUpdatedFiles after this
    async $processAddedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Added Files');
      }
      for (const processor of this.processor_modules) {
        await this.safe_processor_onAdd(processor);
      }
      const tasks: Promise<void>[] = [];
      for (const file of this.$set_unprocessed_added_files) {
        tasks.push(this.firstRunProcessorList(file));
      }
      await Promise.all(tasks);
      this.$set_unprocessed_added_files.clear();
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Added Files\n...');
      }
    }

    // always call processUpdatedFiles after this
    async $processRemovedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Removed Files');
      }
      for (const processor of this.processor_modules) {
        await this.safe_processor_onRemove(processor);
      }
      this.$set_unprocessed_removed_files.clear();
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Removed Files\n...');
      }
    }

    async $processUpdatedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Updated Files');
      }
      const defers = new Map<SourceFile, Core.Utility.Class_Defer<void>>();
      // add defers for updated file and all downstream files
      for (const file of this.$set_unprocessed_updated_files) {
        if (defers.has(file) === false) {
          defers.set(file, Core.Utility.Class_Defer());
        }
        for (const downstream of this.getDownstream(file)) {
          if (defers.has(downstream) === false) {
            defers.set(downstream, Core.Utility.Class_Defer());
          }
        }
      }
      // wait on all upstream defers
      const tasks: Promise<void>[] = [];
      for (const [file, defer] of defers) {
        const waitlist: Promise<void>[] = [];
        for (const upstream of this.getUpstream(file)) {
          const upstream_defer = defers.get(upstream);
          if (upstream_defer) {
            if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
              this.channel.log(`${file.src_path.value} waiting on ${upstream.src_path.value}`);
            }
            waitlist.push(upstream_defer.promise);
          }
        }
        tasks.push(this.runProcessorList(file, waitlist, defer));
      }
      if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
        this.channel.log('[Phase] Process Updated Files [waiting]');
      }
      await Promise.all(tasks);
      this.$set_unprocessed_updated_files.clear();
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('[Phase] Process Updated Files\n...');
      }
    }

    async firstRunProcessorList(file: SourceFile) {
      file.resetBytes();
      for (const { processor, method } of file.$processor_list) {
        await this.safe_processor_onProcess(processor, method, file);
      }
    }

    async runProcessorList(file: SourceFile, waitlist: Promise<void>[], defer?: Core.Utility.Class_Defer<void>) {
      if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
        this.channel.log(`[waiting] ${file.src_path.value}`);
      }
      await Promise.all(waitlist);
      file.resetBytes();
      for (const { processor, method } of file.$processor_list) {
        await this.safe_processor_onProcess(processor, method, file);
      }
      defer?.resolve();
      if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
        this.channel.log(`[done] ${file.src_path.value}`);
      }
    }

    // safe functions for catching errors. write your own if you want them

    private async safe_processor_onStartUp(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${processor.ProcessorName} onStartUp`);
        }
        await processor.onStartUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onStartUp:`);
      }
    }
    private async safe_processor_onAdd(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${processor.ProcessorName} onAdd`);
        }
        await processor.onAdd?.(this, this.$set_unprocessed_added_files);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onAdd:`);
      }
    }
    private async safe_processor_onProcess(processor: Processor, method: ProcessorMethod, file: SourceFile) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${processor.ProcessorName} for "${file.src_path.value}"`);
        }
        await method.call(processor, this, file);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} for "${file.src_path.value}":`);
      }
    }
    private async safe_processor_onRemove(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${processor.ProcessorName} onRemove`);
        }
        await processor.onRemove?.(this, this.$set_unprocessed_removed_files);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onRemove:`);
      }
    }
    private async safe_processor_onCleanUp(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${processor.ProcessorName} onCleanUp`);
        }
        await processor.onCleanUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onCleanUp:`);
      }
    }

    private async safe_step_onStartUp(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${step.StepName} onStartUp`);
        }
        await step.onStartUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onStartUp:`);
      }
    }
    private async safe_step_onRun(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${step.StepName} onRun`);
        }
        await step.onRun?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onRun:`);
      }
    }
    private async safe_step_onCleanUp(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(`  ${step.StepName} onCleanUp`);
        }
        await step.onCleanUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onCleanUp:`);
      }
    }
  }
  export class SourceFile {
    constructor(
      public builder: Internal,
      public src_path: ClassRawPath,
      public out_path: ClassRawPath,
    ) {}

    $processor_list: { processor: Processor; method: ProcessorMethod }[] = [];
    addProcessor(processor: Processor, method: ProcessorMethod): void {
      this.$processor_list.push({ processor, method });
    }

    /** When true, file contents have been modified during the current processing phase. */
    ismodified = false;
    /** When false, $bytes/$text are no longer from the original file. */
    isoriginal = true;

    $bytes?: Uint8Array;
    $text?: string;

    // Get cached contents or contents from file on disk as Uint8Array.
    async getBytes(): Promise<Uint8Array> {
      if (this.$bytes === undefined) {
        if (this.$text === undefined) {
          this.$bytes = await BunPlatform.File.Async_ReadBytes(this.src_path.value);
        } else {
          this.$bytes = new TextEncoder().encode(this.$text);
          this.$text = undefined;
        }
      }
      return this.$bytes;
    }
    // Get cached contents or contents from file on disk as string.
    async getText(): Promise<string> {
      if (this.$text === undefined) {
        if (this.$bytes === undefined) {
          this.$text = await BunPlatform.File.Async_ReadText(this.src_path.value);
        } else {
          this.$text = new TextDecoder().decode(this.$bytes);
          this.$bytes = undefined;
        }
      }
      return this.$text;
    }

    // Set cached contents to Uint8Array.
    setBytes(bytes: Uint8Array) {
      this.isoriginal = false;
      this.ismodified = true;
      this.$bytes = bytes;
      this.$text = undefined;
      this.builder.updateFile(this);
    }
    // Set cached contents to string.
    setText(text: string) {
      this.isoriginal = false;
      this.ismodified = true;
      this.$bytes = undefined;
      this.$text = text;
      this.builder.updateFile(this);
    }

    // Clears the cached contents and resets attributes.
    resetBytes() {
      this.isoriginal = true;
      this.ismodified = false;
      this.$bytes = undefined;
      this.$text = undefined;
    }

    // Attempts to write cached contents to file on disk.
    // Returns number of bytes written.
    async write(): Promise<number> {
      let byteswritten = 0;
      if (this.$text !== undefined) {
        byteswritten = await BunPlatform.File.Async_WriteText(this.out_path.value, this.$text);
      } else {
        byteswritten = await BunPlatform.File.Async_WriteBytes(this.out_path.value, await this.getBytes());
      }
      return byteswritten;
    }

    // Useful for some console log coercion.
    toString(): string {
      return this.src_path.toString();
    }
  }
}
