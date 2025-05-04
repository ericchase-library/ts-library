import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { HTML_UTIL } from '../bundle/htmlutil.js';

export function Processor_HTML_Custom_Component_Processor(): Builder.Processor {
  return new Class();
}
class Class implements Builder.Processor {
  ProcessorName = Processor_HTML_Custom_Component_Processor.name;
  channel = Logger(this.ProcessorName).newChannel();

  component_map = new Map<string, Builder.SourceFile>();
  htmlfile_set = new Set<Builder.SourceFile>();

  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    const component_path = NodePlatform.Path.Join(builder.dir.lib, 'components');
    let trigger_reprocess = false;
    for (const file of files) {
      if (NodePlatform.Path.GetExtension(file.src_path.value) === '.html') {
        if (file.src_path.value.startsWith(component_path)) {
          this.component_map.set(NodePlatform.Path.GetName(file.src_path.value), file);
          trigger_reprocess = true;
        }
        file.addProcessor(this, this.onProcess);
        this.htmlfile_set.add(file);
      }
    }
    if (trigger_reprocess === true) {
      for (const file of this.htmlfile_set) {
        builder.refreshFile(file);
      }
    }
  }
  async onRemove(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    const component_path = NodePlatform.Path.Join(builder.dir.lib, 'components');
    let component_added = false;
    for (const file of files) {
      if (NodePlatform.Path.GetExtension(file.src_path.value) === '.html') {
        if (file.src_path.value.startsWith(component_path)) {
          this.component_map.delete(NodePlatform.Path.GetName(file.src_path.value));
          component_added = true;
        }
        this.htmlfile_set.delete(file);
      }
    }
    if (component_added === true) {
      for (const file of this.htmlfile_set) {
        builder.refreshFile(file);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    const source_html = (await file.getText()).trim();
    const source_node = HTML_UTIL.ParseDocument(source_html);
    let modified = false;
    for (const [component_name, component_file] of this.component_map) {
      const component_html = (await component_file.getText()).trim();
      const replacements = processCustomComponent(source_node, component_name, component_html);
      if (replacements > 0) {
        builder.addDependency(component_file, file);
        modified = true;
      }
    }
    if (modified === true) {
      file.setText(HTML_UTIL.GetHTML(source_node));
    }
  }
}

function processCustomComponent(source_document: HTML_UTIL.ClassDOMNode, component_name: string, component_html: string) {
  let replacements = 0;
  const placeholder_list = HTML_UTIL.QuerySelectorAll(source_document, component_name);
  for (const placeholder_node of placeholder_list) {
    const component_document = HTML_UTIL.ParseDocument(component_html);
    const component_node = component_document.childNodes.at(0);
    if (component_node !== undefined) {
      const attribute_names = new Set([...HTML_UTIL.GetAttributeNames(component_node), ...HTML_UTIL.GetAttributeNames(placeholder_node)]);
      for (const attribute_name of attribute_names) {
        switch (attribute_name) {
          case 'class':
            HTML_UTIL.MergeDelimitedAttribute(component_node, placeholder_node, attribute_name, ' ');
            break;
          case 'style':
            HTML_UTIL.MergeDelimitedAttribute(component_node, placeholder_node, attribute_name, ';');
            break;
          default:
            {
              const placeholdervalue = HTML_UTIL.GetAttribute(placeholder_node, attribute_name);
              if (placeholdervalue !== undefined) {
                HTML_UTIL.SetAttribute(component_node, attribute_name, placeholdervalue);
              }
            }
            break;
        }
      }
      const slot = HTML_UTIL.QuerySelector(component_document, 'slot');
      if (slot !== undefined) {
        HTML_UTIL.ReplaceNode(slot, placeholder_node.childNodes);
      } else {
        HTML_UTIL.AppendChild(component_node, placeholder_node.childNodes);
      }
      HTML_UTIL.ReplaceNode(placeholder_node, component_node);
      replacements += 1;
    }
  }
  return replacements;
}
