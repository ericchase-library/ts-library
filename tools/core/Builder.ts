import { Core_Map_GetOrDefault, Core_Promise_Orphan, Core_Utility_Debounce } from '../../src/lib/ericchase/core.js';
import { BunPlatform_File_Async_ReadBytes, BunPlatform_File_Async_ReadText, BunPlatform_File_Async_WriteBytes, BunPlatform_File_Async_WriteText, BunPlatform_Glob_AsyncGen_Scan } from '../../src/lib/ericchase/platform-bun.js';
import {
  NODE_FS,
  NodePlatform_Directory_Watch,
  NodePlatform_Path_Async_GetStats,
  NodePlatform_Path_Join,
  NodePlatform_Path_JoinStandard,
  NodePlatform_Path_Slice,
  NodePlatform_Shell_Keys,
  NodePlatform_Shell_StdIn_AddListener,
  NodePlatform_Shell_StdIn_LockReader,
  NodePlatform_Shell_StdIn_StartReaderInRawMode,
} from '../../src/lib/ericchase/platform-node.js';
import { CACHELOCK, FILESTATS } from './Cacher.js';
import { AddLoggerOutputDirectory, Logger, WaitForLogger } from './Logger.js';

await AddLoggerOutputDirectory('cache');

class ClassRawPath {
  value: string;
  constructor(...paths: string[]) {
    this.value = NodePlatform_Path_Join(...paths);
  }
  toStandard() {
    return NodePlatform_Path_JoinStandard(this.value);
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
  namespace logs {
    export const _file_added_ = (p0: string) => `[add] "${p0}"`;
    export const _file_refreshed_ = (p0: string) => `[refresh] "${p0}"`;
    export const _file_removed_ = (p0: string) => `[remov] "${p0}"`;
    export const _file_updated_ = (p0: string) => `[update] "${p0}"`;
    export const _phase_begin_ = (p0: string) => `[begin] ${p0}`;
    export const _phase_end_ = (p0: string) => `[end] ${p0}`;
    export const _processor_onadd_ = (p0: string) => `[onAdd] ${p0}`;
    export const _processor_oncleanup_ = (p0: string) => `[onCleanUp] ${p0}`;
    export const _processor_onprocess_ = (p0: string, p1: string) => `[onProcess] ${p0} [for] "${p1}"`;
    export const _processor_onremove_ = (p0: string) => `[onRemove] ${p0}`;
    export const _processor_onstartup_ = (p0: string) => `[onStartUp] ${p0}`;
    export const _step_oncleanup_ = (p0: string) => `[onCleanUp] ${p0}`;
    export const _step_onrun_ = (p0: string) => `[onRun] ${p0}`;
    export const _step_onstartup_ = (p0: string) => `[onStartUp] ${p0}`;
    export const _user_command_ = (p0: string) => `[command] "${p0}"`;
    export const _watching_dir_ = (p0: string) => `[watch] "${p0}"`;
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
        this.channel.error(`dependency cycle "${upstream.src_path.value}": a file cannot depend on itself`);
        throw new Error();
      }
      if (this.$map_downstream_to_upstream.get(upstream)?.has(downstream)) {
        this.channel.error(`dependency cycle between upstream "${upstream.src_path.value}" and downstream "${downstream.src_path.value}"`);
        throw new Error();
      }
      Core_Map_GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<SourceFile>()).add(upstream);
      Core_Map_GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<SourceFile>()).add(downstream);
    }
    removeDependency(upstream: SourceFile, downstream: SourceFile) {
      Core_Map_GetOrDefault(this.$map_downstream_to_upstream, downstream, () => new Set<SourceFile>()).delete(upstream);
      Core_Map_GetOrDefault(this.$map_upstream_to_downstream, upstream, () => new Set<SourceFile>()).delete(downstream);
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
    hasFile(file: SourceFile): boolean {
      // @debug-start
      const stored_file = this.$map_path_to_file.get(file.src_path.value);
      if (stored_file !== undefined && stored_file !== file) {
        this.channel.error(`file "${file.src_path.value}" different from stored file "${stored_file.src_path.value}"`);
        throw new Error();
      }
      // @debug-end
      return this.$map_path_to_file.has(file.src_path.value);
    }
    hasPath(src_path: ClassRawPath): boolean {
      return this.$map_path_to_file.has(src_path.value);
    }
    getFile(src_path: ClassRawPath): SourceFile {
      const project_file = this.$map_path_to_file.get(src_path.value);
      if (project_file === undefined) {
        this.channel.error(`file "${src_path.value}" does not exist`);
        throw new Error();
      }
      return project_file;
    }

    addPath(src_path: ClassRawPath, out_path: ClassRawPath) {
      // @debug-start
      if (this.$map_path_to_file.has(src_path.value)) {
        this.channel.error(`file "${src_path.value}" already added`);
        throw new Error();
      }
      // @debug-end
      const file = new SourceFile(this, src_path, out_path);
      this.$map_path_to_file.set(src_path.value, file);
      this.$set_files.add(file);
      this.$set_paths.add(src_path.value);
      this.$set_unprocessed_added_files.add(file);
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._file_added_(src_path.value));
      }
      return file;
    }
    removePath(src_path: ClassRawPath) {
      // @debug-start
      if (this.$map_path_to_file.has(src_path.value) === false) {
        this.channel.error(`file "${src_path.value}" already removed`);
        throw new Error();
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
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._file_removed_(src_path.value));
      }
      return file;
    }
    updatePath(src_path: ClassRawPath) {
      const file = this.getFile(src_path);
      this.$set_unprocessed_updated_files.add(file);
      this.channel.log(logs._file_updated_(src_path.value));
      return file;
    }

    refreshFile(file: SourceFile) {
      this.$set_unprocessed_added_files.add(file); // trigger a first run
      this.$set_unprocessed_updated_files.add(file);
      // this.channel.log(logs._file_refreshed_(file.src_path.value));
    }
    updateFile(file: SourceFile) {
      this.$set_unprocessed_updated_files.add(file);
      // this.channel.log(logs._file_updated_file_(file.src_path.value));
    }

    // Source Watcher

    $unwatchSource?: () => void;
    async getStats(path: ClassRawPath): Promise<NODE_FS.Stats | undefined> {
      try {
        return await NodePlatform_Path_Async_GetStats(path.value);
      } catch (error) {
        return undefined;
      }
    }
    setupSourceWatcher() {
      if (this.$unwatchSource === undefined) {
        const event_paths = new Set<string>();
        const processEvents = Core_Utility_Debounce(async () => {
          const releaseRef = this.$idle.getRef();

          // copy the set and clear it
          const event_paths_copy = new Set(event_paths);
          event_paths.clear();

          for (const path of event_paths_copy) {
            const src_path = RawPath(this.dir.src, path);
            const stats = await this.getStats(src_path);
            if (stats?.isFile() === true) {
              if (this.hasPath(src_path)) {
                console.log('updating', src_path.value);
                this.updatePath(src_path);
              } else {
                console.log('adding', src_path.value);
                this.addPath(src_path, RawPath(this.dir.out, path));
              }
            }
          }

          const scan_paths = new Set<string>();
          for await (const path of BunPlatform_Glob_AsyncGen_Scan('./', RawPath(`${this.dir.src}/**/*`).toStandard())) {
            scan_paths.add(path);
            if (this.$map_path_to_file.has(path) === false) {
              this.addPath(RawPath(path), RawPath(this.dir.out, NodePlatform_Path_Slice(path, 1)));
            }
          }
          for (const [path] of this.$map_path_to_file) {
            if (scan_paths.has(path) === false) {
              this.removePath(RawPath(path));
            }
          }

          // Process Files
          await this.$processUnprocessedFiles();

          releaseRef();
        }, 100);
        this.$unwatchSource = NodePlatform_Directory_Watch(this.dir.src, (event, path) => {
          event_paths.add(path);
          Core_Promise_Orphan(processEvents());
        });
        if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
          this.channel.log(logs._watching_dir_(this.dir.src));
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

        for await (const path of BunPlatform_Glob_AsyncGen_Scan(this.dir.src, '**/*')) {
          this.addPath(new ClassRawPath(this.dir.src, path), new ClassRawPath(this.dir.out, path));
        }

        if (this.buildmode === BUILD_MODE.DEV) {
          // Setup Source Watcher
          this.setupSourceWatcher();
          // Setup Stdin Reader
          const releaseStdIn = NodePlatform_Shell_StdIn_LockReader();
          NodePlatform_Shell_StdIn_AddListener(async (bytes, text, removeSelf) => {
            if (text === 'q') {
              removeSelf();
              if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
                this.channel.log(logs._user_command_('Quit'));
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
          NodePlatform_Shell_StdIn_AddListener((bytes, text, removeSelf) => {
            if (text === NodePlatform_Shell_Keys.SIGINT) {
              removeSelf();
              if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
                this.channel.log(logs._user_command_('Force Quit'));
              }
              this.$unwatchSource?.();
              releaseStdIn();
              process.exit();
            }
          });
          NodePlatform_Shell_StdIn_StartReaderInRawMode();
        }

        await this.$runStartUpPhase();

        // Process Files
        await this.$processUnprocessedFiles();

        if (this.buildmode === BUILD_MODE.BUILD) {
          await this.$runCleanUpPhase();
          // Release Locks
          CACHELOCK.UnlockEach(['Build', 'Format']);
          FILESTATS.UnlockTable();
        }

        releaseRef();
      } catch (error) {
        await WaitForLogger();
        throw 'Errors during build. Check logs.';
      }
    }

    async $runStartUpPhase() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log('...');
        this.channel.log(logs._phase_begin_('StartUp'));
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
        this.channel.log(logs._phase_end_('StartUp'));
        this.channel.log('...');
      }
    }

    async $runCleanUpPhase() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_begin_('CleanUp'));
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
        this.channel.log(logs._phase_end_('CleanUp'));
        this.channel.log('...');
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
      this.channel.newLine();
    }

    // always call processUpdatedFiles after this
    async $processAddedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_begin_('Process Added Files'));
      }
      const unprocessed_set = new Set(this.$set_unprocessed_added_files);
      this.$set_unprocessed_added_files.clear();
      for (const processor of this.processor_modules) {
        await this.safe_processor_onAdd(processor, unprocessed_set);
      }
      const tasks: Promise<void>[] = [];

      for (const file of unprocessed_set) {
        file.resetBytes();
        for (const { processor, method } of file.$processor_list) {
          await this.safe_processor_onProcess(processor, method, file);
        }
      }
      await Promise.allSettled(tasks);
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_end_('Process Added Files'));
        this.channel.log('...');
      }
    }

    // always call processUpdatedFiles after this
    async $processRemovedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_begin_('Process Removed Files'));
      }
      const unprocessed_set = new Set(this.$set_unprocessed_removed_files);
      this.$set_unprocessed_removed_files.clear();
      for (const processor of this.processor_modules) {
        await this.safe_processor_onRemove(processor, unprocessed_set);
      }
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_end_('Process Removed Files'));
        this.channel.log('...');
      }
    }

    async $processUpdatedFiles() {
      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_begin_('Process Updated Files'));
      }

      const unprocessed_file_set: Set<SourceFile> = (() => {
        const set = new Set<SourceFile>();
        for (const file of this.$set_unprocessed_updated_files) {
          set.add(file);
          for (const downstream_file of this.getDownstream(file)) {
            set.add(downstream_file);
          }
        }
        this.$set_unprocessed_updated_files.clear();
        return set;
      })();

      const checkcount_map = new Map<SourceFile, number>();
      while (unprocessed_file_set.size > 0) {
        outer: for (const file of unprocessed_file_set) {
          checkcount_map.set(file, Core_Map_GetOrDefault(checkcount_map, file, () => 0) + 1);
          for (const upstream of this.getUpstream(file)) {
            if (unprocessed_file_set.has(upstream)) {
              continue outer;
            }
          }
          file.resetBytes();
          for (const { processor, method } of file.$processor_list) {
            await this.safe_processor_onProcess(processor, method, file);
          }
          unprocessed_file_set.delete(file);
        }
      }
      if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
        this.channel.log('  Dependency Tree Check Counter');
        for (const [file, count] of checkcount_map) {
          this.channel.log(`  - ${count.toString().padStart(2, '0')} "${file.src_path.value}"`);
        }
      }

      if (this.verbosity >= LOG_VERBOSITY._1_LOG) {
        this.channel.log(logs._phase_end_('Process Updated Files'));
        this.channel.log('...');
      }
    }

    private async safe_processor_onStartUp(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._processor_onstartup_(processor.ProcessorName));
        }
        await processor.onStartUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onStartUp:`);
        throw new Error();
      }
    }
    private async safe_processor_onAdd(processor: Processor, unprocessed_set: Set<SourceFile>) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._processor_onadd_(processor.ProcessorName));
        }
        await processor.onAdd?.(this, unprocessed_set);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onAdd:`);
        throw new Error();
      }
    }
    private async safe_processor_onProcess(processor: Processor, method: ProcessorMethod, file: SourceFile) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._processor_onprocess_(processor.ProcessorName, file.src_path.value));
        }
        await method.call(processor, this, file);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} for "${file.src_path.value}":`);
        throw new Error();
      }
    }
    private async safe_processor_onRemove(processor: Processor, unprocessed_set: Set<SourceFile>) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._processor_onremove_(processor.ProcessorName));
        }
        await processor.onRemove?.(this, unprocessed_set);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onRemove:`);
        throw new Error();
      }
    }
    private async safe_processor_onCleanUp(processor: Processor) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._processor_oncleanup_(processor.ProcessorName));
        }
        await processor.onCleanUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${processor.ProcessorName} onCleanUp:`);
        throw new Error();
      }
    }

    private async safe_step_onStartUp(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._step_onstartup_(step.StepName));
        }
        await step.onStartUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onStartUp:`);
        throw new Error();
      }
    }
    private async safe_step_onRun(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._step_onrun_(step.StepName));
        }
        await step.onRun?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onRun:`);
        throw new Error();
      }
    }
    private async safe_step_onCleanUp(step: Step) {
      try {
        if (this.verbosity >= LOG_VERBOSITY._2_DEBUG) {
          this.channel.log(logs._step_oncleanup_(step.StepName));
        }
        await step.onCleanUp?.(this);
      } catch (error) {
        this.channel.error(error, `Unhandled exception in ${step.StepName} onCleanUp:`);
        throw new Error();
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
          this.$bytes = await BunPlatform_File_Async_ReadBytes(this.src_path.value);
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
          this.$text = await BunPlatform_File_Async_ReadText(this.src_path.value);
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
        byteswritten = await BunPlatform_File_Async_WriteText(this.out_path.value, this.$text);
      } else {
        byteswritten = await BunPlatform_File_Async_WriteBytes(this.out_path.value, await this.getBytes());
      }
      return byteswritten;
    }

    // Useful for some console log coercion.
    toString(): string {
      return this.src_path.toString();
    }
  }
}
