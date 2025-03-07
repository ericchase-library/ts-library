import node_fs from 'node:fs';

import { ArrayAreEqual } from 'src/lib/ericchase/Algorithm/Array.js';
import { U8Group, U8ToLines, U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { Spawn, SpawnSync } from 'src/lib/ericchase/Platform/Bun/Child Process.js';
import { CreateDirectory } from 'src/lib/ericchase/Platform/Node/Fs.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';

export async function ArchiveDirectory(input_directory: Path, output_file: Path) {
  try {
    await CreateDirectory(output_file, true);
    if (await Has7z()) {
      // the `./` prefix for paths are required
      const { stdout, stderr } = SpawnSync('7z', 'a', '-tzip', `./${output_file.path}`, `./${input_directory.path}/*`);
      for (const line of U8ToLines(stdout)) {
        if (line.startsWith('Archive size: ')) {
          ConsoleLog(`pack: [${line.slice('Archive size: '.length)}] ${output_file.path}`);
          break;
        }
      }
      if (stderr.byteLength > 0) {
        ConsoleError(U8ToString(stderr));
      }
    } else {
      // @ts-ignore
      const Archiver = await import('archiver');
      return new Promise<void>((resolve) => {
        const output_stream = node_fs.createWriteStream(output_file.path);
        const archiver = Archiver.create('zip', {
          zlib: { level: 9 }, // sets the compression level
        });
        output_stream.on('close', () => {
          ConsoleLog(`pack: [${archiver.pointer()}B] ${output_file.path}`);
          return resolve();
        });
        archiver.on('warning', (error: any) => {
          ConsoleError(error);
        });
        archiver.on('error', (error: any) => {
          ConsoleError(error);
        });
        archiver.pipe(output_stream);
        archiver.directory(input_directory.path, false);
        archiver.finalize();
      });
    }
  } catch (error) {
    ConsoleError('Error:\n', ArchiveDirectory.name);
    ConsoleLog(error);
  }
}

export async function Has7z() {
  try {
    const bytegroup = new U8Group();
    const process = Spawn('7z');
    for await (const bytes of process.stdout) {
      if (bytegroup.add(bytes) > 10) {
        process.kill();
        break;
      }
    }
    const bytes = bytegroup.get(10);
    const sequence = Uint8Array.from([55, 45, 90, 105, 112]);
    const offset = bytes[0] === 13 && bytes[1] === 10 ? 2 : bytes[0] === 13 || bytes[0] === 10 ? 1 : 0;
    return ArrayAreEqual(bytes.slice(offset, offset + sequence.byteLength), sequence);
  } catch (error) {}
  return false;
}
