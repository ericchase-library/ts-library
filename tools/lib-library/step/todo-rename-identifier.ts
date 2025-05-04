// import { visit } from 'ast-types';
// import recast from 'recast';
// import { BunPlatform } from '../../../src/lib/ericchase/platform-bun.js';
// import { NodePlatform } from '../../../src/lib/ericchase/platform-node.js';

// async function renameIdentifier(filePath: string, oldName: string, newName: string) {
//   const path = NodePlatform.Path.Resolve(filePath);
//   // Read the file
//   const sourceCode = await BunPlatform.File.Async_ReadText(path);

//   // Parse the source code into an AST
//   const ast = recast.parse(sourceCode);

//   // Traverse the AST and rename the identifier
//   visit(ast, {
//     visitIdentifier(path) {
//       if (path.node.name === oldName) {
//         path.node.name = newName;
//       }
//       this.traverse(path);
//     },
//   });

//   // Generate the modified code
//   const output = recast.print(ast).code;

//   // Write back to the file
//   await BunPlatform.File.Async_WriteText(path, output);

//   console.log(`Renamed '${oldName}' to '${newName}' in ${filePath}`);
// }

// // Usage
// renameIdentifier('./out/a.module.js', 'b2', 'b');
