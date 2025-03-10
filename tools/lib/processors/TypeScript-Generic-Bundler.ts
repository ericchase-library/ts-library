import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

type BuildConfig = Pick<Parameters<typeof Bun.build>[0], 'external' | 'sourcemap' | 'target'>;

export class Processor_TypeScriptGenericBundler implements ProcessorModule {
  config: Parameters<typeof Bun.build>[0];

  constructor({ external = [], sourcemap = 'linked', target = 'browser' }: BuildConfig) {
    this.config = {
      entrypoints: [],
      external: ['*.module.js', ...(external ?? [])],
      format: 'esm',
      minify: {
        identifiers: false,
        syntax: false,
        whitespace: false,
      },
      sourcemap: sourcemap ?? 'none',
      target: target ?? 'browser',
    };
  }

  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>) {
    for (const file of files) {
      if (file.src_path.endsWith('.module.ts') === false) {
        continue;
      }

      file.out_path.ext = '.js';
      file.$processor_list.push(async (builder, file) => {
        this.config.entrypoints = [file.src_path.raw];
        const build_results = await Bun.build(this.config);
        if (build_results.success === true) {
          for (const artifact of build_results.outputs) {
            switch (artifact.kind) {
              case 'entry-point':
                {
                  const text = await artifact.text();
                  file.setText(text);
                  for (const [, ...paths] of text.matchAll(/\n?\/\/ src\/(.*)\n?/g)) {
                    for (const path of paths) {
                      builder.addDependency(builder.getFile(Path(path)), file);
                    }
                  }
                }
                break;
              case 'sourcemap':
                // TODO: add virtual file to project manager
                // await Bun.write(file.out_file.newBase(new Path(artifact.path).base).path, await artifact.text());
                break;
            }
          }
        } else {
          ConsoleError(`ERROR: Processor: ${__filename}, File: ${file.src_path}`);
          for (const log of build_results.logs) {
            ConsoleLog(log.message);
          }
          ConsoleLog();
        }
      });
    }
  }

  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}
}
