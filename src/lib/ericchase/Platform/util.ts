import { CPath } from 'src/lib/ericchase/Platform/FilePath.js';
import { CPlatformProvider } from 'src/lib/ericchase/Platform/PlatformProvider.js';

export function globMatch(platform: CPlatformProvider, query: string, include_patterns: string[], exclude_patterns: string[]): boolean {
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

export async function globScan(platform: CPlatformProvider, path: CPath, include_patterns: string[], exclude_patterns: string[]): Promise<Set<string>> {
  let matched = new Set<string>();
  for (const pattern of include_patterns) {
    matched = matched.union(await platform.Directory.globScan(path, pattern));
  }
  for (const pattern of exclude_patterns) {
    matched = matched.difference(await platform.Directory.globScan(path, pattern));
  }
  return matched;
}
