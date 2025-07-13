import { Core_Promise_Deferred_Class } from './Core_Promise_Deferred_Class.js';

export function Core_Utility_Debounce_Immediate<T extends (...args: any[]) => Promise<any> | any>(fn: T, delay_ms: number): (...args: Parameters<T>) => Promise<void> {
  /** aka leading edge debounce */
  /** debounced functions return nothing when called; by design */
  let deferred = Core_Promise_Deferred_Class();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout === undefined) {
      (async () => {
        await fn(...args);
        deferred.resolve();
      })().catch((error) => {
        deferred.reject(error);
      });
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      deferred = Core_Promise_Deferred_Class();
    }, delay_ms);
    return deferred.promise;
  };
}
