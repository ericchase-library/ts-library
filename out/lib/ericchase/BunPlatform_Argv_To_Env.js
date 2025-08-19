export function BunPlatform_Argv_To_Env() {
  const kv = {};
  for (let i = 0;i < Bun.argv.length; i++) {
    const key = Bun.argv[i];
    const value = Bun.env[key];
    if (value !== undefined) {
      kv[key] = value;
    }
  }
  return kv;
}
