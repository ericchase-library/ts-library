export function globMatch(platform, query, include_patterns, exclude_patterns) {
  let matched = false;
  for (const pattern of include_patterns) {
    if (platform.Utility.globMatch(query, pattern) === true) {
      matched = true;
      break;
    }
  }
  for (const pattern of exclude_patterns) {
    if (platform.Utility.globMatch(query, pattern) === true) {
      matched = false;
      break;
    }
  }
  return matched;
}
export async function globScan(platform, path, include_patterns, exclude_patterns) {
  const included = [];
  for (const pattern of include_patterns) {
    included.push(...await platform.Directory.globScan(path, pattern));
  }
  const excluded = [];
  for (const pattern of exclude_patterns) {
    excluded.push(...await platform.Directory.globScan(path, pattern));
  }
  return new Set(included).difference(new Set(excluded));
}
