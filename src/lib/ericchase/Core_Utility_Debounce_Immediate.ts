import { Core_Utility_Defer_Class } from './Core_Utility_Defer_Class.js';

export function Core_Utility_Debounce_Immediate<T extends (...args: any[]) => Promise<any> | any>(fn: T, delay_ms: number): (...args: Parameters<T>) => Promise<void> {
  /** aka leading edge debounce */
  /** debounced functions return nothing when called; by design */
  let defer = Core_Utility_Defer_Class();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout === undefined) {
      (async () => {
        await fn(...args);
        defer.resolve();
      })().catch((error) => {
        defer.reject(error);
      });
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      defer = Core_Utility_Defer_Class();
    }, delay_ms);
    return defer.promise;
  };
}
