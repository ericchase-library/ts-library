import { Core } from '../../../src/lib/ericchase/core.js';
import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
import { NODE_PATH, NODE_URL, NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { ClassLogger, Logger } from '../../core/Logger.js';

export const PathPattern = {
  module: '.module{.ts,.tsx,.js,.jsx}',
  iife: '.iife{.ts,.tsx,.js,.jsx}',
  module_or_iife: '{.module,.iife}{.ts,.tsx,.js,.jsx}',
  ts_tsx_js_jsx: '{.ts,.tsx,.js,.jsx}',
};

type Options = Parameters<typeof Bun.build>[0];
interface Config {
  define?: Options['define'] | (() => Options['define']);
  env?: Options['env'];
  external?: Options['external'];
  sourcemap?: Options['sourcemap'];
  target?: Options['target'];
}
interface Extras {
  remap_imports?: boolean;
}

// External pattern cannot contain more than one "*" wildcard.
export function Processor_TypeScript_Generic_Bundler(config?: Config, extras?: Extras): Builder.Processor {
  return new Class(config ?? {}, extras ?? {});
}
class Class implements Builder.Processor {
  ProcessorName = Processor_TypeScript_Generic_Bundler.name;
  channel = Logger(this.ProcessorName).newChannel();

  bundlefile_set = new Set<Builder.SourceFile>();

  constructor(
    readonly config: Config,
    readonly extras: Extras,
  ) {
    this.config.env ??= 'disable';
    this.config.external ??= [];
    this.config.external.push('*.module.js');
    this.config.sourcemap ??= 'none';
    this.config.target ?? 'browser';
  }
  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    let trigger_reprocess = false;
    for (const file of files) {
      const query = file.src_path.toStandard();
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.module}`)) {
        file.out_path.value = NodePlatform.Path.NewExtension(file.out_path.value, '.js');
        file.addProcessor(this, this.onProcessModule);
        this.bundlefile_set.add(file);
        continue;
      }
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.iife}`)) {
        file.out_path.value = NodePlatform.Path.NewExtension(file.out_path.value, '.js');
        file.addProcessor(this, this.onProcessIIFEScript);
        this.bundlefile_set.add(file);
        continue;
      }
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.ts_tsx_js_jsx}`)) {
        trigger_reprocess = true;
      }
    }
    if (trigger_reprocess === true) {
      for (const file of this.bundlefile_set) {
        builder.refreshFile(file);
      }
    }
  }
  async onRemove(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    let trigger_reprocess = false;
    for (const file of files) {
      const query = file.src_path.toStandard();
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.module_or_iife}`)) {
        this.bundlefile_set.delete(file);
        continue;
      }
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.ts_tsx_js_jsx}`)) {
        trigger_reprocess = true;
      }
    }
    if (trigger_reprocess === true) {
      for (const file of this.bundlefile_set) {
        builder.refreshFile(file);
      }
    }
  }

  async onProcessModule(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    await processBuildResults(
      builder,
      file,
      Bun.build({
        define: typeof this.config.define === 'function' ? this.config.define() : this.config.define,
        entrypoints: [file.src_path.value],
        env: this.config.env,
        external: this.config.external,
        format: 'esm',
        minify: {
          identifiers: false,
          syntax: false,
          whitespace: false,
        },
        sourcemap: this.config.sourcemap,
        target: this.config.target,
      }),
      this.channel,
    );
    await remapModuleImports(file, this.channel);
  }

  async onProcessIIFEScript(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    await processBuildResults(
      builder,
      file,
      Bun.build({
        define: typeof this.config.define === 'function' ? this.config.define() : this.config.define,
        entrypoints: [file.src_path.value],
        env: this.config.env,
        format: 'esm',
        minify: {
          identifiers: false,
          syntax: false,
          whitespace: false,
        },
        sourcemap: this.config.sourcemap,
        target: this.config.target,
        // add iife around scripts
        banner: '(() => {\n',
        footer: '})();',
      }),
      this.channel,
    );
  }
}

async function processBuildResults(builder: Builder.Internal, file: Builder.SourceFile, buildtask: Promise<Bun.BuildOutput>, channel: ClassLogger) {
  try {
    const results = await buildtask;
    if (results.success === true) {
      for (const artifact of results.outputs) {
        switch (artifact.kind) {
          case 'entry-point': {
            const text = await artifact.text();
            file.setText(text);
            for (const [, ...paths] of text.matchAll(/\n?\/\/ (src\/.*)\n?/g)) {
              for (const path of paths) {
                const rawpath = Builder.RawPath(path);
                if (file.src_path.value !== rawpath.value) {
                  builder.addDependency(builder.getFile(rawpath), file);
                }
              }
            }
            break;
          }
          // for any non-code imports. there's probably a more elegant
          // way to do this, but this is temporary
          // case 'asset':
          // case 'sourcemap':
          default: {
            const text = await artifact.text();
            await NodePlatform.File.Async_WriteText(NodePlatform.Path.Join(builder.dir.out, artifact.path), text);
          }
        }
      }
    } else {
      channel.error(`File: ${file.src_path.value}, Warnings: [`);
      for (const log of results.logs) {
        channel.error(' ', log);
      }
      channel.error(']');
    }
  } catch (error) {
    channel.error(`File: ${file.src_path.value}, Errors: [`);
    if (error instanceof AggregateError) {
      for (const e of error.errors) {
        channel.error(' ', e);
      }
    } else {
      channel.error(error);
    }
    channel.error(']');
  }
}

async function remapModuleImports(file: Builder.SourceFile, channel: ClassLogger) {
  const text = await file.getText();
  // can't do lines, because import statements will become multiline if long enough
  const list_imports: { start: number; end: number; path: string }[] = [];
  const matches_imports = text.matchAll(/^import[ *{"'][\s\S]*?[ }"']from *["']([^"']*?)["'];$/dgm);
  for (const match of matches_imports) {
    if (match.indices !== undefined) {
      list_imports.push({ start: match.indices[1][0], end: match.indices[1][1], path: match[1] });
    }
  }
  if (list_imports.length > 0) {
    const list_sources: { start: number; end: number; path: string }[] = [];
    const matches_sources = text.matchAll(/^\/\/ (.*?)$/dgm);
    for (const match of matches_sources) {
      if (match.indices !== undefined) {
        list_sources.push({ start: match.indices[1][0], end: match.indices[1][1], path: match[1] });
      }
    }
    const text_parts: string[] = [];
    let text_index = 0;
    for (const item_import of list_imports) {
      const item_source = list_sources.at(Core.Array.BinarySearch.InsertionIndex(list_sources, item_import, (a, b) => a.start < b.start));
      if (item_source !== undefined) {
        try {
          const remapped_import_path = getRelativePath(file.src_path.value, item_source.path, item_import.path);
          text_parts.push(text.slice(text_index, item_import.start), remapped_import_path);
          text_index = item_import.end;
        } catch (error) {
          channel.log(`Skipping "${item_import.path}"`);
        }
      }
    }
    text_parts.push(text.slice(text_index));
    file.setText(text_parts.join(''));
  }
}

function getRelativePath(file_path: string, item_source_path: string, item_import_path: string) {
  if (item_import_path.startsWith('.') === true) {
    item_import_path = NodePlatform.Path.JoinStandard(NodePlatform.Path.GetParentPath(item_source_path), item_import_path);
  }
  let relative = NODE_PATH.relative(NodePlatform.Path.GetParentPath(file_path), NODE_URL.fileURLToPath(import.meta.resolve(item_import_path)));
  switch (NodePlatform.Path.GetExtension(relative)) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      relative = NodePlatform.Path.NewExtension(relative, '.js');
      break;
  }
  return NodePlatform.Path.Slice(relative, 0, 1) === '..' ? NodePlatform.Path.JoinStandard(relative) : `./${NodePlatform.Path.JoinStandard(relative)}`;
}
