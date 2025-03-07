import { ParseHTML } from 'src/lib/ericchase/Platform/Node/HTML Processor/ParseHTML.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { ProcessorFunction, ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_HTMLCustomComponent implements ProcessorModule {
  component_map = new Map<string, ProjectFile>();

  async onFilesAdded(files: ProjectFile[]) {
    for (const file of files) {
      if (false === file.relative_path.endsWith('.html')) {
        continue;
      }

      if (file.relative_path.startsWith('lib/components/')) {
        this.component_map.set(Path.from(file.relative_path).name, file);
      }

      file.processor_function_list.push(this.processSourceFile);
    }
  }

  // fat arrow function here so that it binds to the class instance automatically
  processSourceFile: ProcessorFunction = async (source_file: ProjectFile) => {
    let update_text = false;
    const root_element = ParseHTML((await source_file.getText()).trim(), { convert_tagnames_to_lowercase: true, self_close_void_tags: true });
    for (const [component_name, component_file] of this.component_map) {
      try {
        const placeholder_elements = root_element.getElementsByTagName(component_name);
        if (placeholder_elements.length > 0) {
          source_file.addUpstream(component_file);
          for (const placeholder_element of placeholder_elements) {
            // Steps
            //
            // 1. Create new component element
            //
            placeholder_element.insertAdjacentHTML('afterend', (await component_file.getText()).trim());
            const component_element = placeholder_element.nextElementSibling;
            if (component_element) {
              //
              // 2. Overwrite attributes (merge class and style)
              //
              for (const [key, value] of Object.entries(placeholder_element.attributes)) {
                switch (key) {
                  case 'class':
                    component_element.setAttribute(key, [component_element.getAttribute(key), value].filter((_) => _).join(' '));
                    break;
                  case 'style':
                    component_element.setAttribute(key, [component_element.getAttribute(key), value].filter((_) => _).join(';'));
                    break;
                  default:
                    component_element.setAttribute(key, value);
                    break;
                }
              }
              //
              // 3. Move child nodes
              //
              const slot = component_element.querySelector('slot');
              if (slot) {
                slot.replaceWith(...placeholder_element.childNodes);
              } else {
                for (const child of placeholder_element.childNodes) {
                  component_element.appendChild(child);
                }
              }
              //
              // 4. Remove old element
              //
              placeholder_element.remove();
              update_text = true;
            }
          }
        }
      } catch (error) {
        ConsoleError(`ERROR: Processor: ${__filename} @${this.processSourceFile.name}, File: ${source_file.src_path}`);
        ConsoleLog(error);
        ConsoleLog();
      }
    }
    if (update_text === true) {
      source_file.setText(root_element.toString());
    }
  };
}
