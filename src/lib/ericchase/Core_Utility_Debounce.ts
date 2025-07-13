import { Core_Promise_Deferred_Class } from './Core_Promise_Deferred_Class.js';

export function Core_Utility_Debounce<T extends (...args: any[]) => Promise<any> | any>(fn: T, delay_ms: number): (...args: Parameters<T>) => Promise<void> {
  /** debounced functions return nothing when called; by design */
  let deferred = Core_Promise_Deferred_Class();
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await fn(...args);
        deferred.resolve();
      } catch (error) {
        deferred.reject(error);
      }
      deferred = Core_Promise_Deferred_Class();
    }, delay_ms);
    return deferred.promise;
  };
}
