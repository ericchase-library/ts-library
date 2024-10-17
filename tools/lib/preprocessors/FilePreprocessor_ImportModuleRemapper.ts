import { Path, type PathGroup, PathSeparator } from 'lib/ericchase/Platform/Node/Path.js';
import { DecodeBytes, EncodeText } from 'lib/ericchase/Utility/TextCodec.js';
import type { FilePreprocessor } from 'tools/lib/preprocessors/FilePreprocessor.js';
import { src_dir } from 'tools/scripts/build.js';

export class ImportModuleRemapperPreprocessor implements FilePreprocessor {
  constructor(public path_endings: string[]) {}
  pathMatches(path: Path | PathGroup) {
    for (const ending of this.path_endings) {
      if (path.path.endsWith(ending)) {
        return true;
      }
    }
    return false;
  }
  preprocess(bytes: Uint8Array, path_group: PathGroup) {
    let text = DecodeBytes(bytes);
    let start = text.indexOf(`from "${src_dir}/`);
    while (start !== -1) {
      const end = text.indexOf('";', start);
      const import_text = text.slice(start + `from "`.length, end);
      const current_path = path_group.relative_path;
      const module_path = new Path(text.slice(start + `from "${src_dir}/`.length, end)).newExt('.js');
      text = text.replace(import_text, getRelativePath(current_path, module_path));
      start = text.indexOf(`from "${src_dir}/`);
    }
    return { bytes: EncodeText(text) };
  }
}

function getRelativePath(from: Path, to: Path) {
  const segment_count = from.dir.split(PathSeparator).filter((part) => part.length > 0).length;
  const prefix = segment_count === 0 ? './' : '../'.repeat(segment_count);
  return prefix + to.standard_path;
}
