import { MatchAny } from 'src/lib/ericchase/Algorithm/String/Search/WildcardMatcher.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_TypeScriptGenericBundlerImportRemapper implements ProcessorModule {
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>) {
    for (const file of files) {
      if (file.src_path.endsWith('.module.ts') === false) {
        continue;
      }
      file.$processor_list.push(remapBundleImports);
    }
  }

  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}
}

async function remapBundleImports(builder: BuilderInternal, file: ProjectFile) {
  let text = await file.getText();
  let find_results = findImportPath(text);
  while (find_results.indexStart !== -1) {
    if (find_results.importPath.startsWith('src/')) {
      const new_import_path = file.src_path.getRelative(find_results.importPath);
      text = text.slice(0, find_results.indexStart) + new_import_path + text.slice(find_results.indexEnd);
      find_results.indexEnd = find_results.indexStart + new_import_path.length;
    }
    find_results = findImportPath(text, find_results.indexEnd);
  }
  file.setText(text);
}
function indexOf(source: string, target: string, position = 0) {
  const index = source.indexOf(target, position);
  return { start: index, end: index + target.length };
}
function lastIndexOf(source: string, target: string, position = 0) {
  const index = source.lastIndexOf(target, position);
  return { start: index, end: index + target.length };
}
function findImportPath(text: string, indexStart = 0) {
  while (indexStart !== -1) {
    const index_import = indexOf(text, 'import', indexStart);
    if (-1 === index_import.start) {
      break;
    }
    const index_semicolon = indexOf(text, ';', index_import.end);
    if (-1 === index_semicolon.start) {
      break;
    }

    const index_from = lastIndexOf(text.slice(index_import.end, index_semicolon.start), 'from', index_semicolon.start);
    index_from.start += index_import.end;
    index_from.end += index_import.end;
    if (-1 === index_from.start || index_from.start > index_semicolon.start) {
      break;
    }

    const import_slice = text.slice(index_from.end, index_semicolon.start).trim();
    if (MatchAny(import_slice, "'*.js'") || MatchAny(import_slice, '"*.js"')) {
      const { start, end } = indexOf(text, import_slice.slice(1, -1), index_from.end);
      return { indexStart: start, indexEnd: end, importPath: text.slice(start, end) };
    }
    indexStart = index_import.end;
  }

  return { indexStart: -1, indexEnd: -1, importPath: '' };
}
