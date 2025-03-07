import { BunProvider } from 'tools/lib/platform/Bun.js';
import { GenericProvider } from 'tools/lib/platform/generic_provider.js';

export type AvailableRuntimes = 'bun' | undefined;

export function getPlatform(runtime: AvailableRuntimes) {
  let provider = provider_cache.get(runtime);
  if (provider === undefined) {
    switch (runtime) {
      case 'bun':
        provider = new BunProvider();
        break;
      default:
        throw 'Not Implemented';
    }
    provider_cache.set(runtime, provider);
  }
  return provider;
}

const provider_cache = new Map<AvailableRuntimes, GenericProvider>();
