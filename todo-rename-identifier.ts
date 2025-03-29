import { visit } from 'ast-types';
import recast from 'recast';
import { Path } from './src/lib/ericchase/Platform/FilePath.js';
import { getPlatformProvider } from './src/lib/ericchase/Platform/PlatformProvider.js';

const platform = await getPlatformProvider('bun');

async function renameIdentifier(filePath: string, oldName: string, newName: string) {
  // Read the file
  const sourceCode = await platform.File.readText(Path(filePath));

  // Parse the source code into an AST
  const ast = recast.parse(sourceCode);

  // Traverse the AST and rename the identifier
  visit(ast, {
    visitIdentifier(path) {
      if (path.node.name === oldName) {
        path.node.name = newName;
      }
      this.traverse(path);
    },
  });

  // Generate the modified code
  const output = recast.print(ast).code;

  // Write back to the file
  await platform.File.writeText(Path(filePath), output);

  console.log(`Renamed '${oldName}' to '${newName}' in ${filePath}`);
}

// Usage
renameIdentifier('./out/a.module.js', 'b2', 'b');
