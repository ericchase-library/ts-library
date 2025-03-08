import { Provider } from 'tools/lib/platform/provider.js';

export const UnimplementedProvider = new Provider();

export type AvailableRuntimes = 'bun';

const cache = new Map<AvailableRuntimes, Provider>();

export async function getPlatform(runtime: AvailableRuntimes): Promise<Provider> {
  if (!cache.has(runtime)) {
    switch (runtime) {
      case 'bun':
        cache.set(runtime, (await import('tools/lib/platform/Bun.js')).default);
        break;
      default:
        throw `Runtime "${runtime}" Not Implemented`;
    }
  }
  return cache.get(runtime) ?? UnimplementedProvider;
}
