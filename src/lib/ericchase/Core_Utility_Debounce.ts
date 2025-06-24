import { Core_Utility_Class_Defer } from './Core_Utility_Class_Defer.js';

export function Core_Utility_Debounce<T extends (...args: any[]) => Promise<any> | any>(fn: T, delay_ms: number): (...args: Parameters<T>) => Promise<void> {
  /** debounced functions return nothing when called; by design */
  let defer = Core_Utility_Class_Defer();
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await fn(...args);
        defer.resolve();
      } catch (error) {
        defer.reject(error);
      }
      defer = Core_Utility_Class_Defer();
    }, delay_ms);
    return defer.promise;
  };
}
