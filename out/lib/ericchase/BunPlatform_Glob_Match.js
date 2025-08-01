export function BunPlatform_Glob_Match(query, pattern) {
  return new Bun.Glob(pattern).match(query);
}
