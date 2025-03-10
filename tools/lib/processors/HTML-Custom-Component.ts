import { ParseHTML } from 'src/lib/ericchase/Platform/NPM/NodeHTMLParser.js';
import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { BuilderInternal } from 'tools/lib/BuilderInternal.js';
import { Path } from 'src/lib/ericchase/Platform/FilePath.js';
import { ProcessorFunction, ProcessorModule } from 'tools/lib/Processor.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_HTMLCustomComponent implements ProcessorModule {
  component_map = new Map<string, ProjectFile>();

  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {
    const component_path = Path(builder.dir.lib, 'components');
    for (const file of files) {
      if (file.src_path.ext !== '.html') {
        continue;
      }
      if (file.src_path.startsWith(component_path)) {
        this.component_map.set(file.src_path.name, file);
      }
      file.$processor_list.push(this.processSourceFile);
    }
  }

  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}

  // fat arrow function here so that it binds to the class instance automatically
  processSourceFile: ProcessorFunction = async (builder: BuilderInternal, source_file: ProjectFile) => {
    let update_text = false;
    const root_element = ParseHTML((await source_file.getText()).trim(), { convert_tagnames_to_lowercase: true, self_close_void_tags: true });
    for (const [component_name, component_file] of this.component_map) {
      try {
        const placeholder_elements = root_element.getElementsByTagName(component_name);
        if (placeholder_elements.length > 0) {
          builder.addDependency(component_file, source_file);
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
