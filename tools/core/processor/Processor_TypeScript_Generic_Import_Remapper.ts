import { Core } from '../../../src/lib/ericchase/core.js';
import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
import { NODE_PATH, NODE_URL, NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { PathPattern } from './Processor_TypeScript_Generic_Bundler.js';

// Modules that import other modules will end up with broken import urls. These
// urls will need to be fixed (remapped) to the correct output file path. This

// also handles projects that have a `paths` setting in tsconfig.json.
export function Processor_TypeScript_Generic_Import_Remapper(): Builder.Processor {
  return new Class();
}
class Class implements Builder.Processor {
  ProcessorName = Processor_TypeScript_Generic_Import_Remapper.name;
  channel = Logger(this.ProcessorName).newChannel();

  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    for (const file of files) {
      const query = file.src_path.toStandard();
      if (BunPlatform.Glob.Match(query, `**/*${PathPattern.module}`)) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
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
            this.channel.log(`Skipping "${item_import.path}"`);
          }
        }
      }
      text_parts.push(text.slice(text_index));
      file.setText(text_parts.join(''));
    }
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
