import { ParseHTML } from 'src/lib/ericchase/Platform/Node/HTML Processor/ParseHTML.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ProcessorFunction, ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_HTMLImportConverter implements ProcessorModule {
  async onFilesAdded(files: ProjectFile[]) {
    for (const file of files) {
      if (false === file.relative_path.endsWith('.html')) {
        continue;
      }

      file.processor_function_list.push(this.processSourceFile);
    }
  }

  processSourceFile: ProcessorFunction = async (source_file: ProjectFile) => {
    let update_text = false;
    const root_element = ParseHTML((await source_file.getText()).trim(), { convert_tagnames_to_lowercase: true, self_close_void_tags: true });
    for (const script_tag of root_element.getElementsByTagName('script')) {
      const src = script_tag.getAttribute('src');
      if (src !== undefined) {
        if (getPathBase(src).endsWith('.ts')) {
          script_tag.setAttribute('src', `${src.slice(0, src.lastIndexOf('.ts'))}.js`);
          update_text = true;
        }
      }
    }
    if (update_text === true) {
      source_file.setText(root_element.toString());
    }
  };
}

function getPathBase(src: string) {
  try {
    return new Path(new URL(src).pathname).base;
  } catch (error) {
    return new Path(src).base;
  }
}
