import node_fs from 'node:fs';
import { Path, PathGroup } from './Path.js';
export async function DeleteFile(path) {
  await node_fs.promises.unlink(path.toString());
}
export async function ReadFile(path) {
  return await node_fs.promises.readFile(path.toString(), { encoding: 'utf8' });
}
export async function RenameFile(from, to) {
  await node_fs.promises.rename(from.toString(), to.toString());
}
export async function WriteFile(path, text) {
  await node_fs.promises.writeFile(path.toString(), text, { encoding: 'utf8' });
}
export async function CleanDirectory(path) {
  await DeleteDirectory(path);
  await CreateDirectory(path);
}
export async function CreateDirectory(path, is_file = false) {
  if (path instanceof URL) {
    await node_fs.promises.mkdir(path, { recursive: true });
  } else {
    await node_fs.promises.mkdir(is_file === true ? Path.from(path).dir : path.path, { recursive: true });
  }
}
export async function DeleteDirectory(path) {
  await node_fs.promises.rm(path.toString(), { recursive: true, force: true });
}
