import { execFile } from 'node:child_process';
import { ConsoleLog } from '../../Utility/Console.js';
export function Run({ program, args = [], options = {} }) {
  return new Promise((resolve, reject) => {
    try {
      ConsoleLog(`[${new Date().toLocaleTimeString()}] > ${program} ${args.join(' ')}`);
      execFile(program, args, options, (error, stdout, stderr) => {
        if (error) return reject(error);
        return resolve({ stdout, stderr });
      });
    } catch (error) {
      return reject(error);
    }
  });
}
export async function PipeStdio(command) {
  try {
    const { stdout, stderr } = await command;
    if (stdout) ConsoleLog(stdout.slice(0, stdout.lastIndexOf('\n')));
    if (stderr) ConsoleLog(stderr.slice(0, stderr.lastIndexOf('\n')));
  } catch (error) {
    ConsoleLog(error);
  }
}
