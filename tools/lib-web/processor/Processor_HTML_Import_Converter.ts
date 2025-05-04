import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { HTML_UTIL } from '../bundle/htmlutil.js';

export function Processor_HTML_Import_Converter(): Builder.Processor {
  return new Class();
}
class Class implements Builder.Processor {
  ProcessorName = Processor_HTML_Import_Converter.name;
  channel = Logger(this.ProcessorName).newChannel();

  async onAdd(builder: Builder.Internal, files: Set<Builder.SourceFile>): Promise<void> {
    for (const file of files) {
      if (NodePlatform.Path.GetExtension(file.src_path.value) === '.html') {
        file.addProcessor(this, this.onProcess);
      }
    }
  }

  async onProcess(builder: Builder.Internal, file: Builder.SourceFile): Promise<void> {
    const source_html = (await file.getText()).trim();
    const source_node = HTML_UTIL.ParseDocument(source_html);
    let modified = false;
    for (const script of HTML_UTIL.QuerySelectorAll(source_node, 'script')) {
      const src = HTML_UTIL.GetAttribute(script, 'src');
      if (src !== undefined) {
        const ext = NodePlatform.Path.GetExtension(src);
        switch (ext) {
          case '.js':
          case '.jsx':
          case '.ts':
          case '.tsx':
            HTML_UTIL.SetAttribute(script, 'src', `${src.slice(0, src.lastIndexOf(ext))}.js`);
            modified = true;
            break;
        }
      }
    }
    if (modified === true) {
      file.setText(HTML_UTIL.GetHTML(source_node));
    }
  }
}
