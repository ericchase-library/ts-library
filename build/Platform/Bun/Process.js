import { ConsoleLog } from '../../Utility/Console.js';
export async function Run(cmd) {
  ConsoleLog(`[${new Date().toLocaleTimeString()}] > ${cmd}`);
  return Bun.spawn(cmd.split(' '), { stdout: 'inherit', stderr: 'inherit' }).exited;
}
export async function RunQuiet(cmd) {
  ConsoleLog(`[${new Date().toLocaleTimeString()}] > ${cmd}`);
  return Bun.spawn(cmd.split(' '), { stdout: 'ignore', stderr: 'ignore' }).exited;
}
