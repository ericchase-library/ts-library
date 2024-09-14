import node_child_process from 'node:child_process';
import { GlobSearch } from '../../Algorithm/String/Search/GlobSearch.js';
import { ConsoleLog } from '../../Utility/Console.js';
export function LSD({ path = '.', filter = '', options = {} }) {
  const program = 'lsd';
  const args = [path];
  if (filter) args.push(filter);
  return new Promise((resolve, reject) => {
    node_child_process.execFile(program, args, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      return resolve({ stdout, stderr });
    });
  });
}
export var PathKind;
((PathKind) => {
  PathKind[(PathKind['Directory'] = 1)] = 'Directory';
  PathKind[(PathKind['File'] = 2)] = 'File';
})((PathKind ||= {}));
export async function IterateLSD(command, filterkind = 1 /* Directory */ | 2 /* File */, callback) {
  const { stdout = '', stderr } = await command;
  if (stderr) ConsoleLog('LSD Error:', stderr);
  if (typeof stdout === 'string') {
    const results = stdout
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => ({
        kind: line[0] === 'D' ? 1 /* Directory */ : 2 /* File */,
        path: line.slice(2),
      }));
    if (callback) {
      for (const { kind, path } of results) {
        if (kind & filterkind) {
          callback({ kind, path });
        }
      }
    }
  }
}
export async function FilterDirectoryListing(options) {
  const directories = [];
  const files = [];
  let stdout = (await LSD({ path: options.path })).stdout;
  if (typeof stdout !== 'string') {
    stdout = new TextDecoder().decode(stdout);
  }
  for (const entry of stdout.split('\n') ?? []) {
    if (entry.length > 0) {
      const entry_name = entry.slice(2);
      if (entry[0] === 'D') {
        if (options.ignore_paths?.length === 0 || !options.ignore_paths?.some((ignore) => entry_name.includes(ignore))) {
          directories.push(entry_name);
        }
      } else {
        if (options.include?.length === 0 || options.include?.some((filter) => GlobSearch(entry_name, filter))) {
          if (options.exclude?.length === 0 || !options.exclude?.some((filter) => GlobSearch(entry_name, filter))) {
            files.push(entry_name);
          }
        }
      }
    }
  }
  return { directories, files };
}
export async function FilterDirectoryTree(options) {
  const directories = [options.path];
  const files = [];
  for (let i = 0; i < directories.length; i++) {
    let stdout = (await LSD({ path: directories[i] })).stdout;
    if (typeof stdout !== 'string') {
      stdout = new TextDecoder().decode(stdout);
    }
    for (const entry of stdout.split('\n') ?? []) {
      if (entry.length > 0) {
        const entry_name = entry.slice(2);
        const entry_path = `${directories[i]}/${entry_name}`;
        if (entry[0] === 'D') {
          if (options.ignore_paths?.length === 0 || !options.ignore_paths?.some((ignore) => entry_path.includes(ignore))) {
            directories.push(entry_path);
          }
        } else {
          if (options.include?.length === 0 || options.include?.some((filter) => GlobSearch(entry_name, filter))) {
            if (options.exclude?.length === 0 || !options.exclude?.some((filter) => GlobSearch(entry_name, filter))) {
              files.push(entry_path);
            }
          }
        }
      }
    }
  }
  return { directories, files };
}
