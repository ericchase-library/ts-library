import { Provider } from 'tools/lib/platform/Provider.js';
import { SimplePath } from 'tools/lib/platform/SimplePath.js';

export function globMatch(platform: Provider, query: string, include_patterns: string[], exclude_patterns: string[]): boolean {
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

export async function globScan(platform: Provider, path: SimplePath, include_patterns: string[], exclude_patterns: string[]): Promise<Set<string>> {
  let matched = new Set<string>();
  for (const pattern of include_patterns) {
    matched = matched.union(await platform.Directory.globScan(path, pattern));
  }
  for (const pattern of exclude_patterns) {
    matched = matched.difference(await platform.Directory.globScan(path, pattern));
  }
  return matched;
}
