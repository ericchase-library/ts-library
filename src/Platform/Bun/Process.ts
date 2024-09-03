export async function Run(cmd: string) {
  console.log(`[${new Date().toLocaleTimeString()}] > ${cmd}`);
  Bun.spawnSync(cmd.split(' '));
}
