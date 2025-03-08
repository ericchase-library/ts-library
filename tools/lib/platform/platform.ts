import { Provider } from 'tools/lib/platform/Provider.js';

export const UnimplementedProvider = new Provider();

export type AvailableRuntimes = 'bun';

const cache = new Map<AvailableRuntimes, Provider>();
export async function getPlatform(runtime: AvailableRuntimes): Promise<Provider> {
  if (cache.has(runtime) === false) {
    switch (runtime) {
      case 'bun':
        cache.set(runtime, (await import('tools/lib/platform/BunProvider.js')).default);
        break;
      default:
        throw `Runtime "${runtime}" Not Implemented`;
    }
  }
  return cache.get(runtime) ?? UnimplementedProvider;
}
