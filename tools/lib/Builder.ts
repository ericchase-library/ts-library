import { BuilderInternal, BuildStep, ProcessorModule } from 'tools/lib/Builder-Internal.js';
import { TryLockEach } from 'tools/lib/cache/LockCache.js';
import { AvailableRuntimes, getPlatform, UnimplementedProvider } from 'tools/lib/platform/platform.js';
import { Provider } from 'tools/lib/platform/Provider.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';

export class Builder {
  $internal = new BuilderInternal(this);

  set platform(value: Provider) {
    this.$internal.platform = value;
  }
  get platform() {
    return this.$internal.platform;
  }

  set runtime(value: AvailableRuntimes) {
    this.$internal.runtime = value;
  }
  get runtime() {
    return this.$internal.runtime;
  }

  dir = (() => {
    const builder = this;
    return {
      get out() {
        return builder.$internal.dir.out.raw;
      },
      set out(value: string) {
        builder.$internal.dir.out = new SimplePath(value);
      },
      get src() {
        return builder.$internal.dir.src.raw;
      },
      set src(value: string) {
        builder.$internal.dir.src = new SimplePath(value);
      },
      get lib() {
        return builder.$internal.dir.lib.raw;
      },
      set lib(value: string) {
        builder.$internal.dir.lib = new SimplePath(value);
      },
      get tools() {
        return builder.$internal.dir.tools.raw;
      },
      set tools(value: string) {
        builder.$internal.dir.tools = new SimplePath(value);
      },
    };
  })();

  setStartupSteps(steps: BuildStep[]): void {
    this.$internal.startup_steps = steps;
  }
  setProcessorModules(modules: ProcessorModule[]): void {
    this.$internal.processor_modules = modules;
  }
  setCleanupSteps(steps: BuildStep[]): void {
    this.$internal.cleanup_steps = steps;
  }

  async start(): Promise<void> {
    TryLockEach(['Build', 'Format']);
    if (this.platform === UnimplementedProvider) {
      this.platform = await getPlatform(this.runtime);
    }
    await this.$internal.start();
  }
}
