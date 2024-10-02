import { Path } from '../../Path.js';
import { LoadIncludeFile, ProcessTemplateFile } from '../TemplateProcessor.js';

await LoadIncludeFile('button', new Path('./component/button.html'));
await ProcessTemplateFile(new Path('./index.template.html'), new Path('./index.html'));
