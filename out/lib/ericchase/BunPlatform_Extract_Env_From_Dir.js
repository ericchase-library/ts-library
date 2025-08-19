var __dirname = '';
import { NODE_PATH } from './NodePlatform.js';
export async function Async_BunPlatform_Extract_Env_From_Dir(options, ...names) {
  options.envfiles ??= [];
  const path = names.length === 0 ? NODE_PATH.join(__dirname, 'BunPlatform_Helper_Send_Env_To_Stdout.ts') : NODE_PATH.join(__dirname, 'BunPlatform_Helper_Send_Argv_To_Env_To_Stdout.ts');
  let cmd = ['bun'];
  for (const envfile of options.envfiles) {
    cmd.push(`--env-file=${envfile}`);
  }
  cmd.push('run', path);
  for (const name of names) {
    cmd.push(name);
  }
  console.log(cmd);
  const p0 = Bun.spawn(cmd, { cwd: options.cwd, stdout: 'pipe', stderr: 'pipe' });
  await p0.exited;
  const stderr = await new Response(p0.stderr).text();
  const stdout = await new Response(p0.stdout).text();
  try {
    return {
      error: stderr,
      type: 'json',
      value: JSON.parse(stdout),
    };
  } catch {}
  return {
    error: stderr,
    type: 'text',
    value: stdout,
  };
}
